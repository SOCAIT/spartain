import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants';

import CustomLineChart from '../charts/CustomLineChart';

import Dropdown from '../Dropdown';



const dropdown_data =[
    {label:'Strength (4-5 reps)', value:1},
    {label:'Hypertrophy 1 (6-8 reps)', value:2},
    {label: 'Hypertrophy 2 (9-12 reps)', value:3}, 
    {label: 'Endurance (12+ reps)', value:4}
  ]


  // const reps_map ={
  //       "Strength (4-5 reps)" : "4-5 reps",
  //       "Hypertrophy 1 (6-8 reps))" : "6-8 reps",
  //       "Hypertrophy 2 (8-12 reps))" : "8-12 reps",
  //       "Endurance (12+ reps reps))" : "12+ reps reps",

  // }

  const reps_map =[
    "4-5 reps",
    "6-8 reps",
    "9-12 reps",
    "12+ reps",
]

const category_map =[
    "strength",
    "hypertrophy 1",
    "hypertrophy 2",
    "endurance",
]


// Mocked latest logs for different categories
const latestLogs = {
    "4-5 reps": '53.50',
    "6-8 reps": '40.00',
    "9-12 reps": '26.00',
    "12+ reps": '60.00',
  };
const LatestLog = ({exercise, data}) => {

    const [selected, setSelected] = useState(dropdown_data[0]);
    const [metric, setMetric] = useState('latest'); // 'latest' | 'max'

  
    //const [data, setData] = useState(dummy_data);

    const [logData, setLogData] = useState(latestLogs)

    const retrieveLatestLogs = () => {
       
    }
  
    const update_data = () => {
  
      mapped_selection = reps_map[(selected.value - 1)]
    //   console.log("MONTHS")
    //   console.log(mapped_selection)
    //   console.log(history)
  
    //   // Extract the months and data
    //   const months = Object.keys(history[mapped_selection]);
    //   const monthAbbreviations = months.map(month => new Date(month).toLocaleString('default', { month: 'short' }));
  
    //   // Example to create a dataset for one of the rep ranges
    //   const repsData = history[mapped_selection];
    //   const repsDataValues = Object.values(repsData);
  
    //   // Create the desired chart object
    //   const chartData = {
    //     labels: monthAbbreviations,
    //     datasets: [
    //       {
    //         data: repsDataValues
    //       },
    //       {
    //         data: [0], // min
    //         withDots: false, //a flage to make it hidden
  
    //       },
    //     ]
    //   };
  
      setLogData(data[mapped_selection])
  

    }
  
    useEffect(() => {
        setLogData(data)
    }, [data])
  
  return (
     <View style={styles.container}>
     <View style={{flexDirection: "row"}}>
       <Text style={styles.header}>Latest Logs</Text>
     </View>
     
      <View style={styles.latestLogsSection}>
       {/* {Object.entries(latestLogs).map(([category, weight], index) => (
         <View key={index} style={styles.logRow}>
           <Text style={styles.logCategory}>{category.charAt(0).toUpperCase() + category.slice(1)}:</Text>
           <Text style={styles.logWeight}>{weight}</Text>
         </View>
       ))} */}

        {/* <View style={styles.segmentedContainer}>
            <TouchableOpacity accessibilityRole={'tab'} accessibilityState={{ selected: metric==='latest' }} onPress={() => setMetric('latest')} style={[styles.segment, metric==='latest' && styles.segmentActive]}>
                <Text style={[styles.segmentText, metric==='latest' && styles.segmentTextActive]}>Latest</Text>
             </TouchableOpacity>
            <TouchableOpacity accessibilityRole={'tab'} accessibilityState={{ selected: metric==='max' }} onPress={() => setMetric('max')} style={[styles.segment, metric==='max' && styles.segmentActive]}>
                <Text style={[styles.segmentText, metric==='max' && styles.segmentTextActive]}>Max</Text>
            </TouchableOpacity>
         </View> */}

         <View  style={styles.logRow}>
          <Dropdown data={dropdown_data} onSelect={setSelected} />

           <View style={styles.logWeightCard}>
            <Text style={styles.metricLabel}>{metric === 'latest' ? 'Latest lifted' : 'Max lifted'}</Text>
            <Text style={styles.logWeight}>
              {(() => {
                const repKey = reps_map[selected.value-1]
                const value = typeof logData?.[metric]?.[repKey] === 'number' ? logData[metric][repKey] : 0
                return value > 0 ? `${value} kg` : 'No logs yet'
              })()}
            </Text>
         </View>
          </View>
        
         
     </View>
     </View>
  )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        marginBottom: 20,
        alignItems: 'center',
        width: "90%"
      },
      header: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop:15,
        color: COLORS.white
      },
    
    latestLogsSection: {
      backgroundColor: COLORS.dark,
      padding: 15,
      borderRadius: 10,
    },
    segmentedContainer:{
      flexDirection:'row',
      backgroundColor: COLORS.lightDark,
      borderRadius: 12,
      padding: 4,
      marginBottom: 12,
      marginTop: 4,
      width: '100%'
    },
    segment:{
      flex: 1,
      alignItems:'center',
      justifyContent:'center',
      paddingVertical: 10,
      borderRadius: 8
    },
    segmentActive:{
      backgroundColor: COLORS.darkOrange
    },
    segmentText:{
      color: COLORS.white,
      fontWeight: '600'
    },
    segmentTextActive:{
      color: COLORS.white
    },
    logRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    logCategory: {
      color: COLORS.white,
      fontSize: 16,
    },
    logWeightCard:{
      backgroundColor: COLORS.primary,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10
    },
    metricLabel:{
      color: COLORS.white,
      marginBottom: 4
    },
    logWeight: {
      color: COLORS.darkOrange,
      fontSize: 16,
      fontWeight: 'bold',
      
    },
  });

export default LatestLog