import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import {COLORS} from '../../constants';
import ArrowHeader from '../../components/ArrowHeader';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const UserReportScreen = ({route}) => {

  const { user } = route.params;
  const navigation = useNavigation();
  return (
    <View  style={styles.container}>
      <ArrowHeader  navigation={navigation} title={"Body Report Analysis"}/>
    <ScrollView>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>Overview of your current fitness status</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Strength Analysis</Text>
        <BarChart
          data={{
            labels: ["Chest", "Back", "Legs", "Arms", "Shoulders"],
            datasets: [{ data: [80, 70, 85, 75, 65] }]
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: COLORS.primary,
            backgroundGradientFrom: COLORS.primary,
            backgroundGradientTo: COLORS.primary,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: COLORS.dark,
            },
          }}
          style={styles.chart}
        />
      </View>

      {/* Spider Plot Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fitness Progress</Text>
        <ProgressChart
          data={{
            labels: ["Chest", "Back", "Legs", "Arms", "Delts" ],
             data: [0.9, 0.7, 0.5, 0.9, 0.3] 
          }}
          width={screenWidth - 40}
          height={220}
          strokeWidth={8}
          radius={26}
          chartConfig={{
            backgroundColor: COLORS.primary,
            backgroundGradientFrom: COLORS.primary,
            backgroundGradientTo: COLORS.primary,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 12,
            },

            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: COLORS.dark,
            },
           
          }}
          hideLegend={false}
          style={styles.chart}
          

        />
      </View>

      {/* Body Composition Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Body Composition</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Body Fat:</Text>
          <Text style={styles.statValue}>15%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Muscle Mass:</Text>
          <Text style={styles.statValue}>40%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Water Percentage:</Text>
          <Text style={styles.statValue}>55%</Text>
        </View>
      </View>

      {/* BMI and Other Health Metrics */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Health Metrics</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>BMI:</Text>
          <Text style={styles.statValue}>{user.bmi}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Weight:</Text>
          <Text style={styles.statValue}>{user.weight}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Height:</Text>
          <Text style={styles.statValue}>{user.height}</Text>
        </View>
      </View>

      {/* Optional: Progress/Trend Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Over Time</Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              { data: [65, 66, 67, 68, 69, 70] }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: COLORS.primary,
            backgroundGradientFrom: COLORS.primary,
            backgroundGradientTo: COLORS.primary,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: COLORS.dark,
            },
          }}
          style={styles.chart}
        />
      </View>  */}

     {/* Recommendations Section */}
     <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Text style={styles.recommendationText}>
          Based on your current stats, we recommend focusing on improving your leg strength and maintaining your body fat percentage.
        </Text>
      </View>
    </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 18,
    color: COLORS.lightGray3,
  },
  statValue: {
    fontSize: 18,
    color: COLORS.white,
  },
  recommendationText: {
    fontSize: 16,
    color: COLORS.lightGray,
    marginTop: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
    width: '100%'
  },
});

export default UserReportScreen;
