import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { AuthContext } from '../helpers/AuthContext';
import { ENTITLEMENT_ID, PREMIUM_FEATURES, PRODUCT_IDS } from '../config/subscription';

/**
 * RevenueCat Subscription Hook
 * 
 * Single source of truth for subscription status across the app.
 * - Uses RevenueCat entitlements exclusively
 * - Syncs with AuthContext for app-wide access
 * - Handles purchases, restoration, and validation
 * 
 * Usage:
 * const { checkSubscription, isSubscribed } = useSubscriptionRevenueCat();
 * const hasAccess = await checkSubscription('ai_agent');
 */
export const useSubscriptionRevenueCat = () => {
  const { updateSubscriptionStatus } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentOffering, setCurrentOffering] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);

  const listenerAttached = useRef(false);

  /**
   * Helper function to extract subscription info from CustomerInfo
   * @param {Object} customerInfo - RevenueCat CustomerInfo object
   * @returns {Object} { hasAccess, expiry, entitlement }
   */
  const extractSubscriptionInfo = (customerInfo) => {
    const entitlement = customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
    const hasAccess = !!entitlement;
    const expiry = entitlement?.expirationDate || null;
    
    return { hasAccess, expiry, entitlement };
  };

  useEffect(() => {
    // Attach a single global listener for customer info updates
    if (!listenerAttached.current) {
      try {
        Purchases.addCustomerInfoUpdateListener((info) => {
          const { hasAccess, expiry } = extractSubscriptionInfo(info);
          
          console.log('[RevenueCat] Subscription updated:', {
            hasAccess,
            expiry,
            entitlementId: ENTITLEMENT_ID
          });

          setIsSubscribed(hasAccess);
          setSubscriptionExpiry(expiry);
          
          // Keep AuthContext in sync
          updateSubscriptionStatus(hasAccess, expiry);
        });
        listenerAttached.current = true;
        console.log('[RevenueCat] Customer info listener attached');
      } catch (error) {
        console.error('[RevenueCat] Failed to attach listener:', error);
      }
    }

    // Load initial state
    (async () => {
      try {
        await refreshOfferings();
        await refreshSubscriptionStatus();
      } catch (error) {
        console.error('[RevenueCat] Initial load failed:', error);
      }
    })();
  }, []);

  /**
   * Fetch available subscription offerings from RevenueCat
   * @returns {Object|null} Current offering or null if failed
   */
  const refreshOfferings = async () => {
    try {
      console.log('[RevenueCat] Fetching offerings...');
      const offerings = await Purchases.getOfferings();
      const current = offerings?.current || null;
      
      setCurrentOffering(current);
      
      if (current) {
        console.log('[RevenueCat] Offerings loaded:', {
          monthly: !!current.monthly,
          annual: !!current.annual
        });
      } else {
        console.warn('[RevenueCat] No current offering found');
      }
      
      return current;
    } catch (error) {
      console.error('[RevenueCat] Failed to refresh offerings:', error);
      return null;
    }
  };

  /**
   * Get localized price string for a subscription package
   * @param {boolean} isYearly - Whether to get yearly or monthly price
   * @returns {string} Localized price string
   */
  const getProductPrice = (isYearly = false) => {
    const pkg = isYearly ? currentOffering?.annual : currentOffering?.monthly;
    return pkg?.product?.priceString || (isYearly ? '€69.99' : '€8.99');
  };

  /**
   * Handle subscription purchase
   * @param {boolean} isYearly - Whether to purchase yearly or monthly plan
   * @param {string} planType - 'Premium' or 'Free'
   * @returns {Object} { success: boolean, error?: string, cancelled?: boolean }
   */
  const handleSubscribe = async (isYearly = false, planType = 'Premium') => {
    // Handle free plan selection
    if (planType === 'Free') {
      setShowSubscriptionModal(false);
      return { success: true, plan: 'Free' };
    }

    try {
      setIsLoading(true);
      console.log('[RevenueCat] Starting purchase:', { isYearly, planType });
      
      // Ensure we have offerings
      const current = currentOffering || (await refreshOfferings());
      const selectedPackage = isYearly ? current?.annual : current?.monthly;
      
      if (!selectedPackage) {
        console.error('[RevenueCat] Package not available');
        Alert.alert('Subscription', 'Plan not available yet. Try again later.');
        return { success: false, error: 'Package not available' };
      }

      console.log('[RevenueCat] Purchasing package:', selectedPackage.identifier);
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      const { hasAccess, expiry } = extractSubscriptionInfo(customerInfo);

      console.log('[RevenueCat] Purchase response:', { hasAccess, expiry });

      // Ensure backend sync completed and fetch latest
      try {
        console.log('[RevenueCat] Syncing purchases...');
        await Purchases.syncPurchases();
        
        const latest = await Purchases.getCustomerInfo();
        const latestInfo = extractSubscriptionInfo(latest);
        
        if (latestInfo.hasAccess) {
          console.log('[RevenueCat] Subscription confirmed after sync');
          setIsSubscribed(true);
          setSubscriptionExpiry(latestInfo.expiry);
          await updateSubscriptionStatus(true, latestInfo.expiry);
          setShowSubscriptionModal(false);
          Alert.alert('Purchase successful!', 'Thanks for subscribing.');
          return { success: true };
        }
      } catch (syncError) {
        console.error('[RevenueCat] Sync failed:', syncError);
        // Continue with original response if sync fails
      }

      if (hasAccess) {
        console.log('[RevenueCat] Subscription confirmed');
        setIsSubscribed(true);
        setSubscriptionExpiry(expiry);
        await updateSubscriptionStatus(true, expiry);
        setShowSubscriptionModal(false);
        Alert.alert('Purchase successful!', 'Thanks for subscribing.');
        return { success: true };
      }

      console.error('[RevenueCat] Purchase completed but no access granted');
      return { success: false, error: 'Subscription not activated' };
    } catch (e) {
      // User cancelled the purchase
      if (e?.userCancelled) {
        console.log('[RevenueCat] Purchase cancelled by user');
        return { success: false, cancelled: true };
      }
      
      console.error('[RevenueCat] Purchase error:', e);
      Alert.alert('Purchase Error', e?.message || 'Failed to complete purchase.');
      return { success: false, error: e?.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Restore previous purchases
   * @returns {Object} { success: boolean, error?: string }
   */
  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      console.log('[RevenueCat] Restoring purchases...');
      
      const { customerInfo } = await Purchases.restorePurchases();
      const { hasAccess, expiry } = extractSubscriptionInfo(customerInfo);
      
      console.log('[RevenueCat] Restore result:', { hasAccess, expiry });
      
      setIsSubscribed(hasAccess);
      setSubscriptionExpiry(expiry);
      await updateSubscriptionStatus(hasAccess, expiry);
      
      Alert.alert(
        hasAccess ? 'Purchases Restored' : 'No Purchases Found',
        hasAccess ? 'Subscription restored.' : 'No active subscription found to restore.'
      );
      
      return { success: hasAccess };
    } catch (e) {
      console.error('[RevenueCat] Restore error:', e);
      Alert.alert('Restore Error', e?.message || 'Failed to restore purchases.');
      return { success: false, error: e?.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh subscription status from RevenueCat
   * @returns {Object} { isValid, source, expiryDate, lastChecked, error? }
   */
  const refreshSubscriptionStatus = async () => {
    try {
      console.log('[RevenueCat] Refreshing subscription status...');
      const info = await Purchases.getCustomerInfo();
      const { hasAccess, expiry } = extractSubscriptionInfo(info);

      console.log('[RevenueCat] Subscription status:', {
        hasAccess,
        expiry,
        entitlementId: ENTITLEMENT_ID
      });

      setIsSubscribed(hasAccess);
      setSubscriptionExpiry(expiry);
      await updateSubscriptionStatus(hasAccess, expiry);
      
      return {
        isValid: hasAccess,
        source: 'revenuecat',
        expiryDate: expiry,
        lastChecked: new Date().toISOString()
      };
    } catch (e) {
      console.error('[RevenueCat] Status refresh error:', e);
      setIsSubscribed(false);
      setSubscriptionExpiry(null);
      await updateSubscriptionStatus(false, null);
      return { isValid: false, source: 'revenuecat', error: e?.message };
    }
  };

  // Alias for compatibility with previous hook naming
  const validateSubscriptionStatus = refreshSubscriptionStatus;

  // Use premium features from config
  const premiumFeatures = useMemo(() => PREMIUM_FEATURES, []);

  /**
   * Check if user has access to a premium feature
   * @param {string} feature - Feature identifier to check
   * @returns {Promise<boolean>} True if user has access, false otherwise
   */
  const checkSubscription = async (feature) => {
    // Non-premium features are always accessible
    if (!premiumFeatures.includes(feature)) {
      console.log('[RevenueCat] Feature not premium:', feature);
      return true;
    }

    try {
      console.log('[RevenueCat] Checking access for feature:', feature);
      const info = await Purchases.getCustomerInfo();
      const { hasAccess } = extractSubscriptionInfo(info);
      
      console.log('[RevenueCat] Access check result:', {
        feature,
        hasAccess,
        entitlementId: ENTITLEMENT_ID
      });
      
      if (!hasAccess) {
        console.log('[RevenueCat] No access, showing subscription modal');
        setShowSubscriptionModal(true);
      }
      
      return hasAccess;
    } catch (error) {
      console.error('[RevenueCat] Check subscription error:', error);
      // On error, default to showing subscription modal (fail-safe)
      setShowSubscriptionModal(true);
      return false;
    }
  };

  /**
   * Open native subscription management screen
   * @param {boolean} isYearly - Whether to preselect yearly subscription
   * @returns {Promise<boolean>} True if successfully opened
   */
  const openManageSubscriptions = async (isYearly = false) => {
    try {
      if (Platform.OS === 'ios') {
        // iOS: Open App Store subscription management
        const appStoreUrl = 'itms-apps://apps.apple.com/account/subscriptions';
        const httpsUrl = 'https://apps.apple.com/account/subscriptions';
        
        try {
          const canOpen = await Linking.canOpenURL(appStoreUrl);
          if (canOpen) {
            console.log('[RevenueCat] Opening App Store subscriptions');
            await Linking.openURL(appStoreUrl);
            return true;
          }
        } catch (_) {
          console.warn('[RevenueCat] App Store URL not supported, using HTTPS');
        }
        
        await Linking.openURL(httpsUrl);
        return true;
      }

      // Android: Open Google Play subscription management
      const packageName = 'com.spartain';
      const sku = isYearly ? PRODUCT_IDS.YEARLY : PRODUCT_IDS.MONTHLY;
      const url = `https://play.google.com/store/account/subscriptions?sku=${encodeURIComponent(sku)}&package=${encodeURIComponent(packageName)}`;
      const fallbackUrl = 'https://play.google.com/store/account/subscriptions';
      
      const canOpen = await Linking.canOpenURL(url);
      console.log('[RevenueCat] Opening Play Store subscriptions');
      await Linking.openURL(canOpen ? url : fallbackUrl);
      return true;
    } catch (e) {
      console.error('[RevenueCat] Failed to open manage subscriptions:', e);
      Alert.alert('Manage Subscription', 'Unable to open subscription management.');
      return false;
    }
  };

  return {
    // State
    isSubscribed,
    subscriptionExpiry,
    isLoading,
    showSubscriptionModal,
    setShowSubscriptionModal,

    // Pricing/offerings
    currentOffering,
    refreshOfferings,
    getProductPrice,

    // Actions
    handleSubscribe,
    restorePurchases,
    checkSubscription,
    refreshSubscriptionStatus,
    validateSubscriptionStatus,
    openManageSubscriptions,
  };
};

export default useSubscriptionRevenueCat;
