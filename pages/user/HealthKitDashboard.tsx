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
import { COLORS as BASE_COLORS, FONTS } from '../../constants';
import { runSahhaMinimalTest, ExtendedHealthData } from '../../services/HealthKitService';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import CircularProgress from '../../components/charts/CircularProgress';
import { AuthContext } from '../../helpers/AuthContext';

const { width } = Dimensions.get('window');

// Extend COLORS type to include additional colors
const COLORS = BASE_COLORS as typeof BASE_COLORS & {
  purple: string;
  orange: string;
  teal: string;
  blue: string;
  lightBlue: string;
  cyan: string;
  darkBlue: string;
};

type TabType = 'overview' | 'vitals' | 'activity' | 'sleep' | 'body';

const HealthKitDashboard = ({ navigation }: any) => {
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [healthData, setHealthData] = useState<ExtendedHealthData | null>(null);
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
      setHealthData(result);
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

  const formatValue = (value: number | null, decimals: number = 0): string => {
    return value !== null ? value.toFixed(decimals) : '--';
  };

  const formatTime = (minutes: number | null): string => {
    if (minutes === null) return '--';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Convert sleep duration from seconds to hours
  const convertSecondsToHours = (seconds: number | null): number | null => {
    if (seconds === null) return null;
    return seconds / 3600; // Convert seconds to hours
  };

  // Convert minutes to hours for display
  const convertMinutesToHours = (minutes: number | null): number | null => {
    if (minutes === null) return null;
    return minutes / 60;
  };

  const renderCompactMetric = (
    title: string,
    value: number | null,
    unit: string,
    icon: string,
    color: string,
    decimals: number = 0
  ) => (
    <View style={styles.compactMetric}>
      <View style={[styles.compactIconWrapper, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View style={styles.compactMetricContent}>
        <Text style={styles.compactMetricTitle}>{title}</Text>
        <View style={styles.compactMetricValueRow}>
          <Text style={styles.compactMetricValue}>
            {formatValue(value, decimals)}
          </Text>
          <Text style={styles.compactMetricUnit}> {unit}</Text>
        </View>
      </View>
    </View>
  );

  const renderLargeMetricCard = (
    title: string,
    value: number | null,
    unit: string,
    icon: string,
    color: string,
    subtitle?: string,
    decimals: number = 0
  ) => (
    <View style={[styles.largeMetricCard, { borderTopColor: color }]}>
      <View style={styles.largeMetricHeader}>
        <View style={[styles.largeIconWrapper, { backgroundColor: color + '15' }]}>
          <MaterialIcons name={icon} size={32} color={color} />
        </View>
        <Text style={styles.largeMetricTitle}>{title}</Text>
      </View>
      <View style={styles.largeMetricBody}>
        <Text style={[styles.largeMetricValue, { color }]}>
          {formatValue(value, decimals)}
        </Text>
        <Text style={styles.largeMetricUnit}>{unit}</Text>
      </View>
      {subtitle && <Text style={styles.largeMetricSubtitle}>{subtitle}</Text>}
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

    return (
      <View style={styles.scoreCard}>
        <Text style={styles.scoreCardTitle}>{title}</Text>
        <View style={styles.scoreCardBody}>
          <CircularProgress
            percentage={scorePercentage || 0}
            size={90}
            strokeWidth={8}
            color={color}
            textStyle={{ fontSize: 20, fontWeight: 'bold' }}
          />
        </View>
        <View style={styles.scoreCardFooter}>
          <MaterialIcons name={icon} size={18} color={color} />
          <Text style={[styles.scoreCardLabel, { color }]}>{label}</Text>
        </View>
      </View>
    );
  };

  const renderProgressBar = (value: number | null, max: number, color: string) => {
    const percentage = value !== null ? Math.min((value / max) * 100, 100) : 0;
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  const renderTabButton = (tab: TabType, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <MaterialIcons 
        name={icon} 
        size={20} 
        color={activeTab === tab ? COLORS.darkOrange : COLORS.lightGray5} 
      />
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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

  const renderOverviewTab = () => {
    const hasAnyData = healthData && (
      healthData.steps || healthData.bpm || healthData.sleepDuration || 
      healthData.sleepScore || healthData.wellbeingScore || healthData.activityScore
    );

    return (
      <>
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Hi, {authState.username || 'User'} 👋</Text>
          <Text style={styles.subtitleText}>Here's your health summary from the past 7 days</Text>
        </View>

        {!hasAnyData && (
          <View style={styles.section}>
            <View style={styles.dataInfoCard}>
              <MaterialIcons name="info-outline" size={28} color={COLORS.darkOrange} />
              <View style={styles.dataInfoContent}>
                <Text style={styles.dataInfoTitle}>Limited Data Available</Text>
                <Text style={styles.dataInfoText}>
                  We're collecting your health data. Please ensure:
                  {'\n'}• HealthKit permissions are granted
                  {'\n'}• Your Apple Watch is syncing
                  {'\n'}• Data will appear within 24-48 hours
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Wellness Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wellness Scores</Text>
          <View style={styles.scoresRow}>
            {renderScoreCard('Sleep', healthData?.sleepScore ?? null, 'bedtime')}
            {renderScoreCard('Wellbeing', healthData?.wellbeingScore ?? null, 'mood')}
            {renderScoreCard('Activity', healthData?.activityScore ?? null, 'directions-run')}
            {renderScoreCard('Readiness', healthData?.readinessScore ?? null, 'bolt')}
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.compactMetricsGrid}>
            {renderCompactMetric('Heart Rate', healthData?.bpm ?? null, 'BPM', 'favorite', COLORS.red, 0)}
            {renderCompactMetric('Steps', healthData?.steps ?? null, 'steps', 'directions-walk', COLORS.darkOrange, 0)}
            {renderCompactMetric('Sleep', convertSecondsToHours(healthData?.sleepDuration ?? null), 'hours', 'bedtime', COLORS.purple, 1)}
            {renderCompactMetric('Calories', healthData?.activeEnergyBurned ?? null, 'kcal', 'local-fire-department', COLORS.orange, 0)}
          </View>
        </View>

        {/* Quick Insights */}
        {hasAnyData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Insights</Text>
            {healthData?.steps && healthData.steps > 7000 ? (
              <View style={styles.insightCard}>
                <MaterialIcons name="emoji-events" size={24} color={COLORS.greenPrimary} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Great Activity! 🎉</Text>
                  <Text style={styles.insightText}>
                    You're averaging {formatValue(healthData.steps / 7, 0)} steps per day. Keep it up!
                  </Text>
                </View>
              </View>
            ) : healthData?.steps ? (
              <View style={styles.insightCard}>
                <MaterialIcons name="trending-up" size={24} color={COLORS.darkOrange} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Move More</Text>
                  <Text style={styles.insightText}>
                    Try to reach 10,000 steps daily for optimal cardiovascular health.
                  </Text>
                </View>
              </View>
            ) : null}
            {healthData?.sleepDuration && healthData.sleepDuration < 25200 && (
              <View style={[styles.insightCard, { marginTop: 12 }]}>
                <MaterialIcons name="nights-stay" size={24} color={COLORS.purple} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Prioritize Sleep</Text>
                  <Text style={styles.insightText}>
                    You're averaging {formatValue(convertSecondsToHours(healthData.sleepDuration), 1)} hours of sleep. Aim for 7-9 hours.
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </>
    );
  };

  const renderVitalsTab = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Heart Health</Text>
        <View style={styles.largeMetricsRow}>
          {renderLargeMetricCard('Resting HR', healthData?.bpm ?? null, 'BPM', 'favorite', COLORS.red, 'Average', 0)}
          {renderLargeMetricCard('Sleep HR', healthData?.heartRateSleep ?? null, 'BPM', 'bedtime', COLORS.purple, 'Average', 0)}
        </View>
        <View style={styles.compactMetricsGrid}>
          {renderCompactMetric('HRV', healthData?.hrv ?? null, 'ms', 'show-chart', COLORS.teal, 1)}
          {renderCompactMetric('VO2 Max', healthData?.vo2Max ?? null, 'ml/kg/min', 'air', COLORS.blue, 1)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Respiratory & Oxygen</Text>
        <View style={styles.compactMetricsGrid}>
          {renderCompactMetric('Respiratory Rate', healthData?.respiratoryRate ?? null, 'breaths/min', 'air', COLORS.lightBlue, 1)}
          {renderCompactMetric('O2 Saturation', healthData?.oxygenSaturation ?? null, '%', 'opacity', COLORS.cyan, 1)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blood Pressure</Text>
        <View style={styles.compactMetricsGrid}>
          {renderCompactMetric('Systolic', healthData?.bloodPressureSystolic ?? null, 'mmHg', 'show-chart', COLORS.red, 0)}
          {renderCompactMetric('Diastolic', healthData?.bloodPressureDiastolic ?? null, 'mmHg', 'show-chart', COLORS.darkOrange, 0)}
        </View>
      </View>

      {healthData?.bodyTemperature && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperature</Text>
          {renderCompactMetric('Body Temp', healthData?.bodyTemperature ?? null, '°F', 'thermostat', COLORS.orange, 1)}
        </View>
      )}
    </>
  );

  const renderActivityTab = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Movement</Text>
        <View style={styles.largeMetricsRow}>
          {renderLargeMetricCard('Steps', healthData?.steps ?? null, 'total', 'directions-walk', COLORS.darkOrange, '7 days', 0)}
          {renderLargeMetricCard('Floors', healthData?.floorsClimbed ?? null, 'climbed', 'stairs', COLORS.teal, '7 days', 0)}
        </View>
        {renderProgressBar(healthData?.steps ?? null, 70000, COLORS.darkOrange)}
        <Text style={styles.progressLabel}>Goal: 70,000 steps/week</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Energy & Exercise</Text>
        <View style={styles.compactMetricsGrid}>
          {renderCompactMetric('Active Energy', healthData?.activeEnergyBurned ?? null, 'kcal', 'local-fire-department', COLORS.orange, 0)}
          {renderCompactMetric('Total Energy', healthData?.totalEnergyBurned ?? null, 'kcal', 'whatshot', COLORS.red, 0)}
        </View>
        <View style={styles.compactMetricsGrid}>
          {renderCompactMetric('Active Time', healthData?.activeDuration ? healthData.activeDuration / 60 : null, 'min', 'timer', COLORS.greenPrimary, 0)}
          {renderCompactMetric('Exercise Time', healthData?.exerciseTime ? healthData.exerciseTime / 60 : null, 'min', 'fitness-center', COLORS.purple, 0)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Insights</Text>
        <View style={styles.insightCard}>
          <MaterialIcons name="insights" size={24} color={COLORS.darkOrange} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Daily Average</Text>
            <Text style={styles.insightText}>
              You're burning an average of {formatValue((healthData?.totalEnergyBurned ?? 0) / 7, 0)} calories per day.
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderSleepTab = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Duration</Text>
        {renderLargeMetricCard(
          'Average Sleep',
          convertSecondsToHours(healthData?.sleepDuration ?? null),
          'hours',
          'bedtime',
          COLORS.purple,
          'Per night',
          1
        )}
        {renderProgressBar(convertSecondsToHours(healthData?.sleepDuration ?? null), 9, COLORS.purple)}
        <Text style={styles.progressLabel}>Recommended: 7-9 hours</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Quality</Text>
        <View style={styles.compactMetricsGrid}>
          {renderCompactMetric('Efficiency', healthData?.sleepEfficiency ?? null, '%', 'check-circle', COLORS.greenPrimary, 1)}
          {renderCompactMetric('Latency', healthData?.sleepLatency ? healthData.sleepLatency / 60 : null, 'min', 'schedule', COLORS.darkOrange, 0)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Stages</Text>
        <View style={styles.compactMetricsGrid}>
          {renderCompactMetric('Deep Sleep', convertSecondsToHours(healthData?.sleepDeepDuration ?? null), 'hrs', 'nights-stay', COLORS.darkBlue, 1)}
          {renderCompactMetric('REM Sleep', convertSecondsToHours(healthData?.sleepRemDuration ?? null), 'hrs', 'star', COLORS.purple, 1)}
        </View>
        {renderCompactMetric('Light Sleep', convertSecondsToHours(healthData?.sleepLightDuration ?? null), 'hrs', 'wb-twilight', COLORS.lightBlue, 1)}
      </View>

      {healthData?.sleepEfficiency && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Insights</Text>
          <View style={styles.insightCard}>
            <MaterialIcons 
              name={healthData.sleepEfficiency > 85 ? 'check-circle' : 'info'} 
              size={24} 
              color={healthData.sleepEfficiency > 85 ? COLORS.greenPrimary : COLORS.darkOrange} 
            />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>
                {healthData.sleepEfficiency > 85 ? 'Excellent Sleep Quality' : 'Room for Improvement'}
              </Text>
              <Text style={styles.insightText}>
                Your sleep efficiency is {formatValue(healthData.sleepEfficiency, 0)}%. 
                {healthData.sleepEfficiency > 85 
                  ? ' Keep up the great sleep habits!' 
                  : ' Try maintaining a consistent sleep schedule.'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );

  const renderBodyTab = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Metrics</Text>
        <View style={styles.largeMetricsRow}>
          {renderLargeMetricCard('Weight', healthData?.weight ?? null, 'lbs', 'monitor-weight', COLORS.blue, 'Current', 1)}
          {renderLargeMetricCard('Height', healthData?.height ?? null, 'in', 'height', COLORS.teal, 'Current', 1)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Composition</Text>
        <View style={styles.compactMetricsGrid}>
          {renderCompactMetric('BMI', healthData?.bmi ?? null, 'kg/m²', 'assessment', COLORS.purple, 1)}
          {renderCompactMetric('Body Fat', healthData?.bodyFat ?? null, '%', 'pie-chart', COLORS.orange, 1)}
        </View>
        {renderCompactMetric('Lean Mass', healthData?.leanBodyMass ?? null, 'lbs', 'fitness-center', COLORS.greenPrimary, 1)}
      </View>

      {healthData?.bmi && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Insights</Text>
          <View style={styles.insightCard}>
            <MaterialIcons name="info" size={24} color={COLORS.darkOrange} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>BMI Category</Text>
              <Text style={styles.insightText}>
                {healthData.bmi < 18.5 && 'Underweight - Consider consulting a healthcare provider.'}
                {healthData.bmi >= 18.5 && healthData.bmi < 25 && 'Normal weight - Great job maintaining a healthy BMI!'}
                {healthData.bmi >= 25 && healthData.bmi < 30 && 'Overweight - Consider a balanced diet and regular exercise.'}
                {healthData.bmi >= 30 && 'Obese - Please consult with a healthcare professional.'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title="Health Analytics" paddingTop={0} rightIcon={null} onRightIconPress={null} />
      
      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsScroll}
          decelerationRate="fast"
          snapToInterval={120}
        >
          {renderTabButton('overview', 'Overview', 'dashboard')}
          {renderTabButton('vitals', 'Vitals', 'favorite')}
          {renderTabButton('activity', 'Activity', 'directions-run')}
          {renderTabButton('sleep', 'Sleep', 'bedtime')}
          {renderTabButton('body', 'Body', 'accessibility')}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.darkOrange} />
        }
      >
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'vitals' && renderVitalsTab()}
        {activeTab === 'activity' && renderActivityTab()}
        {activeTab === 'sleep' && renderSleepTab()}
        {activeTab === 'body' && renderBodyTab()}

        {/* Last Updated */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Last updated: {new Date().toLocaleString()}
          </Text>
          <Text style={styles.footerSubtext}>Pull down to refresh</Text>
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
  
  // Tabs
  tabsContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  tabsScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: COLORS.darkOrange,
    borderColor: COLORS.darkOrange + '40',
    shadowColor: COLORS.darkOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabButtonText: {
    color: COLORS.lightGray5,
    fontSize: 14,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  
  // Header
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
    lineHeight: 22,
  },
  
  // Sections
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  
  // Compact Metrics
  compactMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  compactMetric: {
    flex: 1,
    minWidth: (width - 64) / 2,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compactIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactMetricContent: {
    flex: 1,
  },
  compactMetricTitle: {
    color: COLORS.lightGray5,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  compactMetricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  compactMetricValue: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  compactMetricUnit: {
    color: COLORS.lightGray5,
    fontSize: 12,
  },
  
  // Large Metric Cards
  largeMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  largeMetricCard: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    borderTopWidth: 3,
  },
  largeMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  largeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeMetricTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  largeMetricBody: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  largeMetricValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  largeMetricUnit: {
    color: COLORS.lightGray5,
    fontSize: 14,
    marginLeft: 8,
  },
  largeMetricSubtitle: {
    color: COLORS.lightGray5,
    fontSize: 12,
  },
  
  // Score Cards
  scoresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  scoreCardTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 14,
  },
  scoreCardBody: {
    marginBottom: 14,
  },
  scoreCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreCardLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Progress Bars
  progressBarContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    color: COLORS.lightGray5,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  
  // Insights
  insightCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightContent: {
    flex: 1,
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
  
  // Data Info Card
  dataInfoCard: {
    backgroundColor: COLORS.darkOrange + '15',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.darkOrange,
  },
  dataInfoContent: {
    flex: 1,
  },
  dataInfoTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  dataInfoText: {
    color: COLORS.lightGray5,
    fontSize: 14,
    lineHeight: 22,
  },
  
  // Footer
  footerSection: {
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 20,
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

