import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from './EditProfile'; // Make sure this path is correct based on your file structure
import Profile from '../Profile'; // A screen to view the profile
import UserReportScreen from './UserReportScreen';
import EditProfileScreen from './EditProfileNew';
import MainScreen from './Main';
import AnalyzeBodyScreen from '../chat/BodyAnalyzer';
// import ProSubscriptionScreen from '../SubscriptionDetails';
import SubscriptionScreenRevenueCat from '../SubscriptionDetailsRevenueCat';

import AnalyticalView from './AnalyticalView';
import SettingsStack from '../settings/SettingsStack';
// import ChangePassword from './ChangePassword'; // A screen to change the password
import ThreeDLookScan from '../Body/3DLookScan';
import HealthKitDashboard from './HealthKitDashboard';
import ForgotPasswordScreen from './ForgotPassword';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="ProfileView"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="ProfileView" component={MainScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreenRevenueCat} />
            <Stack.Screen name="UserReport" component={UserReportScreen} />
            <Stack.Screen name="BodyAnalyzer" component={ThreeDLookScan} />
            <Stack.Screen name="AnalyticalView" component={AnalyticalView} />
            <Stack.Screen name="HealthKitDashboard" component={HealthKitDashboard} />
            <Stack.Screen name="SettingsStack" component={SettingsStack} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

            {/* <Stack.Screen name="ChangePassword" component={ChangePassword} /> */}
        </Stack.Navigator>
    );
}

export default ProfileStack;
