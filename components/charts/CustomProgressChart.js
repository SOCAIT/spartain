import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'

import { COLORS } from '../../constants';
import {
    ProgressChart,
  } from "react-native-chart-kit";





  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 112, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

const CustomProgressChart = ({chart_data}) => {
  const { width } = useWindowDimensions();
  
  // Set a fixed width that works well on all devices
  const chartWidth = Math.min(300, width - 40);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* <Text>CustomProgressChart</Text> */}
      <ProgressChart
        data={chart_data}
        width={chartWidth}
        height={220}
        strokeWidth={10}
        radius={24}
        chartConfig={chartConfig}
        hideLegend={false}
      />
    </View>
  )
}


export default CustomProgressChart