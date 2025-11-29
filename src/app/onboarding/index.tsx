import React, { useState } from 'react';
import { YStack } from 'tamagui';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { NameInputScreen } from '@/components/onboarding/NameInputScreen';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function OnboardingScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [currentScreen, setCurrentScreen] = useState(0);
    const [name, setName] = useState('');

    const opacity1 = useSharedValue(1);
    const opacity2 = useSharedValue(0);
    const translateY1 = useSharedValue(0);
    const translateY2 = useSharedValue(50);

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Fade out first screen
        opacity1.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
        translateY1.value = withTiming(-50, { duration: 400, easing: Easing.out(Easing.cubic) });

        // Fade in second screen
        setTimeout(() => {
            setCurrentScreen(1);
            opacity2.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
            translateY2.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
        }, 200);
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Fade out second screen
        opacity2.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
        translateY2.value = withTiming(50, { duration: 400, easing: Easing.out(Easing.cubic) });

        // Fade in first screen
        setTimeout(() => {
            setCurrentScreen(0);
            opacity1.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
            translateY1.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
        }, 200);
    };

    const handleComplete = async (userName: string) => {
        if (!userName.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            await AsyncStorage.setItem('@onboarding_completed', 'true');
            await AsyncStorage.setItem('@user_name', userName.trim());

            setTimeout(() => {
                router.replace('/(tabs)');
            }, 300);
        } catch (error) {
            console.error('Error saving onboarding data:', error);
        }
    };

    const screen1Style = useAnimatedStyle(() => ({
        opacity: opacity1.value,
        transform: [{ translateY: translateY1.value }],
    }));

    const screen2Style = useAnimatedStyle(() => ({
        opacity: opacity2.value,
        transform: [{ translateY: translateY2.value }],
    }));

    const isDark = colorScheme === 'dark';

    return (
        <YStack flex={1} backgroundColor={isDark ? '#0a0a0a' : '#faf9f6'}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {currentScreen === 0 ? (
                <Animated.View style={[{ flex: 1 }, screen1Style]}>
                    <WelcomeScreen onNext={handleNext} isDark={isDark} />
                </Animated.View>
            ) : (
                <Animated.View style={[{ flex: 1 }, screen2Style]}>
                    <NameInputScreen
                        name={name}
                        setName={setName}
                        onComplete={handleComplete}
                        onBack={handleBack}
                        isDark={isDark}
                    />
                </Animated.View>
            )}
        </YStack>
    );
}
