import { View, Text , StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { Icon } from "@rneui/themed";
import {save,getValueFor} from '../helpers/Storage'
import {COLORS, SIZES, FONTS} from "../constants"

export default function Header({leftName, middleName, rightName, onPressLeft}) {
  return (
    <View style={styles.reactionsFooter}>
      <TouchableOpacity onPress={() =>{onPressLeft()} } >
      <Icon name={"chevron-back-outline"} type="ionicon" size={30} color={ COLORS.black} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center',justifyContent:'center'}}>
      <Text >{middleName}</Text>
      </View>
   </View>
  )
}

const styles = StyleSheet.create({
    reactionsFooter:{
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 0,//SIZES.padding *2,
        marginBottom: SIZES.padding,
        flexDirection: "row"
       
      },
})