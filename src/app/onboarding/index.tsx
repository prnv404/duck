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
import { useColorScheme } from '@/hooks/use-color-scheme';


// Removed 'startJourney' - no longer need name input
const SLIDES = ['welcome', 'dailyPractice', 'trackProgress', 'gamified'] as const;
type SlideKey = (typeof SLIDES)[number];

export default function OnboardingScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [currentScreen, setCurrentScreen] = useState<SlideKey>('welcome');
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
        [currentScreen, totalSteps, currentIndex],
    );

    const handleNext = useCallback(() => {
        goToIndex(currentIndex + 1);
    }, [currentIndex, goToIndex]);

    const handleBack = useCallback(() => {
        goToIndex(currentIndex - 1);
    }, [currentIndex, goToIndex]);

    const handleSkip = useCallback(() => {
        handleComplete();
    }, [currentIndex, currentScreen]);

    const handleComplete = async () => {
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await AsyncStorage.setItem('@onboarding_completed', 'true');
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error saving onboarding data:', error);
        }
    };

    const isDark = colorScheme === 'dark';

    const isLastSlide = currentIndex === totalSteps - 1;

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
            default:
                return (
                    <GamifiedLearningSlide
                        isDark={isDark}
                        onNext={isLastSlide ? handleComplete : handleNext}
                        onBack={handleBack}
                        onSkip={handleSkip}
                        step={step}
                        totalSteps={totalSteps}
                    />
                );
        }
    };

    return (
        <YStack flex={1} backgroundColor={isDark ? '#060606ff' : '#fdfcf7'}>
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
