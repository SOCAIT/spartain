import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  ScrollView
} from "react-native";
import ArrowHeaderNew from "../components/ArrowHeaderNew";
import { COLORS } from "../constants";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useSubscriptionRevenueCat from "../hooks/useSubscription.revenuecat";


const SubscriptionDetailsRevenueCat = ({ navigation }) => {
  const {
    currentOffering,
    refreshOfferings,
    handleSubscribe,
    openManageSubscriptions,
    refreshSubscriptionStatus,
    isLoading,
  } = useSubscriptionRevenueCat();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  useEffect(() => {
    refreshOfferings();
  }, []);

  const products = useMemo(() => {
    const list = [];
    if (currentOffering?.monthly) list.push({ key: 'monthly', pkg: currentOffering.monthly });
    if (currentOffering?.annual) list.push({ key: 'annual', pkg: currentOffering.annual });
    return list;
  }, [currentOffering]);

  const getProductDisplayName = (key) => {
    if (key === 'annual') return 'Fitness AI Pro (Yearly)';
    return 'Fitness AI Pro (Monthly)';
  };

  const getProductFeatures = (key) => {
    const base = ["• All features • Unlimited AI chat • Custom plans • Priority support"];
    if (key === 'annual') return [...base, '• Save 2 months with yearly plan'];
    return base;
  };

  const onSubscribe = async () => {
    if (selectedPlan === 'Free') {
      Alert.alert('Free Plan', "You're already on the free plan!");
      return;
    }
    if (!selectedPlan) {
      Alert.alert('Subscription', 'Please select a subscription plan.');
      return;
    }
    const isYearly = selectedPlan === 'annual';
    const res = await handleSubscribe(isYearly);
    try { await refreshSubscriptionStatus(); } catch (_) {}
    try { await refreshOfferings(); } catch (_) {}
    if (res?.success) {
      // Navigate to chat immediately
      try { navigation.navigate('Chat'); } catch (_) {}
      try { navigation.navigate('Tabs', { screen: 'Chat' }); } catch (_) {}
    }
  };

  return (
    <View style={styles.containerHeader}>
      <ArrowHeaderNew navigation={navigation} title={"Subscription"} />
      <View style={styles.containerBody}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Choose Your Plan</Text>

          {/* Banner when no paid subscriptions are available */}
          {!isLoading && products.length === 0 && (
            <Text style={styles.noProductsBanner}>Subscriptions are not yet available right now. You can still use the free plan.</Text>
          )}

          <View style={styles.optionsContainer}>
            {/* Free Plan */}
            <TouchableOpacity
              style={[styles.optionCard, selectedPlan === 'Free' && styles.selectedOptionCard]}
              onPress={() => setSelectedPlan('Free')}
            >
              <Text style={[styles.optionTitle, selectedPlan === 'Free' && styles.selectedOptionTitle]}>Free</Text>
              <Text style={styles.optionPrice}>€0.00</Text>
              <Text style={styles.optionFeatures}>• Basic features • Limited access</Text>
            </TouchableOpacity>

            {/* RevenueCat products (monthly/annual) */}
            {!isLoading && products.map(({ key, pkg }) => (
              <TouchableOpacity
                key={key}
                style={[styles.optionCard, selectedPlan === key && styles.selectedOptionCard]}
                onPress={() => setSelectedPlan(key)}
              >
                <Text style={[styles.optionTitle, selectedPlan === key && styles.selectedOptionTitle]}>
                  {getProductDisplayName(key)}
                </Text>
                <Text style={styles.optionPrice}>
                  {pkg?.product?.priceString}/{key === 'annual' ? 'year' : 'month'}
                </Text>
                {getProductFeatures(key).map((feature, idx) => (
                  <Text key={idx} style={styles.optionFeatures}>{feature}</Text>
                ))}
                {pkg?.product?.description ? (
                  <Text style={styles.productDescription}>{pkg.product.description}</Text>
                ) : null}
              </TouchableOpacity>
            ))}

            {/* Loading */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading subscription options...</Text>
              </View>
            )}
          </View>

          {/* Selection prompts */}
          {!selectedPlan && !isLoading && products.length > 0 && (
            <View style={styles.selectionPrompt}>
              <Text style={styles.selectionPromptIcon}>👆</Text>
              <Text style={styles.selectionPromptText}>Please select a plan above to continue</Text>
            </View>
          )}
          {!selectedPlan && !isLoading && products.length === 0 && (
            <View style={styles.selectionPrompt}>
              <Text style={styles.selectionPromptIcon}>👆</Text>
              <Text style={styles.selectionPromptText}>Please select the free plan above to continue</Text>
            </View>
          )}

          {/* Selected plan confirmation */}
          {selectedPlan && (
            <View style={styles.selectedPlanConfirmation}>
              <Text style={styles.selectedPlanText}>
                ✓ Selected: {selectedPlan === 'Free' ? 'Free Plan' : getProductDisplayName(selectedPlan)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.subscribeButton, (!selectedPlan || isLoading) && styles.disabledButton]}
            onPress={onSubscribe}
            disabled={!selectedPlan || isLoading}
          >
            <Text style={[styles.subscribeText, (!selectedPlan || isLoading) && styles.disabledButtonText]}>
              {isLoading ? 'Loading...' : !selectedPlan ? 'Select a Plan to Continue' : selectedPlan === 'Free' ? 'Continue with Free' : 'Subscribe Now!'}
            </Text>
          </TouchableOpacity>

          {/* Manage subscription */}
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => openManageSubscriptions(selectedPlan === 'annual')}
          >
            <Text style={styles.manageText}>Manage subscription</Text>
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
  manageButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  manageText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: 14,
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

export default SubscriptionDetailsRevenueCat;


