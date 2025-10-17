import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS } from '../../constants';
import { runSahhaMinimalTest } from '../../services/HealthKitService';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomLineChart from '../../components/charts/CustomLineChart';
import CircularProgress from '../../components/charts/CircularProgress';
import { AuthContext } from '../../helpers/AuthContext';

const { width } = Dimensions.get('window');

const HealthKitDashboard = ({ navigation }: any) => {
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<{
    bpm: number | null;
    steps: number | null;
    sleepScore: number | null;
    wellbeingScore: number | null;
    activityScore: number | null;
  }>({
    bpm: null,
    steps: null,
    sleepScore: null,
    wellbeingScore: null,
    activityScore: null,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async (isRefresh = false) => {
    if (Platform.OS !== 'ios') {
      setError('Health data is only available on iOS devices');
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const result = await runSahhaMinimalTest();
      setHealthData({
        bpm: result.bpm,
        steps: result.steps,
        sleepScore: result.sleepScore,
        wellbeingScore: result.wellbeingScore,
        activityScore: result.activityScore,
      });
      setError(null);
    } catch (err) {
      console.error('HealthKit fetch error:', err);
      setError('Unable to fetch health data. Please check permissions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const onRefresh = () => {
    fetchHealthData(true);
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return COLORS.lightGray5;
    if (score >= 80) return COLORS.greenPrimary;
    if (score >= 60) return COLORS.darkOrange;
    return COLORS.red;
  };

  const getScoreLabel = (score: number | null) => {
    if (!score) return 'No Data';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const renderMetricCard = (
    title: string,
    value: number | null,
    unit: string,
    icon: string,
    color: string,
    subtitle?: string
  ) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <MaterialIcons name={icon} size={28} color={color} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <View style={styles.metricBody}>
        <Text style={styles.metricValue}>
          {value !== null ? value.toFixed(0) : '--'}
        </Text>
        <Text style={styles.metricUnit}>{unit}</Text>
      </View>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderScoreCard = (
    title: string,
    score: number | null,
    icon: string
  ) => {
    const scorePercentage = score !== null ? (score * 100) : null;
    const color = getScoreColor(scorePercentage);
    const label = getScoreLabel(scorePercentage);
    const displayValue = scorePercentage !== null ? scorePercentage.toFixed(2) : '--';

    return (
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <MaterialIcons name={icon} size={24} color={color} />
          <Text style={styles.scoreTitle}>{title}</Text>
        </View>
        <View style={styles.scoreBody}>
          <CircularProgress
            percentage={scorePercentage || 0}
            size={100}
            strokeWidth={8}
            color={color}
            textStyle={{}}
          />
          <View style={styles.scoreDetails}>
            <Text style={[styles.scoreValue, { color }]}>
              {displayValue}%
            </Text>
            <Text style={styles.scoreLabel}>{label}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ArrowHeaderNew navigation={navigation} title="Health Analytics" paddingTop={0} rightIcon={null} onRightIconPress={null} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.darkOrange} />
          <Text style={styles.loadingText}>Fetching health data...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ArrowHeaderNew navigation={navigation} title="Health Analytics" paddingTop={0} rightIcon={null} onRightIconPress={null} />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={COLORS.red} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchHealthData()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title="Health Analytics" paddingTop={0} rightIcon={null} onRightIconPress={null} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.darkOrange} />
        }
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Hi, {authState.username || 'User'}</Text>
          <Text style={styles.subtitleText}>Here's your health overview for the past 7 days</Text>
        </View>

        {/* Vital Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vital Metrics</Text>
          <View style={styles.metricsRow}>
            {renderMetricCard(
              'Heart Rate',
              healthData.bpm,
              'BPM',
              'favorite',
              COLORS.red,
              'Resting'
            )}
            {renderMetricCard(
              'Steps',
              healthData.steps,
              'steps',
              'directions-walk',
              COLORS.darkOrange,
              'Last 7 days'
            )}
          </View>
        </View>

        {/* Wellness Scores Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wellness Scores</Text>
          <View style={styles.scoresRow}>
            {renderScoreCard('Sleep Quality', healthData.sleepScore, 'bedtime')}
            {renderScoreCard('Wellbeing', healthData.wellbeingScore, 'mood')}
            {renderScoreCard('Activity', healthData.activityScore, 'directions-run')}
          </View>
        </View>

        {/* Insights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <MaterialIcons name="lightbulb" size={24} color={COLORS.darkOrange} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Keep Moving!</Text>
              <Text style={styles.insightText}>
                {healthData.steps && healthData.steps > 7000
                  ? 'Great job! You\'re averaging over 7,000 steps per day.'
                  : 'Try to reach 10,000 steps daily for optimal health.'}
              </Text>
            </View>
          </View>
          {healthData.sleepScore && healthData.sleepScore < 60 && (
            <View style={[styles.insightCard, { marginTop: 12 }]}>
              <MaterialIcons name="bedtime" size={24} color={COLORS.darkOrange} />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Improve Sleep</Text>
                <Text style={styles.insightText}>
                  Your sleep score could be better. Aim for 7-9 hours of quality sleep.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Last Updated */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Last updated: {new Date().toLocaleString()}
          </Text>
          <Text style={styles.footerSubtext}>
            Pull down to refresh
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
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  welcomeText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitleText: {
    color: COLORS.lightGray5,
    fontSize: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  metricBody: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  metricUnit: {
    color: COLORS.lightGray5,
    fontSize: 16,
    marginLeft: 6,
  },
  metricSubtitle: {
    color: COLORS.lightGray5,
    fontSize: 12,
    marginTop: 6,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  scoreBody: {
    alignItems: 'center',
  },
  scoreDetails: {
    marginTop: 12,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: COLORS.lightGray5,
    fontSize: 12,
    marginTop: 4,
  },
  insightCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  insightText: {
    color: COLORS.lightGray5,
    fontSize: 14,
    lineHeight: 20,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: COLORS.lightGray5,
    fontSize: 12,
  },
  footerSubtext: {
    color: COLORS.lightGray5,
    fontSize: 11,
    marginTop: 4,
  },
});

export default HealthKitDashboard;

