import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../../constants';
import CustomLineChart from '../../components/charts/CustomLineChart';
import CustomProgressChart from '../../components/charts/CustomProgressChart';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InfoIcon from '../../components/InfoIcon';

const AnalyticalView = ({ route, navigation }) => {
  const { type, data, userWeight } = route.params;

  const calculateStatistics = useMemo(() => {
    if (!data || !userWeight || userWeight <= 0) return {
      current: { value: 0, percentage: 0 },
      goal: { value: 0, percentage: 0 },
      sixMonthProgress: { value: 0, percentage: 0 },
      oneMonthProgress: { value: 0, percentage: 0 },
      trend: 'neutral'
    };

    let current, goal, sixMonthProgress, oneMonthProgress, trend;
    
    switch(type) {
      case 'muscle':
        const muscleData = data.datasets[0].data;
        if (!muscleData || muscleData.length < 2) return {
          current: { value: 0, percentage: 0 },
          goal: { value: 0, percentage: 0 },
          sixMonthProgress: { value: 0, percentage: 0 },
          oneMonthProgress: { value: 0, percentage: 0 },
          trend: 'neutral'
        };

        const currentValue = (muscleData[muscleData.length - 1] / 100) * userWeight;
        const initialValue = (muscleData[0] / 100) * userWeight;
        const lastMonthValue = (muscleData[muscleData.length - 2] / 100) * userWeight;
        
        current = {
          value: currentValue.toFixed(1),
          percentage: muscleData[muscleData.length - 1]
        };
        
        goal = {
          value: (0.90 * userWeight).toFixed(1),
          percentage: 90
        };
        
        const sixMonthValueChange = currentValue - initialValue;
        const sixMonthPercentageChange = (sixMonthValueChange / (initialValue + 1)) * 100;
        
        sixMonthProgress = {
          value: sixMonthValueChange.toFixed(1),
          percentage: sixMonthPercentageChange.toFixed(1)
        };
        
        const oneMonthValueChange = currentValue - lastMonthValue;
        const oneMonthPercentageChange = (oneMonthValueChange / (lastMonthValue + 1)) * 100;
        
        oneMonthProgress = {
          value: oneMonthValueChange.toFixed(1),
          percentage: oneMonthPercentageChange.toFixed(1)
        };
        
        trend = sixMonthValueChange > 0 ? 'positive' : sixMonthValueChange < 0 ? 'negative' : 'neutral';
        
        return { current, goal, sixMonthProgress, oneMonthProgress, trend };
      
      case 'fat':
        const fatData = data.datasets[0].data;
        if (!fatData || fatData.length < 2) return {
          current: { value: 0, percentage: 0 },
          goal: { value: 0, percentage: 0 },
          sixMonthProgress: { value: 0, percentage: 0 },
          oneMonthProgress: { value: 0, percentage: 0 },
          trend: 'neutral'
        };

        const currentFatValue = (fatData[fatData.length - 1] / 100) * userWeight;
        const initialFatValue = (fatData[0] / 100) * userWeight;
        const lastMonthFatValue = (fatData[fatData.length - 2] / 100) * userWeight;
        
        current = {
          value: currentFatValue.toFixed(1),
          percentage: fatData[fatData.length - 1]
        };
        
        goal = {
          value: (0.05 * userWeight).toFixed(1),
          percentage: 5
        };
        
        const sixMonthFatChange = currentFatValue - initialFatValue;
        const sixMonthFatPercentage = (sixMonthFatChange / (initialFatValue + 1)) * 100;
        
        sixMonthProgress = {
          value: sixMonthFatChange.toFixed(1),
          percentage: sixMonthFatPercentage.toFixed(1)
        };
        
        const oneMonthFatChange = currentFatValue - lastMonthFatValue;
        const oneMonthFatPercentage = (oneMonthFatChange / (lastMonthFatValue + 1)) * 100;
        
        oneMonthProgress = {
          value: oneMonthFatChange.toFixed(1),
          percentage: oneMonthFatPercentage.toFixed(1)
        };
        
        trend = sixMonthFatChange < 0 ? 'positive' : sixMonthFatChange > 0 ? 'negative' : 'neutral';
        
        return { current, goal, sixMonthProgress, oneMonthProgress, trend };
      
      case 'groups':
        const values = data.data;
        if (!values || values.length < 2) return {
          current: { value: 0, percentage: 0 },
          goal: { value: 0, percentage: 0 },
          sixMonthProgress: { value: 0, percentage: 0 },
          oneMonthProgress: { value: 0, percentage: 0 },
          trend: 'neutral'
        };

        const currentGroupValue = (values.reduce((a, b) => a + b, 0) / values.length) * userWeight;
        const initialGroupValue = values[0] * userWeight;
        const lastMonthGroupValue = values[values.length - 2] * userWeight;
        
        current = {
          value: currentGroupValue.toFixed(1),
          percentage: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100)
        };
        
        goal = {
          value: (0.90 * userWeight).toFixed(1),
          percentage: 90
        };
        
        const sixMonthGroupChange = currentGroupValue - initialGroupValue;
        const sixMonthGroupPercentage = (sixMonthGroupChange / (initialGroupValue + 1)) * 100;
        
        sixMonthProgress = {
          value: sixMonthGroupChange.toFixed(1),
          percentage: sixMonthGroupPercentage.toFixed(1)
        };
        
        const oneMonthGroupChange = currentGroupValue - lastMonthGroupValue;
        const oneMonthGroupPercentage = (oneMonthGroupChange / (lastMonthGroupValue + 1)) * 100;
        
        oneMonthProgress = {
          value: oneMonthGroupChange.toFixed(1),
          percentage: oneMonthGroupPercentage.toFixed(1)
        };
        
        trend = sixMonthGroupChange > 0 ? 'positive' : sixMonthGroupChange < 0 ? 'negative' : 'neutral';
        
        return { current, goal, sixMonthProgress, oneMonthProgress, trend };
      
      default:
        return {
          current: { value: 0, percentage: 0 },
          goal: { value: 0, percentage: 0 },
          sixMonthProgress: { value: 0, percentage: 0 },
          oneMonthProgress: { value: 0, percentage: 0 },
          trend: 'neutral'
        };
    }
  }, [data, type, userWeight]);

  const getChartData = useMemo(() => {
    if (!data) return {
      title: "Analysis",
      component: null,
      description: "No data available"
    };

    switch(type) {
      case 'muscle':
        return {
          title: "Muscle Mass Analysis",
          component: <CustomLineChart chart_data={data} />,
          description: "Track your muscle mass progress over time. The chart shows your muscle mass percentage changes across different months."
        };
      case 'fat':
        return {
          title: "Fat Loss Analysis",
          component: <CustomLineChart chart_data={data} />,
          description: "Monitor your fat loss journey. This chart displays your body fat percentage changes and helps you stay on track with your goals."
        };
      case 'groups':
        return {
          title: "Muscle Groups Analysis",
          component: <CustomProgressChart chart_data={data} />,
          description: "View your progress across different muscle groups. Each segment represents your development in specific areas of your body."
        };
      default:
        return {
          title: "Analysis",
          component: null,
          description: "No data available"
        };
    }
  }, [data, type]);

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'positive':
        return <MaterialIcons name="trending-up" size={20} color="#4CAF50" />;
      case 'negative':
        return <MaterialIcons name="trending-down" size={20} color="#F44336" />;
      default:
        return <MaterialIcons name="trending-flat" size={20} color="#FFC107" />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getChartData.title}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.chartContainer}>
          {getChartData.component}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.description}>{getChartData.description}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Current:</Text>
              <View style={styles.valueWithIcon}>
                <Text style={styles.statValue}>
                  {calculateStatistics.current.value} kg ({calculateStatistics.current.percentage}%)
                </Text>
                <InfoIcon type="bodyComposition" size={14} />
              </View>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Goal:</Text>
              <View style={styles.valueWithIcon}>
                <Text style={styles.statValue}>
                  {calculateStatistics.goal.value} kg ({calculateStatistics.goal.percentage}%)
                </Text>
                <InfoIcon type="bodyComposition" size={14} />
              </View>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>6 Month Progress</Text>
              <View style={styles.progressValueContainer}>
                <Text style={[
                  styles.progressValue,
                  { color: type === 'fat' 
                    ? (calculateStatistics.sixMonthProgress.value < 0 ? '#4CAF50' : '#F44336')
                    : (calculateStatistics.sixMonthProgress.value > 0 ? '#4CAF50' : '#F44336')
                  }
                ]}>
                  {calculateStatistics.sixMonthProgress.value > 0 ? '+' : ''}{calculateStatistics.sixMonthProgress.value} kg
                </Text>
                <Text style={styles.progressPercentage}>
                  ({calculateStatistics.sixMonthProgress.percentage > 0 ? '+' : ''}{calculateStatistics.sixMonthProgress.percentage}%)
                </Text>
                {getTrendIcon(type === 'fat' 
                  ? (calculateStatistics.sixMonthProgress.value < 0 ? 'positive' : 'negative')
                  : (calculateStatistics.sixMonthProgress.value > 0 ? 'positive' : 'negative')
                )}
              </View>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>1 Month Progress</Text>
              <View style={styles.progressValueContainer}>
                <Text style={[
                  styles.progressValue,
                  { color: type === 'fat'
                    ? (calculateStatistics.oneMonthProgress.value < 0 ? '#4CAF50' : '#F44336')
                    : (calculateStatistics.oneMonthProgress.value > 0 ? '#4CAF50' : '#F44336')
                  }
                ]}>
                  {calculateStatistics.oneMonthProgress.value > 0 ? '+' : ''}{calculateStatistics.oneMonthProgress.value} kg
                </Text>
                <Text style={styles.progressPercentage}>
                  ({calculateStatistics.oneMonthProgress.percentage > 0 ? '+' : ''}{calculateStatistics.oneMonthProgress.percentage}%)
                </Text>
                {getTrendIcon(type === 'fat'
                  ? (calculateStatistics.oneMonthProgress.value < 0 ? 'positive' : 'negative')
                  : (calculateStatistics.oneMonthProgress.value > 0 ? 'positive' : 'negative')
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingTop: Platform.OS === 'ios' ? 36 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.dark,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  chartContainer: {
    backgroundColor: COLORS.dark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: COLORS.dark,
    borderRadius: 12,
    padding: 16,
  },
  description: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    color: '#999',
    fontSize: 14,
    marginRight: 8,
  },
  statValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  valueWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    gap: 16,
  },
  progressItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
  },
  progressLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  progressValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressPercentage: {
    color: '#999',
    fontSize: 14,
  },
});

export default AnalyticalView; 