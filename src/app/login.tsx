import React, { useState, useCallback, useEffect } from 'react';
import { YStack, Text, XStack, Image } from 'tamagui';
import { StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';
    const { signInWithGoogle, user, isAuthenticated, isLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const bgColor = '#f8fafc';
    const textColor = '#1e293b';
    const textSecondary = '#64748b';
    const green = '#059669';

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

    const handleGoogleSignIn = useCallback(async () => {
        setError('');
        setLoading(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            await signInWithGoogle();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign-in failed';

            if (errorMessage.includes('cancel') || errorMessage.includes('Cancel')) {
                setError('Sign-in cancelled');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }, [signInWithGoogle]);

    return (
        <YStack flex={1} backgroundColor={bgColor}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <YStack flex={1} justifyContent="space-between" px="$5" py="$8">
                    {/* Hero Section */}
                    <YStack flex={1} justifyContent="center" alignItems="center" gap="$5" py="$4">
                        {/* App Icon */}
                        <Animated.View entering={FadeIn.duration(800).delay(100)}>
                            <YStack
                                width={100}
                                height={100}
                                borderRadius={26}
                                backgroundColor={isDark ? '#1e293b' : '#ffffff'}
                                alignItems="center"
                                justifyContent="center"
                                borderWidth={1}
                                borderColor={isDark ? '#334155' : '#e2e8f0'}
                                overflow="hidden"
                                style={{
                                    shadowColor: green,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: isDark ? 0.15 : 0.1,
                                    shadowRadius: 16,
                                    elevation: 4,
                                }}
                            >
                                <Image
                                    source={require('../../assets/ios/icons/ios-icon-1024.png')}
                                    width={100}
                                    height={100}
                                    objectFit="cover"
                                />
                            </YStack>
                        </Animated.View>

                        {/* Title & Tagline */}
                        <Animated.View entering={FadeIn.duration(600).delay(200)}>
                            <YStack gap="$1.5" alignItems="center">
                                <Text
                                    fontFamily="Nunito_900Black"
                                    fontSize={42}
                                    color={textColor}
                                    letterSpacing={-1.5}
                                    textAlign="center"
                                >
                                    Duck Learning
                                </Text>
                                <Text
                                    fontFamily="Nunito_600SemiBold"
                                    fontSize={15}
                                    color={textSecondary}
                                    lineHeight={22}
                                    textAlign="center"
                                    maxWidth={260}
                                >
                                    Your companion for PSC exam success
                                </Text>
                            </YStack>
                        </Animated.View>

                        {/* Features Grid */}
                        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ width: '100%', maxWidth: 300 }}>
                            <YStack gap="$2" alignItems="flex-start" mt="$2" width="100%">
                                <FeatureText text="Fun Gamified PSC Learning" isDark={isDark} />
                                <FeatureText text="Daily Smart Quiz Practice" isDark={isDark} />
                                <FeatureText text="Track and Fix Weaknesses" isDark={isDark} />
                                <FeatureText text="Spaced Revision for Memory" isDark={isDark} />
                            </YStack>
                        </Animated.View>
                    </YStack>

                    {/* Bottom CTA */}
                    <Animated.View entering={FadeInDown.delay(250).springify()}>
                        <YStack gap="$3.5">
                            <GoogleSignInButton onPress={handleGoogleSignIn} loading={loading} error={error} />

                            {/* Trust Badge */}
                            <XStack justifyContent="center" alignItems="center" gap="$2">
                                <MaterialCommunityIcons name="shield-check" size={16} color="#059669" />
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
        <XStack alignItems="center" gap="$2" width="100%">
            <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color="#059669"
                style={{ flexShrink: 0 }}
            />
            <Text
                fontFamily="Nunito_600SemiBold"
                fontSize={14}
                color={isDark ? '#52525b' : '#52525b'}
                lineHeight={20}
                flex={1}
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
