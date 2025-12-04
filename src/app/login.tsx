import React, { useState, useCallback, useEffect } from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';
    const { trackEvent, trackScreen } = useAnalytics();
    const { signInWithGoogle, user, isAuthenticated, isLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const bgColor = isDark ? '#0a0a0a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const textSecondary = isDark ? '#a3a3a3' : '#64748b';
    const green = '#10b981';

    useEffect(() => {
        if (isLoading) return;

        const redirectAuthenticatedUser = async () => {
            if (isAuthenticated && user) {
                await new Promise((resolve) => setTimeout(resolve, 300));

                if (isAuthenticated && user) {
                    const onboardingCompleted = await AsyncStorage.getItem('@onboarding_completed');
                    if (onboardingCompleted === 'true') {
                        router.replace('/(tabs)');
                    } else {
                        router.replace('/onboarding');
                    }
                }
            }
        };

        redirectAuthenticatedUser();
    }, [isAuthenticated, isLoading, user, router]);

    useEffect(() => {
        trackScreen('Login Screen', { method: 'google' });
    }, [trackScreen]);

    const handleGoogleSignIn = useCallback(async () => {
        setError('');
        setLoading(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        trackEvent('google_signin_initiated', {});

        try {
            await signInWithGoogle();
            trackEvent('google_signin_success', {});
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign-in failed';

            if (errorMessage.includes('cancel') || errorMessage.includes('Cancel')) {
                setError('Sign-in cancelled');
                trackEvent('google_signin_cancelled', {});
            } else {
                setError(errorMessage);
                trackEvent('google_signin_failed', { error: errorMessage });
            }
        } finally {
            setLoading(false);
        }
    }, [signInWithGoogle, trackEvent]);

    return (
        <YStack flex={1} backgroundColor={bgColor}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <YStack flex={1} justifyContent="space-between" px="$5" py="$8">
                    {/* Hero Section */}
                    <YStack flex={1} justifyContent="center" gap="$8">
                        {/* Title */}
                        <Animated.View entering={FadeIn.duration(600)}>
                            <YStack gap="$3" alignItems="flex-start">
                                <Text
                                    fontFamily="Nunito_900Black"
                                    fontSize={56}
                                    color={textColor}
                                    letterSpacing={-2}
                                >
                                    Duck
                                </Text>
                                <Text
                                    fontFamily="Nunito_600SemiBold"
                                    fontSize={18}
                                    color={textSecondary}
                                    lineHeight={28}
                                    maxWidth={320}
                                >
                                    Your free companion for PSC exam practice
                                </Text>
                            </YStack>
                        </Animated.View>

                        {/* Features */}
                        <Animated.View entering={FadeInDown.delay(150).springify()}>
                            <YStack gap="$3" alignItems="flex-start">
                                <FeatureText text="AI-powered adaptive questions" isDark={isDark} />
                                <FeatureText text="Track your progress & streaks" isDark={isDark} />
                                <FeatureText text="Focus on weak areas" isDark={isDark} />
                                <FeatureText text="Earn XP, level up & compete" isDark={isDark} />
                                <FeatureText text="Audio questions for better learning" isDark={isDark} />
                            </YStack>
                        </Animated.View>
                    </YStack>

                    {/* Bottom CTA */}
                    <Animated.View entering={FadeInDown.delay(250).springify()}>
                        <YStack gap="$3.5">
                            <GoogleSignInButton onPress={handleGoogleSignIn} loading={loading} error={error} />

                            {/* Trust Badge */}
                            <XStack justifyContent="center" alignItems="center" gap="$2">
                                <MaterialCommunityIcons name="shield-check" size={16} color={green} />
                                <Text
                                    fontFamily="Nunito_600SemiBold"
                                    fontSize={12}
                                    color={textSecondary}
                                    opacity={0.8}
                                >
                                    Secure sign-in • It's completely free
                                </Text>
                            </XStack>

                            {/* Terms */}
                            <XStack justifyContent="center" alignItems="center" flexWrap="wrap" gap="$1">
                                <Text
                                    fontFamily="Nunito_600SemiBold"
                                    fontSize={11}
                                    color={textSecondary}
                                    opacity={0.6}
                                >
                                    By continuing, you agree to our
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        router.push('/legal/terms');
                                    }}
                                >
                                    <Text
                                        fontFamily="Nunito_700Bold"
                                        fontSize={11}
                                        color={green}
                                        textDecorationLine="underline"
                                    >
                                        Terms
                                    </Text>
                                </Pressable>
                                <Text fontFamily="Nunito_600SemiBold" fontSize={11} color={textSecondary} opacity={0.6}>
                                    &
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        router.push('/legal/privacy');
                                    }}
                                >
                                    <Text
                                        fontFamily="Nunito_700Bold"
                                        fontSize={11}
                                        color={green}
                                        textDecorationLine="underline"
                                    >
                                        Privacy Policy
                                    </Text>
                                </Pressable>
                            </XStack>
                        </YStack>
                    </Animated.View>
                </YStack>
            </SafeAreaView>
        </YStack>
    );
}

function FeatureText({ text, isDark }: { text: string; isDark: boolean }) {
    return (
        <XStack alignItems="center" gap="$2.5">
            <YStack
                width={6}
                height={6}
                borderRadius={3}
                backgroundColor={isDark ? '#10b981' : '#10b981'}
            />
            <Text
                fontFamily="Nunito_600SemiBold"
                fontSize={15}
                color={isDark ? '#e4e4e7' : '#3f3f46'}
                lineHeight={22}
            >
                {text}
            </Text>
        </XStack>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
