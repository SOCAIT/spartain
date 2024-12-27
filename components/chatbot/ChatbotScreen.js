import { View, Text , StyleSheet,KeyboardAvoidingView, TextInput, PermissionsAndroid, Platform, ScrollView, TouchableOpacity, Image, Dimensions, Modal} from 'react-native'
import React, { useState, useEffect } from 'react';
import { GiftedChat, Bubble, Send, InputToolbar, ChatInput } from 'react-native-gifted-chat';

import CustomIconButton from '../CustomIconButton';
import CustomTextInput from '../CustomTextInput';
import CustomIcon from '../CustomIcon';

import {backend_url} from '../../config/config'

import { COLORS, SIZES, FONTS } from '../../constants';

import axios from 'axios';

import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const ChatbotScreen = () => {

  const [messages, setMessages] = useState([
   
  ]);

  const [photos, setPhotos] = useState([])

  const [selectedPhoto, setSelectedPhoto] = useState({})
  const [photoModal, setPhotoModal] = useState(false)


 const windowWidth = Dimensions.get('window').width;
 const windowHeight = Dimensions.get('window').height;


 const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };


 

  useEffect(() => {
    console.log(messages) 
    setMessages([
        {
        _id: 1,
        text: 'Hello! How can I assist you today in regards to cyber security? ',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'Lancea',
            avatar: require("../../assets/icons/logo_lancea_pur.png"),
        },
        },
    ])

    getPhotosFromGallery()
}, [])

const renderBubble = props => {
   return (
    <Bubble
    {...props}
    wrapperStyle={{
      right: {
        backgroundColor: COLORS.primary
      }
    }}
    />
   );
 };

 onChange = value => {
   
 }
 const renderInputToolbar = props => (
   //<InputToolbar {...props}>


    <InputToolbar {...props} containerStyle={{borderTopWidth: 1.5, borderTopColor: COLORS.primary}} />
     
    // <View style={styles.container}>
    //   <View style={styles.inputContainer}>
    //      <CustomIconButton 
    //            uri={require('../../assets/icons/photo_filled.png' )} 
    //            color={COLORS.primary}
    //            size={35}
    //            onPress={openImagePicker}
    //      />
         

       
    //      <CustomIconButton 
    //            uri={require('../../assets/icons/send.png' )} 
    //            color={COLORS.primary}
    //            size={25}
    //            onPress={messages => onSend(messages)}
    //      />
    //   </View>
    // </View>
   //</InputToolbar>
 );



const onSend = async (newMessages = []) => {
    setMessages((previousMessages) =>
       GiftedChat.append(previousMessages, newMessages),
    );
    console.log("SEND")
    const text = newMessages[0].text;
    // let message = {
    //    _id: newMessages[0]._id,
    //    text,
    //    createdAt: new Date(),
    //    user: {
    //       _id: 1,
    //       name: 'React Native',
    //       avatar: 'https://placeimg.com/140/140/any',
    //    },
    // };

    console.log(backend_url +"prompt/")
    const response = await fetch(backend_url +"prompt/", {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       body: JSON.stringify({
          prompt: text
       }),
    })

   const answer_json = await response.json(); 
   console.log(answer_json)
   let message = {
       _id:  newMessages[0]._id +1 ,
       text: answer_json['response']
       ,
       createdAt: new Date(),
       user: {
          _id: 2,
          name: 'Lancea',
          avatar: require("../../assets/icons/logo_lancea_pur.png"),
         },
    }; 
    setMessages((previousMessages) =>
       GiftedChat.append(previousMessages, [message]),
    );
 };


 async function hasAndroidPermission() {
  const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
 }


 async function getPhotosFromGallery() {
  if (Platform.OS === "android" && !(await hasAndroidPermission())) {
    return;
  }

  CameraRoll.getPhotos({ first: 10, assetType: 'All',})
    .then(res => {
      //console.log(res.edges)
      setPhotos(res.edges)



      //navigation.navigate("Gallery", {photos: photos})
    })
    .catch((err) => {
      //Error Loading Images
      console.log(err)
   });

  //  {renderPhotosModal()}

   {openModal()}


}
 


  return (
           
           <GiftedChat
               messages={messages}
               showAvatarForEveryMessage={true}
               onSend={messages => onSend(messages)}
               user={{
                  _id: 1,
               }}
               renderBubble={renderBubble}
               //renderSend={props => <Send {...props} textStyle={{ color: '#007BFF' }} />}
               renderActions={() => {
                return <CustomIconButton 
                           uri={require('../../assets/icons/photo_filled.png' )} 
                           color={COLORS.primary}
                           size={30}
                           onPress={renderPhotosModal}
                     />
                  
               }}

               renderSend={(props) =>{
                return (
                  <Send
                      {...props} 
                  >
                      <CustomIcon 
                        uri={require('../../assets/icons/send.png' )} 
                        color={COLORS.primary}
                        size={25}
                        //onPress={messages => onSend(messages)}
                      />
                  </Send>
              );
               
               }}
               renderInputToolbar={props => renderInputToolbar(props)}
            />

          
            
            
      )


      function renderPhotosModal() {

        console.log("MODALL")
        console.log(photos)

          
        return (
          <Modal 
          animationType="slide"
          //transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View>
          {/* {renderHeader()} */}
          <ScrollView>
            {photos.map((p, i) => {
            return (
              <TouchableOpacity onPress={() => setSelectedPhoto({node:p.node})}>
      
              { p.node.type.includes("jpg") |  p.node.type.includes("png") |   p.node.type.includes("jpeg")
                   ? 
              <Image
                key={i}
                style={{
                  width: "100%",
                  height:  windowHeight > 700? 500 : 300 ,  marginRight:10
                }}
                source={{ uri: p.node.image.uri }}
              />
              :
              <Video
                key={i}
                style={{
                  width: "100%",
                  height:  windowHeight > 700? 500 : 300 ,  marginRight:10
                }}
                source={{ uri: p.node.image.uri }}
              /> }
              </TouchableOpacity>
            );
          })}
          </ScrollView>
          </View>
         </Modal>
        )
        
      }
  
}

const styles = StyleSheet.create({
    screen:{
     //padding: 10,
     backgroundColor: COLORS.white,
     flex: 1
    },
  
    logo: {
      marginTop: SIZES.padding ,
      marginBottom: SIZES.padding,
      height: 30,
      
      alignItems: 'center',
      justifyContent:'center',
   }, 


   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      // alignItems: 'center',
      // width: '10%',

    },
    input: {
      height: 40,
      width: '75%',
      borderColor: 'gray',
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: 10,
      marginBottom: 16,
      marginRight:5,
      marginTop: SIZES.padding,
      padding: SIZES.padding,
    },

})

export default ChatbotScreen