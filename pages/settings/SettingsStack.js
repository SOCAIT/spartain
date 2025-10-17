import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Settings from './Settings';
import SubscriptionScreenRevenueCat from '../SubscriptionDetailsRevenueCat';
import ComingSoonScreen from '../Soon';
import AboutReferences from './AboutReferences';
// import ChangePassword from './ChangePassword'; // A screen to change the password

const Stack = createNativeStackNavigator();

const SettingsStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Settings"
            screenOptions={{
                headerShown: false
            }}
        > 
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Soon" component={ComingSoonScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreenRevenueCat} />
            <Stack.Screen name="AboutReferences" component={AboutReferences} />
            

            {/* <Stack.Screen name="ChangePassword" component={ChangePassword} /> */}
        </Stack.Navigator>
    );
}

export default SettingsStack;
