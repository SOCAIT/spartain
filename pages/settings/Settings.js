import { View, Text , StyleSheet} from 'react-native'
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

  const {authState} = useContext(AuthContext)

  const [user, setUser] = useState(USER)

  useEffect(() => {
    setUser(prevUser => ({
      ...prevUser,
      username: authState.username,
      id: authState.id
    }));
     

  }, [])
  return (
    <View style={styles.container}>
       {/* <ProfileCard user={user} navigation={navigation} onPress={() => navigation.navigate("EditProfile")} /> */}

       <Text style={styles.header}> Settings</Text>

      <StylishMenu navigation={navigation} onPress_b={()=>navigation.navigate('Subscription')}/>
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