import React from 'react'
import { StyleSheet,Modal, Image, AppRegistry, Text, View, Button,TextInput ,TouchableOpacity,
   TouchableWithoutFeedback,
   KeyboardAvoidingView, 
    ScrollView,FlatList,Platform} from 'react-native';
import { useState, useEffect,useContext } from "react";
import axios from "axios";
import {AuthContext} from "../../helpers/AuthContext"
import { backend_url } from '../../config/config';
// import { SafeAreaView } from 'react-native-safe-area-context';

import {COLORS, SIZES, FONTS} from "../../constants"
//import {LinearGradient}  from 'expo-linear-gradient';
import { Icon } from "@rneui/themed";
import { useForm, Controller } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import SocialAuthentication from '../../components/authentication/SocialAuthentication';


function Signup({navigation}) {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState(null );
  const [modalVisible, setModalVisible] = useState(false);

  const {setAuthState} = useContext(AuthContext)

  const { register, setValue, handleSubmit, control, reset, formState: { errors,isValid } } = useForm({mode: 'onBlur'});

  useEffect( () => {
      axios.get("https://restcountries.com/v3.1/all").then((response) => {
          var  areaData = response.data.map(item => {
             return {
                 code: item.cca2,
                 name: item.name.common,
                 callingCode:  item.idd.root + (item.idd.suffixes == null ? "" : item.idd.suffixes[0]),
                 flag:  item.flags.png
                 //`https://countryflagsapi.com/png/${item.alpha2Code}`

             }
            })
             
             setAreas(areaData)
             if (areas.length > 0) {
                let defaultArea = areas.filter( a => { return a.code === "UY"})
                if (defaultArea.length > 0){
                   setSelectedArea(defaultArea[0])
                }

             }
        
      })
  }, [])

  const check_password = () => {
     let password_strength_url = ""
     axios.post(password_strength_url, {"password": password}).then ((res) => {
         


     })

  }

  const sign_up = data => {
    //let data ={username: username, password: password, email: email}
    console.log(data)
    axios.post(backend_url + "users/", data).then((response) =>{
      if (response.data.error) 
      {alert(response.data.error);
       }
      else {
       
      //localStorage.setItem("accessToken", response.data.access);
      console.log("Successfully Summoned")
      console.log(response.data)
      setAuthState({username:response.data.username,id: response.data.id,status:true});
      navigation.navigate("tabs");
      }
    });
  }

  const renderHeader = () => {
    return(
    <TouchableOpacity
              style={{
                 flexDirection: 'row',
                 alignItems: 'center',
                 marginTop: SIZES.padding * 2,
                 paddingHorizontal: SIZES.padding * 2,
              }}
              onPress={() => navigation.goBack()}
    
           >
        <Icon name={"arrow-back-outline"} type="ionicon" size={25} color={ COLORS.white} />
       

    </TouchableOpacity>)
  }

  const renderLogo = () => {
       return (
          <View style={styles.logo}>
            <Image 

            source={require('../../assets/icons/spartan_logo_white.png')}
            resizeMode="contain" 
            style={{width: "60%", height:180}}
            
            />

          </View>
       )
  }

  const renderForm = () => {
      return (
      <View style={styles.form}>

        {/* Full Name */}
        <View style={{marginTop: SIZES.padding*3}} >
          <Text style={{color: COLORS.white, }}> Username </Text>
          <Controller
            control={control}
            name="username"
            render={({field:{onChange, value, onBlur}}) =>(     
      
           <TextInput 
             style={styles.textInput}
             placeholder="Enter username"
             value={value}
             onBlur={onBlur}
             onChangeText ={value => onChange(value)}
            /> 
          )} 
          />
        </View>

        {/* email */}
        <View style={{marginTop: SIZES.padding*2}} >
          <Text style={{color: COLORS.white, }}> E-mail </Text>
          <Controller
            control={control}
            name="email"
            render={({field:{onChange, value, onBlur}}) =>(     
      
           <TextInput 
             style={styles.textInput}
             placeholder="Enter email"
             value={value}
             onBlur={onBlur}
             onChangeText ={value => onChange(value)}
          /> 
          )} 
          /> 
        </View>

         {/* password */}
         <View style={{marginTop: SIZES.padding*2}} >
          <View>
          <Text style={{color: COLORS.white, }}> Password </Text>
          <Controller
            control={control}
            name="password"
            render={({field:{onChange, value, onBlur}}) =>(     
      
           <TextInput 
             style={styles.textInput}
             placeholder="Enter password"
             value={value}
             onBlur={onBlur}
             secureTextEntry={!showPassword}
             onChangeText ={value => onChange(value)}
          /> 
          )} 
          />
          <TouchableOpacity
            style={styles.passwordVisibility}
            onPress={() => setShowPassword(!showPassword)}
          >
             <Icon name={"eye-outline"} type="ionicon" size={20} color={ COLORS.white} />
          </TouchableOpacity>
          </View>
          <View style={{marginTop: SIZES.padding}}></View>
         
        </View>

        <View style={{marginTop: SIZES.padding*2}}>
          <SocialAuthentication navigation={navigation}/>

        </View>

        {/* <View style={{marginTop: SIZES.padding*2}} >
          <Text style={{color: COLORS.white, }}> Phone Number </Text>
         
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.phone}
              onPress={() => setModalVisible(!modalVisible)} >
               <View style={{justifyContent: 'center'}}>
                <Icon name={"chevron-down-outline"} type="ionicon" size={20} color={ COLORS.white} />
               </View>

               <View stlye={{justifyContent: 'center', marginLeft: 5}}>
                    <Image
                       source= {{uri: (selectedArea !== null) ? selectedArea.flag : 'https://flagcdn.com/w320/us.png'}}
                       resizeMode="contain"
                       style={{width: 30,
                               height: 30
                              }}
                       />
               </View>

               <View style={{justifyContent: 'center', marginLeft: 5}}>
                    <Text style={{color: COLORS.white, ...FONTS.body3}}>
                      {(selectedArea !== null) ? selectedArea.code + selectedArea.callingCode: "+1"}</Text>
               </View>

             
            </TouchableOpacity>

            <TextInput style={styles.textInput} placeholder="Enter Phone Number"></TextInput>
          </View>

        </View> */}
     
      </View>
      )
  }

  const renderButton = () => {
    return (
      <View style={{margin: SIZES.padding *3}}>
         <TouchableOpacity
           style= {styles.button}
           onPress={handleSubmit(sign_up) }
         >
            <Text style={{color: COLORS.white, ...FONTS.h3}}> Continue</Text>      

         </TouchableOpacity>


      </View>


    )

  }

  // const signup = () => {
 
  //   console.log("logged in")
  //   setAuthState({username:"Slifer",id:1, status:true})
    
  // }

  function renderAreaCodesModal() {
     
     const renderItem = ({item}) => {
        return (
           <TouchableOpacity
             style= {{padding: SIZES.padding, flexDirection: 'row'}}
             onPress={() => {
               setSelectedArea(item)
               setModalVisible(false)
            }}
          >
            <Image 
               source={{uri: item.flag}}
               style={{
                  width:40,
                  height: 30,
                  marginRight: 10
               }}

            />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )
     }

     return (
        <Modal 
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >

          <TouchableWithoutFeedback
             onPress={() => setModalVisible(false)}         
          >
             <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
               <View
                 style={{
                    height: 400,
                    width: SIZES.width * 0.8,
                    backgroundColor: COLORS.lightGray,
                    borderRadius: SIZES.radius
                 }}
               >
                  <FlatList
                     data={areas}
                     renderItem={renderItem}
                     keyExtractor={(item) => item.code}
                     showsVerticalScrollIndicator={false}
                     style={{
                        padding: SIZES.padding * 2,
                        marginBottom: SIZES.padding * 2
                     }}
                  >

                  </FlatList>
               </View>
             </View>

          </TouchableWithoutFeedback>

        </Modal>
     )
  }

  return (
    < KeyboardAvoidingView
     behavior={Platform.OS === "ios" ? "padding" : null}
     style={{flex :1, backgroundColor: COLORS.dark}}>

     {/* <Li
        colors={[COLORS.primary, COLORS.secondary]}
        style={{flex :1}}
     > */}
       <ScrollView>
          {renderHeader()}
          {renderLogo()}
          {renderForm()}
          {renderButton()}

      {/* <View>
       <TextInput style={styles.textInput} placeholder="Enter username"/>
       <TextInput style={styles.textInput} placeholder="Enter email"/>
       <TextInput style={styles.textInput} secureTextEntry={true} placeholder="Enter password"/>
       <TextInput style={styles.textInput} secureTextEntry={true} placeholder="Confirm password"/>


       <Button title="Confirm" onPress={signup} />
      </View> */}
      </ScrollView>
     {/* </LinearGradient> */}
     {renderAreaCodesModal()}
     
    </ KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  
  textInput:{
     //marginVertical: SIZES.padding,
     borderBottomColor: COLORS.white,
     borderBottomWidth: 1,
     height: 40,
     color: COLORS.white,
     ...FONTS.body3,


  },

  phone: {
    width: 100,
    height: 40, 
    marginLeft:5,
    marginRight:35,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    flexDirection: 'row',
    
  },

  logo: {
     marginTop: SIZES.padding *5,
     height: 60,
     
     alignItems: 'center',
     justifyContent:'center',
  },

  form: {
    marginTop: SIZES.padding * 3,
    marginHorizontal: SIZES.padding * 3
  },
  button: {
    height: 60,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius / 1.5,
    alignItems: 'center',
    justifyContent:'center',
  },

  passwordVisibility: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    height: 30,
    width: 30,
  }


});




export default Signup;