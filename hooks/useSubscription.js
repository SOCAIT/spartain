import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import { Alert, Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Product IDs matching SubscriptionDetails.js
const productIds = [
  "syntrafit_sub_monthly_2", // Production monthly
  "syntrafit_sub_monthly_2" // Production yearly
]; 

export const useSubscription = () => {
  const { authState, updateSubscriptionStatus } = useContext(AuthContext);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isValid: false,
    source: null, // 'iap', 'local', 'backend'
    expiryDate: null,
    lastChecked: null
  });

  useEffect(() => {
    initializeIAP();
    validateSubscriptionStatus();
    
    return () => {
      // Clean up IAP connection when hook unmounts
      RNIap.endConnection();
    };
  }, []);

  const initializeIAP = async () => {
    try {
      await RNIap.initConnection();
      const subscriptions = await RNIap.getSubscriptions({ skus: productIds });
      console.log('subscriptions', subscriptions);
      setProducts(subscriptions);
    } catch (error) {
      console.warn('IAP initialization error:', error);
    }
  };

  // Comprehensive subscription validation
  const validateSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      
      // Method 1: Check IAP receipts (most reliable)
      const iapStatus = await checkIAPSubscription();
      if (iapStatus.isValid) {
        await updateSubscriptionFromValidation(iapStatus);
        setIsLoading(false);
        return iapStatus;
      }

      // Method 2: Check local storage with expiry validation
      const localStatus = await checkLocalSubscription();
      if (localStatus.isValid) {
        await updateSubscriptionFromValidation(localStatus);
        setIsLoading(false);
        return localStatus;
      }

      // Method 3: Check backend (when available)
      // const backendStatus = await checkBackendSubscription();
      // if (backendStatus.isValid) {
      //   await updateSubscriptionFromValidation(backendStatus);
      //   setIsLoading(false);
      //   return backendStatus;
      // }

      // No valid subscription found
      const invalidStatus = {
        isValid: false,
        source: 'none',
        expiryDate: null,
        lastChecked: new Date().toISOString()
      };
      
      await updateSubscriptionFromValidation(invalidStatus);
      setIsLoading(false);
      return invalidStatus;
      
    } catch (error) {
      console.error('Subscription validation error:', error);
      setIsLoading(false);
      return { isValid: false, source: 'error', error: error.message };
    }
  };

  // Check IAP receipts for active subscriptions
  const checkIAPSubscription = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.log('Available purchases:', purchases);
      
      if (purchases.length === 0) {
        return { isValid: false, source: 'iap', reason: 'No purchases found' };
      }

      // Find valid subscription purchases
      const validSubscriptions = purchases.filter(purchase => {
        // Check if it's one of our subscription products
        if (!productIds.includes(purchase.productId)) return false;
        
        // For iOS, check if subscription is still active
        if (Platform.OS === 'ios' && purchase.originalTransactionDateIOS) {
          const purchaseDate = new Date(purchase.originalTransactionDateIOS);
          const now = new Date();
          
          // Calculate expiry based on product type
          const expiryDate = new Date(purchaseDate);
          if (purchase.productId === 'premium_yearly') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          } else {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          }
          
          return now < expiryDate;
        }
        
        // For Android, check transaction date
        if (Platform.OS === 'android' && purchase.purchaseTime) {
          const purchaseDate = new Date(parseInt(purchase.purchaseTime));
          const now = new Date();
          
          const expiryDate = new Date(purchaseDate);
          if (purchase.productId === 'premium_yearly') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          } else {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          }
          
          return now < expiryDate;
        }
        
        return true; // Default to valid if we can't determine expiry
      });

      if (validSubscriptions.length > 0) {
        const latestSubscription = validSubscriptions
          .sort((a, b) => {
            const dateA = Platform.OS === 'ios' 
              ? new Date(a.originalTransactionDateIOS || a.transactionDate)
              : new Date(parseInt(a.purchaseTime || a.transactionDate));
            const dateB = Platform.OS === 'ios'
              ? new Date(b.originalTransactionDateIOS || b.transactionDate)
              : new Date(parseInt(b.purchaseTime || b.transactionDate));
            return dateB - dateA;
          })[0];

        // Calculate expiry date
        const purchaseDate = Platform.OS === 'ios'
          ? new Date(latestSubscription.originalTransactionDateIOS || latestSubscription.transactionDate)
          : new Date(parseInt(latestSubscription.purchaseTime || latestSubscription.transactionDate));
        
        const expiryDate = new Date(purchaseDate);
        if (latestSubscription.productId === 'premium_yearly') {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        } else {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        }

        return {
          isValid: true,
          source: 'iap',
          expiryDate: expiryDate.toISOString(),
          lastChecked: new Date().toISOString(),
          productId: latestSubscription.productId
        };
      }

      return { isValid: false, source: 'iap', reason: 'No valid subscriptions' };
      
    } catch (error) {
      console.warn('IAP subscription check error:', error);
      return { isValid: false, source: 'iap', error: error.message };
    }
  };

  // Check local storage subscription with expiry validation
  const checkLocalSubscription = async () => {
    try {
      const isSubscribed = await AsyncStorage.getItem('isSubscribed') === 'true';
      const subscriptionExpiry = await AsyncStorage.getItem('subscriptionExpiry');
      
      if (!isSubscribed || !subscriptionExpiry) {
        return { isValid: false, source: 'local', reason: 'No local subscription data' };
      }

      const expiryDate = new Date(subscriptionExpiry);
      const now = new Date();
      
      if (now > expiryDate) {
        // Subscription has expired, clean up
        await AsyncStorage.setItem('isSubscribed', 'false');
        await AsyncStorage.removeItem('subscriptionExpiry');
        return { isValid: false, source: 'local', reason: 'Subscription expired' };
      }

      return {
        isValid: true,
        source: 'local',
        expiryDate: subscriptionExpiry,
        lastChecked: new Date().toISOString()
      };
      
    } catch (error) {
      console.warn('Local subscription check error:', error);
      return { isValid: false, source: 'local', error: error.message };
    }
  };

  // Update subscription status from validation result
  const updateSubscriptionFromValidation = async (status) => {
    setSubscriptionStatus(status);
    
    if (status.isValid) {
      await updateSubscriptionStatus(true, status.expiryDate);
    } else {
      await updateSubscriptionStatus(false, null);
    }
  };

  // Enhanced subscription checking with multiple validation layers
  const checkSubscription = async (feature) => {
    // List of features that require subscription
    const premiumFeatures = [
      'ai_agent',
      'workout_plans',
      'nutrition_plans',
      'exercise_library',
      'meal_tracking',
      'progress_tracking'
    ];

    if (feature === 'a') {
      setShowSubscriptionModal(true);
      return false;
    }

    // If feature doesn't require subscription, allow access
    if (!premiumFeatures.includes(feature)) {
      return true;
    }

    // Check if we need to revalidate (every 24 hours or if no recent check)
    const shouldRevalidate = !subscriptionStatus.lastChecked || 
      (new Date() - new Date(subscriptionStatus.lastChecked)) > 24 * 60 * 60 * 1000;

    if (shouldRevalidate) {
      const validationResult = await validateSubscriptionStatus();
      if (validationResult.isValid) {
        return true;
      }
    } else if (subscriptionStatus.isValid) {
      return true;
    }

    // No valid subscription found, show subscription modal
    setShowSubscriptionModal(true);
    return false;
  };

  const getProductId = (isYearly = false) => {
    // Use test product for now, switch to production when ready
    return "test_monthly_0";
    // return isYearly ? "premium_yearly" : "test_monthly_0";
  };

  const getProductPrice = (isYearly = false) => {
    const productId = getProductId(isYearly);
    const product = products.find((p) => p.productId === productId);
    if (product) return product.localizedPrice;
    // Fallback prices
    return isYearly ? "€69.99" : "€8.99";
  };

  const handleSubscribe = async (isYearly = false, planType = 'Premium') => {
    if (planType === 'Free') {
      // Handle free plan selection
      setShowSubscriptionModal(false);
      return { success: true, plan: 'Free' };
    }

    setIsLoading(true);
    
    try {
      const productId = getProductId(isYearly);
      console.log('productId', productId);
      
      if (!productId) {
        Alert.alert("Subscription", "Please select a subscription plan.");
        setIsLoading(false);
        return { success: false, error: "No product selected" };
      }

      // Platform-specific product object
      const prodObj = Platform.OS === "ios" 
        ? { sku: productId } 
        : { skus: [productId] };

      // Request subscription purchase
      await RNIap.requestSubscription(prodObj);

      // Set up purchase update listener for this specific purchase
      const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async (purchase) => {
          console.log("Purchase updated:", purchase);
          
          if (purchase.transactionReceipt) {
            try {
              // Finish the transaction
              await RNIap.finishTransaction(purchase);
              
              // Calculate expiry date based on subscription type
              const expiryDate = new Date();
              if (isYearly) {
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
              } else {
                expiryDate.setMonth(expiryDate.getMonth() + 1);
              }

              console.log('expiryDate', expiryDate);
              
              // Update subscription status with IAP source
              const newStatus = {
                isValid: true,
                source: 'iap',
                expiryDate: expiryDate.toISOString(),
                lastChecked: new Date().toISOString(),
                productId: purchase.productId
              };
              
              await updateSubscriptionFromValidation(newStatus);
              setShowSubscriptionModal(false);
              
              Alert.alert("Purchase successful!", "Thank you for subscribing to Fitness AI Pro.");
              
              // Clean up listener
              purchaseUpdateSubscription.remove();
              setIsLoading(false);
              
            } catch (finishErr) {
              console.warn("finishTransaction error:", finishErr);
              setIsLoading(false);
            }
          }
        }
      );

      // Set up purchase error listener
      const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
        console.log("Purchase error:", error);
        Alert.alert("Purchase Error", error.message);
        purchaseUpdateSubscription.remove();
        purchaseErrorSubscription.remove();
        setIsLoading(false);
      });

      return { success: true };
      
    } catch (error) {
      console.warn("Subscription request error:", error);
      Alert.alert("Subscription Error", error.message);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      const validationResult = await validateSubscriptionStatus();
      
      if (validationResult.isValid) {
        Alert.alert("Purchases Restored", "Your subscription has been restored.");
      } else {
        Alert.alert("No Purchases Found", "No previous purchases were found to restore.");
      }
      
      setIsLoading(false);
      return validationResult;
    } catch (error) {
      console.warn("Restore purchases error:", error);
      Alert.alert("Restore Error", "Failed to restore purchases.");
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Force refresh subscription status
  const refreshSubscriptionStatus = async () => {
    return await validateSubscriptionStatus();
  };

  return {
    isSubscribed: subscriptionStatus.isValid,
    subscriptionExpiry: subscriptionStatus.expiryDate,
    subscriptionSource: subscriptionStatus.source,
    lastChecked: subscriptionStatus.lastChecked,
    showSubscriptionModal,
    setShowSubscriptionModal,
    checkSubscription,
    handleSubscribe,
    restorePurchases,
    refreshSubscriptionStatus,
    validateSubscriptionStatus,
    getProductPrice,
    products,
    isLoading
  };
}; 