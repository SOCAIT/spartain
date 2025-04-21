import React, {useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import ArrowHeader from '../../components/ArrowHeader';
import InstructionsModal from '../../components/modals/InstructionModal';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

const RecipeScreen = ({navigation, route}) => {

  const [modalVisible, setModalVisible] = useState(false);

  const { meal } = route.params;


  
  const dummy_item = {
    name: 'Vegetables & Meat',
    // image:  require('../../assets/images/oat.webp') ,
    description: 'Instructions: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    nutrition: { carbs: 101, proteins: 24, fats: 12, sugars: 21 },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
     <ArrowHeaderNew navigation={navigation} title={meal.name} />
      {/* <View style={styles.imageContainer}>
        <Image   source={dummy_item.image ? { uri: dummy_item.image } : require('../../assets/images/oat.webp')}  style={styles.image} />
      </View> */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{meal.name}</Text>
        <Text style={styles.description}>{meal.description}</Text>
        <View style={styles.nutritionContainer}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{meal.carbs} g</Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{meal.proteins} g</Text>
            <Text style={styles.nutritionLabel}>Proteins</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{meal.fats} g</Text>
            <Text style={styles.nutritionLabel}>Fats</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{meal.calories} kcal</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>CHECK THE RECIPE</Text>
        </TouchableOpacity>
      </View>

      <InstructionsModal
     visible={modalVisible}
     onClose={() => setModalVisible(false)}
     instructions={" Recipe: " + meal.recipe}
   />
    </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 : 0
  },
  imageContainer: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: Dimensions.get('window').width * 0.35,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.lightGray3,
    textAlign: 'center',
    marginBottom: 20,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#999',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeScreen;
