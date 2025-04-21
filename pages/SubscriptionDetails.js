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

// Define your product IDs as set in your app store configuration.
const productIds = [
  "premium_monthly",
  "premium_yearly",
];

const ProSubscriptionScreen = ({ navigation }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [products, setProducts] = useState([]);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  useEffect(() => {
    // Initialize IAP connection and fetch subscription products
    const initIAP = async () => {
      try {
        const result = await RNIap.initConnection();
        console.log("IAP connection result:", result);
        const subscriptions = await RNIap.getSubscriptions(productIds);
        setProducts(subscriptions);
      } catch (err) {
        console.warn("IAP initialization error:", err);
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

  // Map selection to the correct product ID
  const getProductId = () => {
    if (!selectedPlan) return null;
    return isYearly ? "premium_yearly" : "premium_monthly";
  };

  // Request subscription purchase
  const handleSubscribe = async () => {
    const productId = getProductId();

    let prodObj = Platform.OS == "ios" ? { sku: productId } : { skus: [productId] }
    if (!productId) {
      Alert.alert("Subscription", "Please select a subscription plan.");
      return;
    }
    try {
      // await RNIap.requestSubscription(productId);
      await RNIap.requestSubscription(prodObj);
    } catch (err) {
      console.warn("Subscription request error:", err);
      Alert.alert("Subscription Error", err.message);
    }
  };

  // Optionally display prices from store; fallback to hard-coded prices if not available.
  const getProductPrice = () => {
    const id = isYearly ? "premium_yearly" : "premium_monthly";
    const product = products.find((p) => p.productId === id);
    if (product) return product.localizedPrice;
    // Fallback prices
    return isYearly ? "€59.99" : "€6.99";
  };

  return (
    <View style={styles.containerHeader}>
      <ArrowHeaderNew navigation={navigation} title={"Subscription"} />
      <View style={styles.containerBody}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Choose Your Plan</Text>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Yearly</Text>
            <Switch
              value={isYearly}
              onValueChange={() => setIsYearly(!isYearly)}
              thumbColor="#fff"
              trackColor={{ false: "#ccc", true: "#ffa500" }}
            />
            <Text style={styles.toggleText}>Monthly</Text>
          </View>

          <View style={styles.optionsContainer}>
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
              <Text style={styles.optionFeatures}>• Basic features</Text>
              <Text style={styles.optionFeatures}>• Limited access</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedPlan === "Premium" && styles.selectedOptionCard,
              ]}
              onPress={() => setSelectedPlan("Premium")}
            >
              <Text
                style={[
                  styles.optionTitle,
                  selectedPlan === "Premium" && styles.selectedOptionTitle,
                ]}
              >
                Premium
              </Text>
              <Text style={styles.optionPrice}>{getProductPrice()}/{isYearly ? 'year' : 'month'}</Text>
              <Text style={styles.optionFeatures}>• All features unlocked</Text>
              <Text style={styles.optionFeatures}>• Unlimited access</Text>
              <Text style={styles.optionFeatures}>• Priority support</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.subscribeButton, !selectedPlan && styles.disabledButton]}
            onPress={handleSubscribe}
            disabled={!selectedPlan}
          >
            <Text style={styles.subscribeText}>
              {selectedPlan === "Free" ? "Continue with Free" : "Subscribe Now!"}
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
                <MaterialIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>
                Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app.
                
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
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 10,
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
    paddingHorizontal: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleText: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 10,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: COLORS.darkOrange,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
  },
  selectedOptionCard: {
    borderColor: "#fff",
    borderWidth: 2,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  selectedOptionTitle: {
    color: "#fff",
  },
  optionPrice: {
    fontSize: 18,
    color: "#fff",
    marginTop: 5,
  },
  optionFeatures: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
  subscribeButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  subscribeText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#ccc",
    fontSize: 12,
  },
  footerSeparator: {
    color: "#ccc",
    fontSize: 12,
    marginHorizontal: 10,
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
});

export default ProSubscriptionScreen;