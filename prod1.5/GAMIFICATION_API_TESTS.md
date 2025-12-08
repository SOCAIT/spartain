# 🎮 Gamification API - Complete Testing Guide

## 📋 Table of Contents
1. [Setup - Create Achievements & Badges](#setup)
2. [Trigger Actions](#trigger-actions)
3. [Get User Stats](#get-user-stats)
4. [Leaderboards](#leaderboards)
5. [Available Achievements & Badges](#available)

---

## 🎯 Setup - Create Achievements & Badges

### 1. Create Predefined Achievements

**Endpoint:** `POST /api/gamification/setup/achievements/`

**Request:**
```bash
curl -X POST http://localhost:8081/api/gamification/setup/achievements/ \
  -H "Content-Type: application/json"
```

**No body needed - creates default achievements:**
- First Workout (50 points)
- Workout Warrior - 10 workouts (200 points)
- Consistency King - 7-day streak (300 points)
- Nutrition Tracker - 50 meals (250 points)
- Measurement Master - 10 measurements (150 points)

---

### 2. Create Predefined Badges

**Endpoint:** `POST /api/gamification/setup/badges/`

**Request:**
```bash
curl -X POST http://localhost:8081/api/gamification/setup/badges/ \
  -H "Content-Type: application/json"
```

**No body needed - creates default badges:**
- Bronze Workout - 5 workouts (Common)
- Silver Workout - 25 workouts (Uncommon)
- Gold Workout - 50 workouts (Rare)
- Platinum Workout - 100 workouts (Epic)
- Diamond Workout - 250 workouts (Legendary)
- Streak Master - 30-day streak (Epic)

---

## 🎬 Trigger Actions

### 3. Trigger Workout Completion

**Endpoint:** `POST /api/gamification/trigger/workout-completion/`

**Request:**
```json
{
  "user_id": 1,
  "workout_data": {
    "workout_id": 123,
    "duration_minutes": 45,
    "exercises_count": 8,
    "calories_burned": 350
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:8081/api/gamification/trigger/workout-completion/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "workout_data": {
      "workout_id": 123,
      "duration_minutes": 45,
      "exercises_count": 8,
      "calories_burned": 350
    }
  }'
```

**Response:**
```json
{
  "message": "Workout completion processed"
}
```

---

### 4. Trigger Exercise Log

**Endpoint:** `POST /api/gamification/trigger/exercise-log/`

**Request:**
```json
{
  "user_id": 1,
  "exercise_data": {
    "exercise_name": "Bench Press",
    "sets": 4,
    "reps": 10,
    "weight": 80
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:8081/api/gamification/trigger/exercise-log/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "exercise_data": {
      "exercise_name": "Bench Press",
      "sets": 4,
      "reps": 10,
      "weight": 80
    }
  }'
```

---

### 5. Trigger Meal Log

**Endpoint:** `POST /api/gamification/trigger/meal-log/`

**Request:**
```json
{
  "user_id": 1,
  "meal_data": {
    "meal_name": "Chicken & Rice",
    "calories": 650,
    "protein": 45,
    "carbs": 70,
    "fats": 15
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:8081/api/gamification/trigger/meal-log/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "meal_data": {
      "meal_name": "Chicken & Rice",
      "calories": 650,
      "protein": 45,
      "carbs": 70,
      "fats": 15
    }
  }'
```

---

### 6. Trigger Measurement Log

**Endpoint:** `POST /api/gamification/trigger/measurement-log/`

**Request:**
```json
{
  "user_id": 1,
  "measurement_data": {
    "weight_kg": 75.5,
    "body_fat_percentage": 15.2,
    "muscle_mass_kg": 62.3
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:8081/api/gamification/trigger/measurement-log/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "measurement_data": {
      "weight_kg": 75.5,
      "body_fat_percentage": 15.2,
      "muscle_mass_kg": 62.3
    }
  }'
```

---

## 📊 Get User Stats

### 7. Get Complete Gamification Stats

**Endpoint:** `GET /api/gamification/user/{user_id}/stats/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/user/1/stats/
```

**Response:**
```json
{
  "user_score": {
    "total_points": 1250,
    "workout_points": 600,
    "nutrition_points": 300,
    "consistency_points": 250,
    "achievement_points": 100,
    "last_updated": "2025-11-12T10:30:00Z"
  },
  "streaks": [
    {
      "streak_type": "workout",
      "current_streak": 7,
      "longest_streak": 14,
      "last_activity_date": "2025-11-12",
      "is_active": true
    },
    {
      "streak_type": "nutrition",
      "current_streak": 5,
      "longest_streak": 10,
      "last_activity_date": "2025-11-12",
      "is_active": true
    }
  ],
  "achievements": [
    {
      "achievement": {
        "id": 1,
        "name": "First Workout",
        "description": "Complete your first workout",
        "achievement_type": "workout",
        "points_reward": 50,
        "icon": "🏋️",
        "requirements": {"total_workouts": 1},
        "is_active": true
      },
      "earned_at": "2025-11-01T10:00:00Z",
      "is_notified": true
    }
  ],
  "badges": [
    {
      "badge": {
        "id": 1,
        "name": "Bronze Workout",
        "description": "Complete 5 workouts",
        "icon": "🥉",
        "color": "#CD7F32",
        "rarity": "common",
        "requirements": {"total_workouts": 5},
        "is_active": true
      },
      "earned_at": "2025-11-05T14:20:00Z",
      "is_displayed": true
    }
  ],
  "recent_activities": [
    {
      "activity_type": "workout_completed",
      "points_earned": 50,
      "description": "Completed a 45-minute workout",
      "metadata": {"workout_id": 123},
      "created_at": "2025-11-12T09:00:00Z"
    }
  ],
  "total_achievements": 4,
  "total_badges": 2,
  "current_level": 5,
  "points_to_next_level": 250
}
```

---

### 8. Get User Score Only

**Endpoint:** `GET /api/gamification/user/{user_id}/score/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/user/1/score/
```

**Response:**
```json
{
  "total_points": 1250,
  "workout_points": 600,
  "nutrition_points": 300,
  "consistency_points": 250,
  "achievement_points": 100,
  "last_updated": "2025-11-12T10:30:00Z"
}
```

---

### 9. Get User Streaks

**Endpoint:** `GET /api/gamification/user/{user_id}/streaks/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/user/1/streaks/
```

**Response:**
```json
[
  {
    "streak_type": "workout",
    "current_streak": 7,
    "longest_streak": 14,
    "last_activity_date": "2025-11-12",
    "is_active": true
  },
  {
    "streak_type": "nutrition",
    "current_streak": 5,
    "longest_streak": 10,
    "last_activity_date": "2025-11-12",
    "is_active": true
  },
  {
    "streak_type": "measurement",
    "current_streak": 3,
    "longest_streak": 5,
    "last_activity_date": "2025-11-11",
    "is_active": true
  }
]
```

---

### 10. Get User Achievements

**Endpoint:** `GET /api/gamification/user/{user_id}/achievements/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/user/1/achievements/
```

**Response:**
```json
[
  {
    "achievement": {
      "id": 1,
      "name": "First Workout",
      "description": "Complete your first workout",
      "achievement_type": "workout",
      "points_reward": 50,
      "icon": "🏋️",
      "requirements": {"total_workouts": 1},
      "is_active": true
    },
    "earned_at": "2025-11-01T10:00:00Z",
    "is_notified": true
  },
  {
    "achievement": {
      "id": 2,
      "name": "Workout Warrior",
      "description": "Complete 10 workouts",
      "achievement_type": "workout",
      "points_reward": 200,
      "icon": "💪",
      "requirements": {"total_workouts": 10},
      "is_active": true
    },
    "earned_at": "2025-11-08T15:30:00Z",
    "is_notified": false
  }
]
```

---

### 11. Get User Badges

**Endpoint:** `GET /api/gamification/user/{user_id}/badges/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/user/1/badges/
```

**Response:**
```json
[
  {
    "badge": {
      "id": 1,
      "name": "Bronze Workout",
      "description": "Complete 5 workouts",
      "icon": "🥉",
      "color": "#CD7F32",
      "rarity": "common",
      "requirements": {"total_workouts": 5},
      "is_active": true
    },
    "earned_at": "2025-11-05T14:20:00Z",
    "is_displayed": true
  },
  {
    "badge": {
      "id": 2,
      "name": "Silver Workout",
      "description": "Complete 25 workouts",
      "icon": "🥈",
      "color": "#C0C0C0",
      "rarity": "uncommon",
      "requirements": {"total_workouts": 25},
      "is_active": true
    },
    "earned_at": "2025-11-10T09:15:00Z",
    "is_displayed": true
  }
]
```

---

### 12. Get User Activity Log

**Endpoint:** `GET /api/gamification/user/{user_id}/activity-log/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/user/1/activity-log/
```

**Response:**
```json
[
  {
    "activity_type": "workout_completed",
    "points_earned": 50,
    "description": "Completed a 45-minute workout",
    "metadata": {
      "workout_id": 123,
      "duration": 45,
      "exercises": 8
    },
    "created_at": "2025-11-12T09:00:00Z"
  },
  {
    "activity_type": "achievement_earned",
    "points_earned": 200,
    "description": "Earned 'Workout Warrior' achievement",
    "metadata": {
      "achievement_id": 2,
      "achievement_name": "Workout Warrior"
    },
    "created_at": "2025-11-08T15:30:00Z"
  },
  {
    "activity_type": "streak_milestone",
    "points_earned": 100,
    "description": "Reached 7-day workout streak",
    "metadata": {
      "streak_type": "workout",
      "streak_days": 7
    },
    "created_at": "2025-11-07T18:00:00Z"
  }
]
```

---

## 🏆 Leaderboards

### 13. Get Overall Leaderboard

**Endpoint:** `GET /api/gamification/leaderboard/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/leaderboard/
```

**Response:**
```json
{
  "leaderboard_type": "overall",
  "entries": [
    {
      "user": {
        "id": 5,
        "username": "fitpro123",
        "email": "fitpro@example.com"
      },
      "score": 5420,
      "rank": 1,
      "additional_data": {
        "workouts_completed": 87,
        "achievements_earned": 12
      }
    },
    {
      "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com"
      },
      "score": 3250,
      "rank": 2,
      "additional_data": {
        "workouts_completed": 52,
        "achievements_earned": 8
      }
    }
  ]
}
```

---

### 14. Get Workout Leaderboard

**Endpoint:** `GET /api/gamification/leaderboard/workout/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/leaderboard/workout/
```

---

### 15. Get Streak Leaderboard

**Endpoint:** `GET /api/gamification/leaderboard/streak/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/leaderboard/streak/
```

---

### 16. Create Custom Leaderboard

**Endpoint:** `POST /api/gamification/leaderboard/create/`

**Request:**
```json
{
  "leaderboard_type": "weekly",
  "period_start": "2025-11-11",
  "period_end": "2025-11-17"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8081/api/gamification/leaderboard/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "leaderboard_type": "weekly",
    "period_start": "2025-11-11",
    "period_end": "2025-11-17"
  }'
```

---

## 📜 Available Achievements & Badges

### 17. Get All Available Achievements

**Endpoint:** `GET /api/gamification/achievements/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/achievements/
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "First Workout",
    "description": "Complete your first workout",
    "achievement_type": "workout",
    "points_reward": 50,
    "icon": "🏋️",
    "requirements": {"total_workouts": 1},
    "is_active": true
  },
  {
    "id": 2,
    "name": "Workout Warrior",
    "description": "Complete 10 workouts",
    "achievement_type": "workout",
    "points_reward": 200,
    "icon": "💪",
    "requirements": {"total_workouts": 10},
    "is_active": true
  }
]
```

---

### 18. Get All Available Badges

**Endpoint:** `GET /api/gamification/badges/`

**Request:**
```bash
curl http://localhost:8081/api/gamification/badges/
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Bronze Workout",
    "description": "Complete 5 workouts",
    "icon": "🥉",
    "color": "#CD7F32",
    "rarity": "common",
    "requirements": {"total_workouts": 5},
    "is_active": true
  },
  {
    "id": 2,
    "name": "Silver Workout",
    "description": "Complete 25 workouts",
    "icon": "🥈",
    "color": "#C0C0C0",
    "rarity": "uncommon",
    "requirements": {"total_workouts": 25},
    "is_active": true
  }
]
```

---

## 🧪 Complete Test Flow

### Step-by-Step Testing

```bash
# 1. Setup: Create achievements and badges
curl -X POST http://localhost:8081/api/gamification/setup/achievements/
curl -X POST http://localhost:8081/api/gamification/setup/badges/

# 2. Verify they were created
curl http://localhost:8081/api/gamification/achievements/
curl http://localhost:8081/api/gamification/badges/

# 3. Trigger first workout (replace user_id with your test user)
curl -X POST http://localhost:8081/api/gamification/trigger/workout-completion/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "workout_data": {
      "workout_id": 1,
      "duration_minutes": 30,
      "exercises_count": 5
    }
  }'

# 4. Check user stats to see points and achievements
curl http://localhost:8081/api/gamification/user/1/stats/

# 5. Trigger more workouts to earn badges
for i in {2..6}; do
  curl -X POST http://localhost:8081/api/gamification/trigger/workout-completion/ \
    -H "Content-Type: application/json" \
    -d "{\"user_id\": 1, \"workout_data\": {\"workout_id\": $i}}"
  sleep 1
done

# 6. Check badges earned
curl http://localhost:8081/api/gamification/user/1/badges/

# 7. Check leaderboard
curl http://localhost:8081/api/gamification/leaderboard/
```

---

## 📝 Summary of All Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/gamification/setup/achievements/` | POST | Create predefined achievements |
| `/api/gamification/setup/badges/` | POST | Create predefined badges |
| `/api/gamification/trigger/workout-completion/` | POST | Award points for workout |
| `/api/gamification/trigger/exercise-log/` | POST | Award points for exercise |
| `/api/gamification/trigger/meal-log/` | POST | Award points for meal |
| `/api/gamification/trigger/measurement-log/` | POST | Award points for measurement |
| `/api/gamification/user/{id}/stats/` | GET | Get complete gamification stats |
| `/api/gamification/user/{id}/score/` | GET | Get user score only |
| `/api/gamification/user/{id}/streaks/` | GET | Get user streaks |
| `/api/gamification/user/{id}/achievements/` | GET | Get earned achievements |
| `/api/gamification/user/{id}/badges/` | GET | Get earned badges |
| `/api/gamification/user/{id}/activity-log/` | GET | Get activity history |
| `/api/gamification/leaderboard/` | GET | Get overall leaderboard |
| `/api/gamification/leaderboard/{type}/` | GET | Get specific leaderboard |
| `/api/gamification/leaderboard/create/` | POST | Create custom leaderboard |
| `/api/gamification/achievements/` | GET | Get all achievements |
| `/api/gamification/badges/` | GET | Get all badges |

---

## 🎯 Ready to Test!

Start by creating achievements and badges, then trigger actions to earn points! 🚀

