import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  ScrollView,
  Pressable
} from "react-native";
import ArrowHeaderNew from "../components/ArrowHeaderNew";
import { COLORS } from "../constants";
import * as RNIap from "react-native-iap";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const subscription_group = "syntrafit_sub_group";

// Define your product IDs as set in your app store configuration.
const productIds = [
  "syntrafit_sub_monthly_2",
  "syntrafit_sub_yearly_2"
  
];

const ProSubscriptionScreen = ({ navigation }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [products, setProducts] = useState([]);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
 
  useEffect(() => {
    // Initialize IAP connection and fetch subscription products
    const initIAP = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const result = await RNIap.initConnection();
        console.log("IAP connection result:", result);
        const subscriptions = await RNIap.getSubscriptions({skus: productIds });
        console.log("subscriptions", subscriptions);
        setProducts(subscriptions);
        
        if (subscriptions.length === 0) {
          setLoadError("No paid subscription plans available at the moment. Please try again later.");
        }
      } catch (err) {
        console.warn("IAP initialization error:", err);
        setLoadError("Unable to load subscription options. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initIAP();

    // Listen for purchase updates
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        console.log("Purchase updated:", purchase);
        // Validate purchase, verify on your backend if needed
        if (purchase.transactionReceipt) {
          try {
            await RNIap.finishTransaction(purchase);
            Alert.alert("Purchase successful!", "Thank you for subscribing.");
            navigation.goBack(); // Navigate back after successful purchase
          } catch (finishErr) {
            console.warn("finishTransaction error:", finishErr);
          }
        }
      }
    );

    // Listen for purchase errors
    const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.log("Purchase error:", error);
      Alert.alert("Purchase Error", error.message);
    });

    // Clean up the listeners on unmount
    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      RNIap.endConnection();
    };
  }, []);

  const retryLoadProducts = () => {
    const initIAP = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const result = await RNIap.initConnection();
        console.log("IAP connection result:", result);
        const subscriptions = await RNIap.getSubscriptions({skus: productIds });
        console.log("subscriptions", subscriptions);
        setProducts(subscriptions);
        
        if (subscriptions.length === 0) {
          setLoadError("No subscription plans available at the moment. Please try again later.");
        }
      } catch (err) {
        console.warn("IAP initialization error:", err);
        setLoadError("Unable to load subscription options. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initIAP();
  };

  // Request subscription purchase
  const handleSubscribe = async () => {
    if (selectedPlan === "Free") {
      Alert.alert("Free Plan", "You're already on the free plan!");
      return;
    }

    if (!selectedPlan) {
      Alert.alert("Subscription", "Please select a subscription plan.");
      return;
    }

    let prodObj = Platform.OS === "ios" ? { sku: selectedPlan } : { skus: [selectedPlan] };
    
    try {
      await RNIap.requestSubscription(prodObj);
    } catch (err) {
      console.warn("Subscription request error:", err);
      Alert.alert("Subscription Error", err.message);
    }
  };

  // Helper function to determine if a product is yearly based on product ID or title
  const isYearlyProduct = (product) => {
    return product.productId.includes('yearly') || 
           product.title?.toLowerCase().includes('yearly') || 
           product.description?.toLowerCase().includes('yearly');
  };

  // Helper function to get display name for product
  const getProductDisplayName = (product) => {
    if (isYearlyProduct(product)) {
      return "Fitness AI Pro (Yearly)";
    }
    return "Fitness AI Pro (Monthly)";
  };

  // Helper function to get product features
  const getProductFeatures = (product) => {
    const baseFeatures = [
      "• All features • Unlimited AI chat • Custom plans • Priority support"
    ];

    if (isYearlyProduct(product)) {
      return [...baseFeatures, "• Save 2 months with yearly plan"];
    }
    
    return baseFeatures;
  };

  return (
    <View style={styles.containerHeader}>
      <ArrowHeaderNew navigation={navigation} title={"Subscription"} />
      <View style={styles.containerBody}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Choose Your Plan</Text>

          {/* Banner message when no paid subscriptions are available */}
          {!isLoading && products.length === 0 && (
            <Text style={styles.noProductsBanner}>Subscriptions are not yet available right now. You can still use the free plan.</Text>
          )}

          <View style={styles.optionsContainer}>
            {/* Free Plan - Always Available */}
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedPlan === "Free" && styles.selectedOptionCard,
              ]}
              onPress={() => setSelectedPlan("Free")}
            >
              <Text
                style={[
                  styles.optionTitle,
                  selectedPlan === "Free" && styles.selectedOptionTitle,
                ]}
              >
                Free
              </Text>
              <Text style={styles.optionPrice}>€0.00</Text>
              <Text style={styles.optionFeatures}>• Basic features • Limited access</Text>
            </TouchableOpacity>

            {/* Dynamic Subscription Plans from Store */}
            {!isLoading && !loadError && products.map((product) => (
              <TouchableOpacity
                key={product.productId}
                style={[
                  styles.optionCard,
                  selectedPlan === product.productId && styles.selectedOptionCard,
                ]}
                onPress={() => setSelectedPlan(product.productId)}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    selectedPlan === product.productId && styles.selectedOptionTitle,
                  ]}
                >
                  {getProductDisplayName(product)}
                </Text>
                <Text style={styles.optionPrice}>
                  {product.localizedPrice}/{isYearlyProduct(product) ? 'year' : 'month'}
                </Text>
                {getProductFeatures(product).map((feature, index) => (
                  <Text key={index} style={styles.optionFeatures}>
                    {feature}
                  </Text>
                ))}
                
                {/* Show additional product info if available */}
                {product.description && (
                  <Text style={styles.productDescription}>
                    {product.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))}

            {/* Show loading state */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading subscription options...</Text>
              </View>
            )}

            {/* Show error state */}
            {!isLoading && loadError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{loadError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={retryLoadProducts}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Show fallback message if no products and no error */}
            {!isLoading && !loadError && products.length === 0 && (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>Premium subscriptions are not yet available.</Text>
                <Text style={styles.noProductsSubtext}>You can still use the free plan or try again later.</Text>
                <TouchableOpacity style={styles.retryButton} onPress={retryLoadProducts}>
                  <Text style={styles.retryButtonText}>Check Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Selection Prompt */}
          {!selectedPlan && !isLoading && !loadError && products.length > 0 && (
            <View style={styles.selectionPrompt}>
              <Text style={styles.selectionPromptIcon}>👆</Text>
              <Text style={styles.selectionPromptText}>
                Please select a plan above to continue
              </Text>
            </View>
          )}

          {/* Selection Prompt for no products case */}
          {!selectedPlan && !isLoading && !loadError && products.length === 0 && (
            <View style={styles.selectionPrompt}>
              <Text style={styles.selectionPromptIcon}>👆</Text>
              <Text style={styles.selectionPromptText}>
                Please select the free plan above to continue
              </Text>
            </View>
          )}

          {/* Selected Plan Confirmation */}
          {selectedPlan && selectedPlan !== "Free" && (
            <View style={styles.selectedPlanConfirmation}>
              <Text style={styles.selectedPlanText}>
                ✓ Selected: {products.find(p => p.productId === selectedPlan) 
                  ? getProductDisplayName(products.find(p => p.productId === selectedPlan))
                  : selectedPlan}
              </Text>
            </View>
          )}

          {selectedPlan === "Free" && (
            <View style={styles.selectedPlanConfirmation}>
              <Text style={styles.selectedPlanText}>
                ✓ Selected: Free Plan
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.subscribeButton, 
              (!selectedPlan || isLoading || (loadError && selectedPlan !== "Free")) && styles.disabledButton
            ]}
            onPress={handleSubscribe}
            disabled={!selectedPlan || isLoading || (loadError && selectedPlan !== "Free")}
          >
            <Text style={[
              styles.subscribeText,
              (!selectedPlan || isLoading || (loadError && selectedPlan !== "Free")) && styles.disabledButtonText
            ]}>
              {isLoading 
                ? "Loading..." 
                : !selectedPlan
                  ? "Select a Plan to Continue"
                  : selectedPlan === "Free" 
                    ? "Continue with Free" 
                    : "Subscribe Now!"
              }
            </Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => setPrivacyModalVisible(true)}>
              <Text style={styles.footerText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>•</Text>
            <TouchableOpacity onPress={() => setTermsModalVisible(true)}>
              <Text style={styles.footerText}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Privacy Policy Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={privacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#FF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>
                Your privacy is important to us. More analytical description can be found here: https://github.com/giannisp09/syntrafit/blob/main/README.md.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app.
                
                {"\n\n"}Information We Collect:
                {"\n"}• Personal information (name, email, etc.)
                {"\n"}• Usage data and analytics
                {"\n"}• Device information
                
                {"\n\n"}How We Use Your Information:
                {"\n"}• To provide and maintain our service
                {"\n"}• To notify you about changes
                {"\n"}• To provide customer support
                {"\n"}• To gather analysis for improvement
                
                {"\n\n"}Data Security:
                {"\n"}We implement appropriate security measures to protect your personal information.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>
                By using our app, you agree to these terms and conditions.
                
                {"\n\n"}Subscription Terms:
                {"\n"}• Monthly/Yearly billing cycles
                {"\n"}• Auto-renewal unless cancelled
                {"\n"}• Refund policy
                
                {"\n\n"}User Responsibilities:
                {"\n"}• Provide accurate information
                {"\n"}• Maintain account security
                {"\n"}• Comply with all applicable laws
                
                {"\n\n"}Service Limitations:
                {"\n"}• We reserve the right to modify or discontinue service
                {"\n"}• No guarantee of uninterrupted service
                {"\n"}• Content may be updated or removed
                {"\n\n"}• Additional Terms of Use: https://www.apple.com/legal/internet-services/itunes/dev/stdeula
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 : 10,
    paddingHorizontal: Platform.OS === 'ios' ? 15 : 8,
  },
  containerBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    width: '100%',
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 15,
  },
  optionCard: {
    backgroundColor: COLORS.darkOrange,
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: "100%",
  },
  selectedOptionCard: {
    borderColor: "#fff",
    borderWidth: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  selectedOptionTitle: {
    color: "#fff",
  },
  optionPrice: {
    fontSize: 16,
    color: "#fff",
    marginTop: 3,
  },
  optionFeatures: {
    color: "#fff",
    fontSize: 12,
    marginTop: 3,
  },
  subscribeButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  subscribeText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: "#ccc",
    fontSize: 11,
  },
  footerSeparator: {
    color: "#ccc",
    fontSize: 11,
    marginHorizontal: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: '80%',
  },
  modalText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productDescription: {
    color: '#ccc',
    fontSize: 11,
    marginTop: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  selectionPromptIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  selectionPromptText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedPlanConfirmation: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    marginBottom: 12,
  },
  selectedPlanText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: '#ccc',
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noProductsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  noProductsSubtext: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  noProductsBanner: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: '#FF6A00',
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ProSubscriptionScreen;