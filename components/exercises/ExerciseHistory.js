import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
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

  const [selected, setSelected] = useState(dropdown_data[0]);
  const [period, setPeriod] = useState('weekly'); // default to weekly for recency

  
  const [data, setData] = useState(dummy_data);
  const [noData, setNoData] = useState(false);

  const update_data = () => {
    const mapped_selection = reps_map[(selected.value - 1)]
    const periodKey = period === 'weekly' ? 'weekly' : 'monthly'
    const periodData = history?.[periodKey] || {}
    let periods = Array.isArray(periodData?.periods) ? periodData.periods : []

    // If weekly, only keep last 5 weeks from now
    if (periodKey === 'weekly' && periods.length > 0) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 35)
      periods = periods.filter(p => {
        if (typeof p !== 'string' || p.length !== 10) return false
        const d = new Date(p)
        return !isNaN(d.getTime()) && d >= cutoff
      })
    }
    const repsDataMap = periodData?.average_weight?.[mapped_selection] || {}

    const labels = periods.map(p => {
      if (p.length === 7) { // YYYY-MM
        const dateObj = new Date(p + '-01')
        const shortMonth = dateObj.toLocaleString('default', { month: 'short' })
        return shortMonth
      }
      if (p.length === 10) { // YYYY-MM-DD
        const d = new Date(p)
        const m = d.toLocaleDateString('default', { month: 'short' })
        const day = d.toLocaleDateString('default', { day: '2-digit' })
        return `${m} ${day}`
      }
      return p
    })

    const values = periods.map(p => (typeof repsDataMap[p] === 'number' ? repsDataMap[p] : 0))

    const chartData = {
      labels: labels.length > 0 ? labels : dummy_data.labels,
      datasets: [
        {
          data: values.length > 0 ? values : dummy_data.datasets[0].data
        },
        {
          data: [0],
          withDots: false,
        },
      ]
    }

    setData(chartData)

    const hasData = values.some(v => typeof v === 'number' && v > 0)
    setNoData(!(hasData))

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
  }, [selected, period, history])

  return (
    <View style={styles.container}>
      <View style={{width:'100%'}}>
        <Text style={styles.header}>History</Text>
        <View style={styles.dropdownRow}>
          <Dropdown data={dropdown_data} onSelect={setSelected} />
        </View>
        <View style={styles.segmentedContainer}>
          <TouchableOpacity accessibilityRole={'tab'} accessibilityState={{ selected: period==='monthly' }} onPress={() => setPeriod('monthly')} style={[styles.segment, period==='monthly' && styles.segmentActive]}>
            <Text style={[styles.segmentText, period==='monthly' && styles.segmentTextActive]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole={'tab'} accessibilityState={{ selected: period==='weekly' }} onPress={() => setPeriod('weekly')} style={[styles.segment, period==='weekly' && styles.segmentActive]}>
            <Text style={[styles.segmentText, period==='weekly' && styles.segmentTextActive]}>Weekly</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <CustomLineChart chart_data={data}/>
        {noData && (
          <View style={styles.emptyOverlay} pointerEvents={'none'}>
            <Text style={styles.emptyText}>No data in this period</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
    width: "95%"
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop:15,
    color: COLORS.white
  },
  dropdownRow:{
    width:'100%',
    marginTop: 6,
    marginBottom: 6
  },
  segmentedContainer:{
    flexDirection:'row',
    backgroundColor: COLORS.lightDark,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
    marginLeft: 0,
    width:'100%'
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
  chartContainer:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  emptyOverlay:{
    position:'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems:'center'
  },
  emptyText:{
    color: COLORS.lightGray5
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
