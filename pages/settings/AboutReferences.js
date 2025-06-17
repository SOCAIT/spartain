import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Platform,
  Alert 
} from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { COLORS } from '../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AboutReferences = ({ navigation }) => {
  const openLink = (url) => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Unable to open link. Please try again.');
    });
  };

  const references = [
    {
      title: "Mifflin–St Jeor Equation (1990)",
      authors: "Jeor, S. T., Stein, E. A., Lichtenstein, A. H., & Van Horn, L.",
      description: "A new predictive equation for resting energy expenditure in healthy individuals. Journal of the American College of Nutrition, 9(5): 439–448",
      url: "https://academic.oup.com/ajcn/article/51/2/241/4695224"
    },
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
    },
    {
      title: "American College of Sports Medicine (ACSM) – Progression Models in Resistance Training for Healthy Adults (2009)",
      authors: "ACSM",
      description: "Position stand on designing and progressing resistance-training programs.",
      url: "https://journals.lww.com/acsm-msse/Fulltext/2009/03000/Progression_Models_in_Resistance_Training_for.26.aspx"
    },
    {
      title: "American Heart Association – Target Heart Rate Guidelines (2023)",
      authors: "AHA",
      description: "Explains how to calculate and use heart‐rate zones for safe, effective cardio training.",
      url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates"
    },
    {
      title: "Centers for Disease Control and Prevention – Body Mass Index (BMI) Classification (2023)",
      authors: "CDC",
      description: "Defines BMI categories (underweight, healthy weight, overweight, obesity) and associated health risks.",
      url: "https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
    },
    {
      title: "National Institutes of Health (NIH) – Dietary Guidelines for Americans, 2020–2025",
      authors: "NIH",
      description: "Recommendations on nutrient intake, meal patterns, and eating behaviors to promote health.",
      url: "https://www.dietaryguidelines.gov/sites/default/files/2020-12/Dietary_Guidelines_for_Americans_2020-2025.pdf"
    },
    {
      title: "Harvard T.H. Chan School of Public Health – The Nutrition Source: Macronutrients",
      authors: "Harvard School of Public Health",
      description: "Overview of proteins, carbohydrates, fats, and their roles in a balanced diet.",
      url: "https://www.hsph.harvard.edu/nutritionsource/macronutrients/"
    },
    {
      title: "European Society of Cardiology – ESC Guidelines on Sports Cardiology and Exercise in Patients with Cardiovascular Disease (2020)",
      authors: "ESC",
      description: "Covers safe exercise prescription for patients with existing heart conditions.",
      url: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Sports-Cardiology"
    },
    {
      title: "National Academy of Sports Medicine (NASM) – Optimum Performance Training (OPT™) Model (2021)",
      authors: "NASM",
      description: "Framework for periodized training, focusing on stabilization, strength, and power.",
      url: "https://www.nasm.org/certification/guides/opt-model"
    },
    {
      title: "Academy of Nutrition and Dietetics – Evidence-Based Practice Guidelines (2022)",
      authors: "Academy of Nutrition and Dietetics",
      description: "Standards for developing personalized nutrition plans based on current research.",
      url: "https://www.eatrightpro.org/leadership/government-affairs/policy-positions/evidence-based-practice"
    }
  ];

  const ReferenceItem = ({ reference, index }) => (
    <View style={styles.referenceItem}>
      <View style={styles.referenceHeader}>
        <Text style={styles.referenceNumber}>{index + 1}.</Text>
        <View style={styles.referenceContent}>
          <Text style={styles.referenceTitle}>{reference.title}</Text>
          <Text style={styles.referenceAuthors}>{reference.authors}</Text>
          <Text style={styles.referenceDescription}>{reference.description}</Text>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink(reference.url)}
          >
            <MaterialIcons name="open-in-new" size={16} color={COLORS.darkOrange} />
            <Text style={styles.linkText}>View Source</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title="About & References" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.pageTitle}>Scientific References</Text>
            <Text style={styles.pageDescription}>
              SyntraFit is built on evidence-based health and fitness guidelines from leading medical and research institutions. 
              All recommendations are derived from peer-reviewed studies and established health authorities.
            </Text>
          </View>

          <View style={styles.disclaimerSection}>
            <MaterialIcons name="info" size={20} color={COLORS.darkOrange} />
            <Text style={styles.disclaimerText}>
              These sources inform our algorithms and recommendations. Always consult healthcare professionals for personalized medical advice.
            </Text>
          </View>

          <View style={styles.referencesSection}>
            <Text style={styles.sectionTitle}>References & Guidelines</Text>
            {references.map((reference, index) => (
              <ReferenceItem key={index} reference={reference} index={index} />
            ))}
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={styles.footerText}>
              © 2024 SyntraFit. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  pageDescription: {
    fontSize: 16,
    color: COLORS.lightGray,
    lineHeight: 22,
  },
  disclaimerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.darkOrange,
  },
  disclaimerText: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  referencesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 15,
  },
  referenceItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.darkOrange,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  referenceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkOrange,
    marginRight: 10,
    marginTop: 2,
  },
  referenceContent: {
    flex: 1,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
    lineHeight: 22,
  },
  referenceAuthors: {
    fontSize: 14,
    color: COLORS.darkOrange,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  referenceDescription: {
    fontSize: 14,
    color: COLORS.lightGray,
    lineHeight: 20,
    marginBottom: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.darkOrange,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.darkOrange,
    fontWeight: '600',
    marginLeft: 5,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3E',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default AboutReferences; 