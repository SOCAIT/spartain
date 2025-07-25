import { View, Text , StyleSheet, Alert} from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import StylishMenu from '../../components/StylishMenu'

import { COLORS } from '../../constants'
import ProfileCard from '../../components/ProfileCard'
import { AuthContext } from '../../helpers/AuthContext'
const USER= {
   "username": "Lelouch",
   "height": 185,
   "gender": "M",
   "weight": 87,
   "age": 25
}
 
const Settings = ({navigation}) => {

  const {authState, deleteAccount, logout} = useContext(AuthContext)

  const [user, setUser] = useState(USER)

  useEffect(() => {
    setUser(prevUser => ({
      ...prevUser,
      username: authState.username,
      id: authState.id
    }));
     

  }, [])

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, including:\n\n• Profile information\n• Body measurements\n• Workout history\n• Nutrition data\n• Subscription details",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete via Web",
          onPress: () => openWebDeletion()
        },
        {
          text: "Delete Now",
          style: "destructive",
          onPress: () => confirmDeleteAccount()
        }
      ]
    );
  };

  const openWebDeletion = () => {
    Alert.alert(
      "Web-based Account Deletion",
      "You will be redirected to a secure webpage where you can delete your account. This method allows you to complete the deletion process without requiring email or customer service.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Open Web Page",
          onPress: () => {
            // In a real app, you would open the URL in the browser
            // Linking.openURL('https://syntrafit.com/delete-account');
            Alert.alert(
              "Web Deletion",
              "In a production app, this would open:\nhttps://syntrafit.com/delete-account\n\nThis webpage allows secure account deletion without email or customer service.",
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Final Confirmation",
      "This is your final warning. Deleting your account will permanently remove all your data and cannot be undone.\n\nType 'DELETE' to confirm:",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "I understand, delete my account",
          style: "destructive",
          onPress: () => performDeleteAccount()
        }
      ]
    );
  };

  const performDeleteAccount = async () => {
    try {
      const result = await deleteAccount();
      if (result.success) {
        Alert.alert(
          "Account Deleted",
          "Your account has been successfully deleted. You will now be logged out.",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigation will be handled automatically by auth state change
              }
            }
          ]
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to delete account. Please try again or contact support.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again or contact support.",
        [{ text: "OK" }]
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
       {/* <ProfileCard user={user} navigation={navigation} onPress={() => navigation.navigate("EditProfile")} /> */}

       <Text style={styles.header}> Settings</Text>

      <StylishMenu 
        navigation={navigation} 
        onPress_b={()=>navigation.navigate('Subscription')}
        onPress_references={()=>navigation.navigate('AboutReferences')}
        onPress_delete={handleDeleteAccount}
        onPress_logout={handleLogout}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    //paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 40 :0,

    backgroundColor: COLORS.dark,
  },
  header: {
    fontSize: 22,
    color: COLORS.white,
    marginLeft: 20,
    marginTop: 30,
    fontWeight: 'bold',
    alignSelf: "flex-start"
  },
})
export default Settings