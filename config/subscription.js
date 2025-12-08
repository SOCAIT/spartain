/**
 * RevenueCat Subscription Configuration
 * 
 * IMPORTANT: These values must match EXACTLY with your RevenueCat Dashboard
 * 
 * To verify:
 * 1. Log into https://app.revenuecat.com
 * 2. Navigate to your project → Entitlements
 * 3. Verify the EXACT entitlement identifier (case-sensitive)
 */

// Entitlement identifier from RevenueCat Dashboard
// This is the entitlement that grants premium access
export const ENTITLEMENT_ID = "Pro";

// Product IDs (must match App Store Connect / Google Play Console)
export const PRODUCT_IDS = {
  MONTHLY: "syntrafit_sub_monthly_2",
  YEARLY: "syntrafit_sub_yearly_2"
};

// Premium features requiring subscription
// Features NOT in this list are always accessible (free)
export const PREMIUM_FEATURES = [
  'ai_agent',
  'workout_plans',
  'nutrition_plans',
  'exercise_library',
  'meal_tracking',
  'progress_tracking'
];

// RevenueCat API Keys
// TODO: Move these to environment variables in production
export const REVENUECAT_KEYS = {
  ios: 'appl_KHUmUupOtJXSBnhSNbxpSyzZnOd',
  android: 'google_D3E15744'
};

