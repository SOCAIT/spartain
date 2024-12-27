import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
   

  const dummy_data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [
          0,
          0,
          0,
          0,
          0,
          0
        ]
      },
    ]
}

  

const ExerciseHistory = ({ history }) => {

  const [selected, setSelected] = useState(dropdown_data[1]);

  
  const [data, setData] = useState(dummy_data);

  const update_data = () => {

    mapped_selection = reps_map[(selected.value - 1)]
    console.log("MONTHS")
    console.log(mapped_selection)
    console.log(history)

    // Extract the months and data
    const months = Object.keys(history[mapped_selection]);
    const monthAbbreviations = months.map(month => new Date(month).toLocaleString('default', { month: 'short' }));

    // Example to create a dataset for one of the rep ranges
    const repsData = history[mapped_selection];
    const repsDataValues = Object.values(repsData);

    // Create the desired chart object
    const chartData = {
      labels: monthAbbreviations,
      datasets: [
        {
          data: repsDataValues
        },
        {
          data: [0], // min
          withDots: false, //a flage to make it hidden

        },
      ]
    };

    setData(chartData)

    // console.log(chartData);

    // // If you need to add more datasets, you can do so similarly for other rep ranges:
    // const createDataset = (label, data) => {
    //   return {
    //     label: label,
    //     data: Object.values(data)
    //   };
    // };

    // const datasets = Object.keys(data).map(repRange => createDataset(repRange, data[repRange]));

    // const chartDataComplete = {
    //   labels: monthAbbreviations,
    //   datasets: datasets
    // };
  }

  useEffect(() => {

      update_data()

  }, [selected])

  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row"}}>
        <Text style={styles.header}>History</Text>
        <Dropdown data={dropdown_data} onSelect={setSelected} />
      </View>
      

      <CustomLineChart chart_data={data}/>
      {/* {history.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text>Date: {item.date}</Text>
          <Text>Reps: {item.reps}</Text>
          <Text>Sets: {item.sets}</Text>
          <Text>Weight: {item.weight}</Text>
        </View>
      ))} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center'
    // width: "90%"
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop:15,
    color: COLORS.white
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ExerciseHistory;
