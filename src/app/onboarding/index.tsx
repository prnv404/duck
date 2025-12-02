import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { YStack } from 'tamagui';
import { ProductIntroSlide } from '@/components/onboarding/ProductIntroSlide';
import { DailyPracticeSlide } from '@/components/onboarding/DailyPracticeSlide';
import { TrackProgressSlide } from '@/components/onboarding/TrackProgressSlide';
import { GamifiedLearningSlide } from '@/components/onboarding/GamifiedLearningSlide';
import { StartJourneySlide } from '@/components/onboarding/StartJourneySlide';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { userAPI } from '@/services/user.api';


const SLIDES = ['welcome', 'dailyPractice', 'trackProgress', 'gamified', 'startJourney'] as const;
type SlideKey = (typeof SLIDES)[number];

export default function OnboardingScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [currentScreen, setCurrentScreen] = useState<SlideKey>('welcome');
    const [name, setName] = useState('');
    const totalSteps = SLIDES.length;

    const currentIndex = useMemo(() => SLIDES.indexOf(currentScreen), [currentScreen]);

    const goToIndex = useCallback(
        (index: number) => {
            const target = SLIDES[Math.min(Math.max(index, 0), totalSteps - 1)];
            if (target !== currentScreen) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentScreen(target);
            }
        },
        [currentScreen, totalSteps],
    );

    const handleNext = useCallback(() => {
        goToIndex(currentIndex + 1);
    }, [currentIndex, goToIndex]);

    const handleBack = useCallback(() => {
        goToIndex(currentIndex - 1);
    }, [currentIndex, goToIndex]);

    const handleSkip = useCallback(() => {
        goToIndex(totalSteps - 1);
    }, [goToIndex, totalSteps]);

    const handleComplete = async (userName: string) => {
        if (!userName.trim()) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        try {
            // Best-effort profile update; onboarding should still complete even if this fails
            try {
                await userAPI.updateProfile({ fullName: userName.trim() });
            } catch (apiError) {
                console.warn('Failed to update user fullName during onboarding:', apiError);
            }

            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await AsyncStorage.setItem('@onboarding_completed', 'true');
            await AsyncStorage.setItem('@user_name', userName.trim());
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error saving onboarding data:', error);
        }
    };

    const isDark = colorScheme === 'dark';


    const renderSlide = () => {
        const step = currentIndex + 1;
        switch (currentScreen) {
            case 'welcome':
                return (
                    <ProductIntroSlide
                        isDark={isDark}
                        onNext={handleNext}
                        onSkip={handleSkip}
                        step={step}
                        totalSteps={totalSteps}
                    />
                );
            case 'dailyPractice':
                return (
                    <DailyPracticeSlide
                        isDark={isDark}
                        onNext={handleNext}
                        onBack={handleBack}
                        onSkip={handleSkip}
                        step={step}
                        totalSteps={totalSteps}
                    />
                );
            case 'trackProgress':
                return (
                    <TrackProgressSlide
                        isDark={isDark}
                        onNext={handleNext}
                        onBack={handleBack}
                        onSkip={handleSkip}
                        step={step}
                        totalSteps={totalSteps}
                    />
                );
            case 'gamified':
                return (
                    <GamifiedLearningSlide
                        isDark={isDark}
                        onNext={handleNext}
                        onBack={handleBack}
                        onSkip={handleSkip}
                        step={step}
                        totalSteps={totalSteps}
                    />
                );
            case 'startJourney':
            default:
                return (
                    <StartJourneySlide
                        isDark={isDark}
                        name={name}
                        setName={setName}
                        onBack={handleBack}
                        onComplete={handleComplete}
                        step={step}
                        totalSteps={totalSteps}
                    />
                );
        }
    };

    return (
        <YStack flex={1} backgroundColor={isDark ? '#030303' : '#fdfcf7'}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Animated.View
                key={currentScreen}
                style={{ flex: 1 }}
                entering={FadeInRight.duration(320)}
                exiting={FadeOutLeft.duration(260)}
            >
                {renderSlide()}
            </Animated.View>
        </YStack>
    );
}
