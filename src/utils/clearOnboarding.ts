import AsyncStorage from '@react-native-async-storage/async-storage';

// Add this to a temporary component or run in your app to clear onboarding
export const clearOnboarding = async () => {
    await AsyncStorage.removeItem('@onboarding_completed');
    await AsyncStorage.removeItem('@user_name');
    console.log('Onboarding cleared!');
};

// Instructions:
// 1. Import this in your app (e.g., in home screen temporarily)
// 2. Add a button that calls clearOnboarding()
// 3. Or use React Native Debugger to run:
//    AsyncStorage.removeItem('@onboarding_completed')
