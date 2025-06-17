import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS } from '../constants';
import IconButton from './IconButton';

const SubscriptionModal = ({ visible, onClose, navigation }) => {
  const features = [
    'AI Agent Coach',
    //'Access to all workout plans',
    'Custom  plans',
    'Progress tracking',
    'Exercise library',
    'Meal tracking',
    'Premium support'
  ];

  const handleSubscribe = () => {
    onClose(); // Close the modal first
    navigation.navigate('Subscription'); // Navigate to SubscriptionDetails page
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Upgrade to Premium</Text>
            <IconButton name="close" onPress={onClose} />
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.pricingContainer}>
              <Text style={styles.price}>$7.99</Text>
              <Text style={styles.period}>per month</Text>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Premium Features:</Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <IconButton name="check-circle" size={20} color={COLORS.darkOrange} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.subscribeButton}
            onPress={handleSubscribe}
          >
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.dark,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scrollView: {
    maxHeight: '70%',
  },
  pricingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.darkOrange,
  },
  period: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.7,
  },
  featuresContainer: {
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.white,
    marginLeft: 10,
  },
  subscribeButton: {
    backgroundColor: COLORS.darkOrange,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  subscribeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubscriptionModal; 