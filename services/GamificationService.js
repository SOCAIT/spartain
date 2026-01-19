import axios from 'axios';
import { backend_url } from '../config/config';

// Gamification API Service

// Setup
export const setupAchievements = async () => {
    try {
        const response = await axios.post(`${backend_url}gamification/setup/achievements/`);
        return response.data;
    } catch (error) {
        console.error('Error setting up achievements:', error);
        throw error;
    }
};

export const setupBadges = async () => {
    try {
        const response = await axios.post(`${backend_url}gamification/setup/badges/`);
        return response.data;
    } catch (error) {
        console.error('Error setting up badges:', error);
        throw error;
    }
};

// Triggers
export const triggerWorkoutCompletion = async (userId, workoutData) => {
    try {
        const response = await axios.post(`${backend_url}gamification/trigger/workout-completion/`, {
            user_id: userId,
            workout_data: workoutData
        });
        return response.data;
    } catch (error) {
        console.error('Error triggering workout completion:', error);
        throw error;
    }
};

export const triggerExerciseLog = async (userId, exerciseData) => {
    try {
        const response = await axios.post(`${backend_url}gamification/trigger/exercise-log/`, {
            user_id: userId,
            exercise_data: exerciseData
        });
        return response.data;
    } catch (error) {
        console.error('Error triggering exercise log:', error);
        throw error;
    }
};

export const triggerMealLog = async (userId, mealData) => {
    try {
        const response = await axios.post(`${backend_url}gamification/trigger/meal-log/`, {
            user_id: userId,
            meal_data: mealData
        });
        return response.data;
    } catch (error) {
        console.error('Error triggering meal log:', error);
        throw error;
    }
};

export const triggerMeasurementLog = async (userId, measurementData) => {
    try {
        const response = await axios.post(`${backend_url}gamification/trigger/measurement-log/`, {
            user_id: userId,
            measurement_data: measurementData
        });
        return response.data;
    } catch (error) {
        console.error('Error triggering measurement log:', error);
        throw error;
    }
};

// User Stats
export const getUserStats = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}gamification/user/${userId}/stats/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};

export const getUserScore = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}gamification/user/${userId}/score/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user score:', error);
        throw error;
    }
};

export const getUserStreaks = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}gamification/user/${userId}/streaks/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user streaks:', error);
        throw error;
    }
};

export const getUserAchievements = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}gamification/user/${userId}/achievements/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        throw error;
    }
};

export const getUserBadges = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}gamification/user/${userId}/badges/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user badges:', error);
        throw error;
    }
};

export const getUserActivityLog = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}gamification/user/${userId}/activity-log/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity log:', error);
        throw error;
    }
};

// Leaderboards
export const getOverallLeaderboard = async () => {
    try {
        const response = await axios.get(`${backend_url}gamification/leaderboard/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching overall leaderboard:', error);
        throw error;
    }
};

export const getSpecificLeaderboard = async (type) => {
    try {
        const response = await axios.get(`${backend_url}gamification/leaderboard/${type}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${type} leaderboard:`, error);
        throw error;
    }
};

export const createCustomLeaderboard = async (leaderboardData) => {
    try {
        const response = await axios.post(`${backend_url}gamification/leaderboard/create/`, leaderboardData);
        return response.data;
    } catch (error) {
        console.error('Error creating custom leaderboard:', error);
        throw error;
    }
};

// Available Items
export const getAvailableAchievements = async () => {
    try {
        const response = await axios.get(`${backend_url}gamification/achievements/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available achievements:', error);
        throw error;
    }
};

export const getAvailableBadges = async () => {
    try {
        const response = await axios.get(`${backend_url}gamification/badges/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available badges:', error);
        throw error;
    }
};

// Progress Tracking (Additional)
export const getUserProgress = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}user/${userId}/progress/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user progress:', error);
        throw error;
    }
};

export const getBodyLogsHistory = async (userId) => {
    try {
        const response = await axios.get(`${backend_url}user/body_logs/${userId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching body logs history:', error);
        throw error;
    }
};

