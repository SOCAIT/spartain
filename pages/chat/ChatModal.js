
import { View, Text , StyleSheet,KeyboardAvoidingView,TouchableWithoutFeedback, TextInput, PermissionsAndroid, Platform, ScrollView, TouchableOpacity, Image, Dimensions, Modal} from 'react-native'
import React, { useState, useEffect } from 'react';
import { GiftedChat, Bubble, Send, InputToolbar, ChatInput } from 'react-native-gifted-chat';

import axios from 'axios';

import CustomIconButton from '../../components/CustomIconButton';
import CustomTextInput from '../../components/CustomTextInput';
import CustomIcon from '../../components/CustomIcon';
    
import {backend_url} from '../../config/config'

import { COLORS, SIZES, FONTS } from '../../constants';


// import {RealmProvider, useRealm, useObject, useQuery} from '../../models'


// import { useExerciseHook } from '../../components/exercises/useExerciseHook';



import { useDatabase } from '../../db/DatabaseContext';
import ChatbotScreen from './ChatbotScreen';

const ChatModal = () => {

  const [messages, setMessages] = useState([]);

  const database = useDatabase();

  
  useEffect(() => {
    console.log(database)
    console.log(messages) 
    setMessages([
        {
        _id: 1,
        text: "Hey there! I'm your personal chatbot assistant, here to make your experience with Spartain smooth and enjoyable. How can I assist you today in regards to fitness?\n\n"
        +
        "Best Regards,\n"
        + "Lancea Chatbot 🤖",
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'Lancea',
            avatar: require("../../assets/icons/spartan_logo.png"),
        },
        },
    ]) 

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

  const onSend = async (newMessages = []) => {
    setMessages((previousMessages) =>
       GiftedChat.append(previousMessages, newMessages),
    );
    console.log("SEND")
    const text = newMessages[0].text;
    
  
    let file = ""
  
    // if (selectedPhoto != null){
    //    file = selectedPhoto.base64
    // }
  
    const data = {prompt: text, file:file}

    if (text.includes("/save_exercise") ) {
      let exercise = {
        "name": "barbell row",
        "sets": 3,
        "reps": 10, 
        "amount": 25,
        "muscle_type": "back",
        "unit": "kg"
      }
      
      addExercise(exercise)
      return
    } 

    if (text.includes("/get_exercises")){
       console.log("here")
       getExercises()
       return
    }

  
    if (text.includes("@predict") && selectedPhoto==null) {
      alert("Please load image if you will use @predict")
      return
    } 
  
    const response = await axios.post(backend_url +"prompt/", data, {  //formData
      headers: {
        'Content-Type': 'application/json' //'multipart/form-data',
      },
      //body: JSON.stringify(formData)
    });
  
    // Process the response if needed
    console.log('Response:', response.data);
  
  const answer_json = response.data
  
   //const answer_json = await response.json(); 
   console.log(answer_json)
   let message = {
       _id:  newMessages[0]._id +1 ,
       text: answer_json//answer_json['response']
       ,
       photo: selectedPhoto==null ? null : await readPhoto(),
       createdAt: new Date(),
       user: {
          _id: 2,
          name: 'Lancea',
          avatar: require("../../assets/icons/spartan_logo.png"),
         },
    }; 
    setMessages((previousMessages) =>
       GiftedChat.append(previousMessages, [message]),
    );
  };
  
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
  

  async function hasAndroidPermission() {
    //gconst permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_SMS : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const permission = PermissionsAndroid.PERMISSIONS.READ_SMS
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
   }
  
  /* List SMS messages matching the filter */
  var filter = {
    box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
  
    /**
     *  the next 3 filters can work together, they are AND-ed
     *  
     *  minDate, maxDate filters work like this:
     *    - If and only if you set a maxDate, it's like executing this SQL query:
     *    "SELECT * from messages WHERE (other filters) AND date <= maxDate"
     *    - Same for minDate but with "date >= minDate"
     */
    // minDate: 1554636310165, // timestamp (in milliseconds since UNIX epoch)
    // maxDate: 1556277910456, // timestamp (in milliseconds since UNIX epoch)
    // bodyRegex: '(.*)How are you(.*)', // content regex to match 
  
    // /** the next 5 filters should NOT be used together, they are OR-ed so pick one **/
    // read: 0, // 0 for unread SMS, 1 for SMS already read
    // _id: 1234, // specify the msg id
    // thread_id: 12, // specify the conversation thread_id
    // address: '+1888------', // sender's phone number
    // body: 'How are you', // content to match
    /** the next 2 filters can be used for pagination **/
    indexFrom: 0, // start from index 0
    maxCount: 10, // count of SMS to return each time
  };

  
  return (
    
      <View style={styles.screen}>

        <ChatbotScreen />
      {/* <GiftedChat
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
                      onPress={()=> getPhotosFromGallery()}  //getPhotosFromGallery
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
       />  */}
        </View>

       )
}

const styles = StyleSheet.create({
  screen:{
   //padding: 10,
   backgroundColor: COLORS.dark,
  //  flex: 1,
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

 
});

export default ChatModal