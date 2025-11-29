// Temporary: Clear Onboarding Storage
// Run this in your React Native Debugger console or add a button to call it:

import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.removeItem('@onboarding_completed');
// Then restart the app or logout and login again
