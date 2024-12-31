import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { useNavigation } from '@react-navigation/native';

import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext"
import { backend_url } from '../../config/config';
import { ScrollView } from 'react-native';

const target_goal_map = {
   "Muscle Gain" : "MG"
}
export default function EditProfileScreen({route}) {
  // State variables
   // State variables
  //  const { user } = route.params;
   const navigation = useNavigation();
   const {authState,  setAuthState } = useContext(AuthContext)

   const [age, setAge] = useState(authState.age); // Default age
   const [height, setHeight] = useState(authState.height); // Height in cm
   const [weight, setWeight] = useState(80); // Weight in kg
   const [gender, setGender] = useState('Female');
   const [targetGoal, setTargetGoal] = useState('Muscle Gain');
   const [preferences, setPreferences] = useState('');


  // Placeholder function for profile picture upload
  const uploadProfilePicture = () => {
    alert("Profile picture upload functionality goes here.");
  };
  
  useEffect(() => {
    console.log(authState)
  },[])


  const updateUser = () => {
    let data = {
       age: age,
       height_cm: height,
       user_target: target_goal_map[targetGoal],
       dietary_preferences: preferences
    }
    console.log(data)
    axios.put(`${backend_url}user/${authState.id}/`, data, ).then((response) => {
      if (response.data.error) {
        console.log(response.data.error)
        // setErrorMessage(response.data.error);  // Set error message
      } else {
        console.log("user updated")
        Alert.alert("Updated Successfully" )
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'Tabs' }]
        // })
      }
    }).catch((error) => {
      console.log(error)
      // Handle any other errors
    });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ArrowHeaderNew navigation={navigation} />

      

     <ScrollView>

      {/* Profile Picture Section */}
      <TouchableOpacity style={styles.profilePicContainer} onPress={uploadProfilePicture}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image
          style={styles.profilePic}
        />
        <View style={styles.cameraIconContainer}>
          <MaterialIcons name="camera-alt" size={24} color="#FF6A00" />
        </View>
      </TouchableOpacity>

      <View style={styles.row}>
     {/* Age Input */}
     
     <View style={{flex:1}}>
        <Text style={styles.labelText}> Age</Text>
        <View style={styles.inputContainer}>
            {/* <Text style={styles.sectionTitle}>Age</Text> */}
            <Icon name="birthday-cake" size={20} color="#FF6A00" style={styles.icon} />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(age)}
              onChangeText={(text) => setAge(Number(text))}
            />
          </View>
        </View>
      

      {/* Height Input */}
      <View style={{flex:1}}>
        <Text style={styles.labelText}> Height</Text>
        <View style={styles.inputContainer}>
          {/* <Text style={styles.sectionTitle}>Height (cm)</Text> */}
          <Icon  name="ruler-vertical" size={20} color="#FF6A00" style={styles.icon} />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(height)}
            onChangeText={(text) => setHeight(Number(text))}
          />
        </View>
       </View>
       </View>

      {/* Account Type Selection */}
      {/* <View style={styles.accountTypeContainer}>
        <Text style={styles.sectionTitle}>Account Type</Text>
        {['Regular', 'Coach', 'Nutritionist'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.accountTypeButton,
              accountType === type && styles.activeAccountType,
            ]}
            onPress={() => setAccountType(type)}
          >
            <Text
              style={[
                styles.accountTypeText,
                accountType === type && styles.activeAccountTypeText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* <View style={styles.weightContainer}>
        <Text style={styles.sectionTitle}>Weight</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={weight}
          onValueChange={(value) => setWeight(value)}
          minimumTrackTintColor="#FF6A00"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FF6A00"
        />
        <Text style={styles.weightValue}>{weight} kilograms</Text>
      </View> */}

      <View style={styles.row}>
          {/* Gender Picker */}
         <View style={{flex:1}}>
          <Text style={styles.labelText}> Gender</Text>
          <View style={styles.inputContainer}>
            <Icon name="transgender-alt" size={20} color="#FF6A00" style={styles.icon} />
            <Picker
              selectedValue={gender}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              selectionColor={COLORS.darkOrange}
              dropdownIconColor={COLORS.darkOrange}

              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Female" value="Female" style={styles.pickerItem} />
              <Picker.Item label="Male" value="Male"  style={styles.pickerItem}/>
              <Picker.Item label="Other" value="Other"  style={styles.pickerItem}/>

              {/* Add more gender options as needed */}
            </Picker>
          </View>
        </View>

          {/* Target Goal Picker */}
        <View style={{flex:1}}>
          <Text style={styles.labelText}> Target Goal</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="target" size={20} color="#FF6A00" style={styles.icon} />
            <Picker
              selectedValue={targetGoal}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor={COLORS.darkOrange}

              onValueChange={(itemValue) => setTargetGoal(itemValue)}
            >
              <Picker.Item label="Muscle Gain" value="Muscle Gain"  />
              <Picker.Item label="Fat Loss" value="Fat Loss" />
              <Picker.Item label="Maintenance" value="Maintenance" />
              <Picker.Item label="Endurance" value="Endurance" />
              {/* Add more goal options as needed */}
            </Picker>
          </View>
         </View>
      </View>

      {/* Preferences Text Box */}
     <View style={{flex:1}}>
        <Text style={styles.labelText}> Dietary preferences</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons name="edit" size={20} color="#FF6A00" style={styles.icon} />
        <TextInput
          style={styles.textArea}
          placeholder="Enter any specific physical or nutrition preferences..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={5}
          value={preferences}
          onChangeText={setPreferences}
        />
      </View>
    </View>

     

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={updateUser}>
        <Text style={styles.continueText}>Save</Text>
        <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={styles.iconRight} />
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    // paddingHorizontal: 20,
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
    


    //paddingTop: 40,
    
  },
  scroll:{
    flexGrow: 1, justifyContent: "center"
  },
  row:{
     flexDirection:"row",
     justifyContent: 'space-between', // Space between the inputs
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backArrow: {
     backgroundColor: "#333",
     borderRadius: 10,
     padding:5
     
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 10,
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    flex:1,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginHorizontal:5
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    height: 40,
    //fontSize:12
  },
  picker: {
    flex: 1,
    color: '#FFF',
  },
  pickerItem: {
    //fontSize: 12,
    //color: '#fff'
    // height:40,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  accountTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  activeAccountType: {
    backgroundColor: '#FF6A00',
  },
  accountTypeText: {
    color: '#FFF',
  },
  activeAccountTypeText: {
    color: '#FFF',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
  },
  weightContainer: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  weightValue: {
    color: '#FFF',
    textAlign: 'center',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  textArea:{
     color: "#fff"
  },
  labelText: {
    color: COLORS.white,
    marginBottom: 5
  }
});
