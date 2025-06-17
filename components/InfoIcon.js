import React, { useState } from 'react';
import { TouchableOpacity, Modal, View, Text, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';

// Define source mappings for different calculation types
const SOURCE_MAPPINGS = {
  calories: [
    {
      title: "Mifflin–St Jeor Equation (1990)",
      authors: "Jeor, S. T., Stein, E. A., Lichtenstein, A. H., & Van Horn, L.",
      description: "A new predictive equation for resting energy expenditure in healthy individuals.",
      url: "https://academic.oup.com/ajcn/article/51/2/241/4695224"
    },
    {
      title: "National Institutes of Health (NIH) – Dietary Guidelines for Americans, 2020–2025",
      authors: "NIH",
      description: "Recommendations on nutrient intake, meal patterns, and eating behaviors to promote health.",
      url: "https://www.dietaryguidelines.gov/sites/default/files/2020-12/Dietary_Guidelines_for_Americans_2020-2025.pdf"
    }
  ],
  macronutrients: [
    {
      title: "Harvard T.H. Chan School of Public Health – The Nutrition Source: Macronutrients",
      authors: "Harvard School of Public Health",
      description: "Overview of proteins, carbohydrates, fats, and their roles in a balanced diet.",
      url: "https://www.hsph.harvard.edu/nutritionsource/macronutrients/"
    },
    {
      title: "National Institutes of Health (NIH) – Dietary Guidelines for Americans, 2020–2025",
      authors: "NIH",
      description: "Recommendations on nutrient intake, meal patterns, and eating behaviors to promote health.",
      url: "https://www.dietaryguidelines.gov/sites/default/files/2020-12/Dietary_Guidelines_for_Americans_2020-2025.pdf"
    }
  ],
  bmi: [
    {
      title: "Centers for Disease Control and Prevention – Body Mass Index (BMI) Classification (2023)",
      authors: "CDC",
      description: "Defines BMI categories (underweight, healthy weight, overweight, obesity) and associated health risks.",
      url: "https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
    }
  ],
  heartRate: [
    {
      title: "American Heart Association – Target Heart Rate Guidelines (2023)",
      authors: "AHA",
      description: "Explains how to calculate and use heart‐rate zones for safe, effective cardio training.",
      url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates"
    }
  ],
  strengthTraining: [
    {
      title: "American College of Sports Medicine (ACSM) – Progression Models in Resistance Training for Healthy Adults (2009)",
      authors: "ACSM",
      description: "Position stand on designing and progressing resistance-training programs.",
      url: "https://journals.lww.com/acsm-msse/Fulltext/2009/03000/Progression_Models_in_Resistance_Training_for.26.aspx"
    },
    {
      title: "National Academy of Sports Medicine (NASM) – Optimum Performance Training (OPT™) Model (2021)",
      authors: "NASM",
      description: "Framework for periodized training, focusing on stabilization, strength, and power.",
      url: "https://www.nasm.org/certification/guides/opt-model"
    }
  ],
  physicalActivity: [
    {
      title: "World Health Organization – Global Recommendations on Physical Activity for Health (2010)",
      authors: "WHO",
      description: "Provides evidence-based guidance on minimum physical activity levels for adults.",
      url: "https://www.who.int/publications/i/item/9789241599979"
    },
    {
      title: "U.S. Department of Health and Human Services – Physical Activity Guidelines for Americans, 2nd Edition (2018)",
      authors: "HHS",
      description: "Defines recommended amounts of aerobic, muscle-strengthening, and flexibility exercises for various age groups.",
      url: "https://health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf"
    }
  ],
  bodyComposition: [
    {
      title: "Centers for Disease Control and Prevention – Body Mass Index (BMI) Classification (2023)",
      authors: "CDC",
      description: "Defines BMI categories (underweight, healthy weight, overweight, obesity) and associated health risks.",
      url: "https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
    }
  ],
  cardioExercise: [
    {
      title: "European Society of Cardiology – ESC Guidelines on Sports Cardiology and Exercise in Patients with Cardiovascular Disease (2020)",
      authors: "ESC",
      description: "Covers safe exercise prescription for patients with existing heart conditions.",
      url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Sports-Cardiology"
    }
  ]
};

const InfoIcon = ({ type, customSources, size = 16, style = {} }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Get sources for this calculation type
  const sources = customSources || SOURCE_MAPPINGS[type] || [];

  const openLink = (url) => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Unable to open link. Please try again.');
    });
  };

  if (sources.length === 0) {
    return null; // Don't show icon if no sources available
  }

  return (
    <>
      <TouchableOpacity 
        style={[styles.iconContainer, style]} 
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="info" size={size} color={COLORS.darkOrange} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scientific Sources</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalDescription}>
                This calculation is based on the following evidence-based sources:
              </Text>
              
              {sources.map((source, index) => (
                <View key={index} style={styles.sourceItem}>
                  <Text style={styles.sourceTitle}>{source.title}</Text>
                  <Text style={styles.sourceAuthors}>{source.authors}</Text>
                  <Text style={styles.sourceDescription}>{source.description}</Text>
                  
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => openLink(source.url)}
                  >
                    <MaterialIcons name="open-in-new" size={16} color={COLORS.darkOrange} />
                    <Text style={styles.linkText}>View Source</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              <View style={styles.disclaimerContainer}>
                <MaterialIcons name="warning" size={16} color={COLORS.darkOrange} />
                <Text style={styles.disclaimerText}>
                  These calculations are for informational purposes only. Always consult healthcare professionals for personalized medical advice.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginLeft: 4,
    padding: 2,
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
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: '85%',
  },
  modalDescription: {
    color: COLORS.lightGray,
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  sourceItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.darkOrange,
  },
  sourceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
    lineHeight: 18,
  },
  sourceAuthors: {
    fontSize: 12,
    color: COLORS.darkOrange,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  sourceDescription: {
    fontSize: 12,
    color: COLORS.lightGray,
    lineHeight: 16,
    marginBottom: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.darkOrange,
  },
  linkText: {
    fontSize: 12,
    color: COLORS.darkOrange,
    fontWeight: '600',
    marginLeft: 4,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.darkOrange,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.lightGray,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});

export default InfoIcon; 