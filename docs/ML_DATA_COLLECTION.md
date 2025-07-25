# ML Data Collection System for Reinforcement Learning

## Overview
This system collects comprehensive user interaction and health data to train reinforcement learning models. The health data serves as rewards/signals while user behavior data provides the state and action space.

## Architecture

### Services
- **HealthKitService**: Interfaces with Apple HealthKit for health metrics
- **DataCollectionService**: Core data collection and storage service
- **useDataCollection Hook**: React hook for easy integration
- **useHealthKit Hook**: React hook for health data access

### Data Flow
1. **Collection**: Data collected through hooks and service calls
2. **Local Storage**: Stored locally using AsyncStorage with size limits
3. **Queue System**: Data queued for server synchronization
4. **Server Sync**: Automatic sync when queue reaches threshold or manually triggered

## Data Types Collected

### 1. Health Rewards/Signals (Primary RL Rewards)
```javascript
{
  type: 'health_rewards',
  metrics: {
    steps: { total, average, data[] },
    heartRate: { average, max, min, data[] },
    // Additional metrics can be added
  }
}
```

### 2. User Actions (RL State/Action Space)
```javascript
{
  category: 'app_usage',
  screen: 'WorkoutScreen',
  action: 'tap', // enter, exit, interaction, scroll, tap
  duration: 1500, // milliseconds
  metadata: { /* contextual data */ }
}
```

### 3. Workout Data
```javascript
{
  category: 'workout',
  exercises: [],
  duration: 3600, // seconds
  intensity: 'high', // low, medium, high
  completion_rate: 0.85, // 0-1
  user_rating: 4, // 1-5
  calories_burned: 300
}
```

### 4. Nutrition Data
```javascript
{
  category: 'nutrition',
  calories: 2000,
  macros: { protein: 150, carbs: 200, fat: 80 },
  adherence_to_plan: 0.9, // 0-1
  user_satisfaction: 4 // 1-5
}
```

### 5. User Feedback
```javascript
{
  category: 'user_feedback',
  rating: 4, // 1-5
  feedback_type: 'workout', // workout, nutrition, app, recommendation
  sentiment: 'positive', // positive, negative, neutral
  context: 'post_workout'
}
```

### 6. Goal Achievement
```javascript
{
  category: 'goal_achievement',
  goal_type: 'weight_loss',
  achievement_percentage: 0.75, // 0-1
  time_to_achieve: 86400, // seconds
  difficulty_level: 'medium',
  user_motivation: 8 // 1-10
}
```

## Implementation

### Basic Usage
```javascript
import { useDataCollection, useScreenTracking } from '../hooks/useDataCollection';

function MyScreen() {
  const { trackInteraction, trackWorkout } = useDataCollection();
  
  // Automatic screen tracking
  useScreenTracking('MyScreen');
  
  // Manual interaction tracking
  const handleButtonPress = () => {
    trackInteraction('MyScreen', 'button_press', { 
      button_id: 'start_workout' 
    });
  };
}
```

### Health Data Collection
```javascript
import { useHealthKitData } from '../hooks/useHealthKit';

function HealthDashboard() {
  const { steps, hr, error } = useHealthKitData({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date()
  });
  
  // Data automatically collected and stored
}
```

## Additional Data You Should Collect

### 1. Environmental Context
- **Time of Day**: When actions occur (circadian patterns)
- **Day of Week**: Weekend vs weekday behavior
- **Weather Data**: External factors affecting activity
- **Location Context**: Home, gym, outdoor (with privacy considerations)

### 2. Physiological Markers
- **Sleep Quality**: From HealthKit or manual input
- **Stress Levels**: Heart rate variability, self-reported
- **Energy Levels**: Self-reported 1-10 scale
- **Mood**: Self-reported emotional state
- **Recovery Metrics**: Resting heart rate, sleep recovery

### 3. Behavioral Patterns
- **App Usage Patterns**: Time spent in different sections
- **Notification Response**: How users respond to push notifications
- **Social Features**: Sharing, comparing with friends
- **Habit Streaks**: Consistency in workouts/nutrition logging

### 4. Personalization Data
- **Preferences**: Exercise types, meal preferences
- **Constraints**: Time availability, equipment access
- **Historical Performance**: Past workout performance trends
- **Adaptation Rate**: How quickly users adapt to new routines

### 5. Contextual Factors
- **Device Usage**: Phone vs watch vs tablet
- **Network Conditions**: WiFi vs cellular impact on usage
- **App Version**: Feature usage across different versions
- **Onboarding Flow**: How users progress through setup

## Database Schema Recommendations

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP,
  age INTEGER,
  gender VARCHAR(10),
  fitness_level VARCHAR(20),
  goals JSONB,
  preferences JSONB
);
```

### Training Data Table
```sql
CREATE TABLE ml_training_data (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(50),
  timestamp TIMESTAMP,
  data_type VARCHAR(50),
  data JSONB,
  device_info JSONB,
  app_version VARCHAR(20)
);
```

### Health Metrics Table
```sql
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  metric_type VARCHAR(50),
  value FLOAT,
  unit VARCHAR(20),
  timestamp TIMESTAMP,
  source VARCHAR(50)
);
```

## Data Privacy & Ethics

### Privacy Considerations
- **Anonymization**: Remove or hash personally identifiable information
- **Consent**: Clear opt-in for data collection
- **Transparency**: Users can view their collected data
- **Control**: Users can delete their data
- **Minimal Collection**: Only collect what's needed for ML training

### Data Retention
- **Local Storage**: Maximum 1000 entries (auto-pruning)
- **Server Storage**: Configurable retention periods
- **User Deletion**: Complete data removal on account deletion

## Integration with Your Backend

### API Endpoints Needed
```javascript
// POST /api/ml-training-data/
{
  data_points: [...],
  user_id: "uuid",
  app_version: "1.0.0",
  device_info: {...}
}

// GET /api/ml-training-data/export/
// Returns user's training data for download

// DELETE /api/ml-training-data/
// Removes all training data for user
```

### Real-time Features
- **Live Recommendations**: Use collected data for real-time suggestions
- **Adaptive Difficulty**: Adjust workout/nutrition difficulty based on performance
- **Personalized Timing**: Optimal notification timing based on usage patterns

## RL Model Training Considerations

### Reward Engineering
- **Composite Rewards**: Combine multiple health metrics
- **Delayed Rewards**: Account for long-term health outcomes
- **Normalized Rewards**: Scale rewards across different users
- **Exploration Bonus**: Reward trying new activities

### State Space Design
- **User Profile**: Age, fitness level, goals, preferences
- **Current Context**: Time, location, recent activities
- **Historical Performance**: Past workout/nutrition adherence
- **Physiological State**: Energy level, stress, sleep quality

### Action Space
- **Workout Recommendations**: Type, intensity, duration
- **Nutrition Suggestions**: Meal timing, macro targets
- **Behavioral Nudges**: Notification timing, content
- **Goal Adjustments**: Dynamic goal setting based on progress

## Monitoring & Analytics

### Data Quality Metrics
- **Collection Rate**: Percentage of expected data points collected
- **Sync Success Rate**: Percentage of successful server syncs
- **Data Completeness**: Missing fields in collected data
- **User Engagement**: Active data collection vs passive collection

### Usage Analytics
```javascript
// Track data collection performance
const analytics = {
  daily_data_points: 150,
  sync_success_rate: 0.95,
  health_data_availability: 0.80,
  user_engagement_score: 0.75
};
```

This comprehensive data collection system will provide rich training data for your reinforcement learning models while maintaining user privacy and providing immediate value through personalized recommendations. 