import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

import {
    LineChart,
    
  } from "react-native-chart-kit";
import { COLORS } from '../../constants';

const dummy_data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            data: [
              0,
              75,
              80,
              85,
              85,
              90
            ],
            
          },
          {
            data: [0], // min
            withDots: false, //a flage to make it hidden

          },
        ]
}

const chartConfig = {
    backgroundGradientFrom: "#ff6a00",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ff4500",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255,255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
  
     useShadowColorFromDataset: false // optional
  };

const CustomLineChart = ({chart_data}) => {

 
  return (
    <View>
      <LineChart
           data={chart_data}
           width={screenWidth * 0.8}
           height={256}
           verticalLabelRotation={0}
           chartConfig={chartConfig}
           style={{ 
            borderRadius: 15
          }}
           bezier
           withInnerLines={false}
           withOuterLines={false}
           withDots={false}

        />
    </View>
  )
}

export default CustomLineChart