import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const SectionHeader = ({title, childComponent}) => {
  return (
     <View style={styles.sectionContainer}>
     <View style={styles.sectionHeader}>
       <Text style={styles.sectionTitle}>{title}</Text>
       {/* <TouchableOpacity>
         <Text style={styles.seeAllText}>See All</Text>
       </TouchableOpacity> */}
     </View>
     <View style={styles.childStyle}> 
       {childComponent}
     </View>
     
   </View>
  )
}
const styles = StyleSheet.create({
    sectionContainer: {
        padding: 10,
       
      },
      sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
      childStyle: {
         alignItems: 'center'
      },
      seeAllText: {
        color: '#FF6A00',
        fontSize: 14,
      },
})

export default SectionHeader