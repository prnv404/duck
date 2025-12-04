import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';

interface GoogleSignInButtonProps {
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    error?: string;
}

export function GoogleSignInButton({
    onPress,
    loading = false,
    disabled = false,
    error,
}: GoogleSignInButtonProps) {
    const isDark = useColorScheme() === 'dark';
    const isDisabled = disabled || loading;

    return (
        <YStack width="100%" gap="$3">
            <Pressable
                onPress={onPress}
                disabled={isDisabled}
                style={({ pressed }) => [
                    styles.button,
                    {
                        opacity: isDisabled ? 0.6 : 1,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                ]}
            >
                <LinearGradient
                    colors={isDark ? ['#ffffff', '#a8a9abff'] : ['#0e0f0fff', '#131517ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            borderRadius: 16,
                            shadowColor: isDark ? '#fafafaff' : '#000',
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: isDark ? 0.3 : 0.15,
                            shadowRadius: 16,
                            elevation: 6,
                        },
                    ]}
                />
                <XStack
                    alignItems="center"
                    justifyContent="center"
                    gap="$3"
                    zIndex={1}
                    width="100%"
                    paddingHorizontal="$4"
                >
                    {!loading && (
                        <Image
                            source={require('../../../assets/images/google.png')}
                            style={{ width: 24, height: 24 }}
                            resizeMode="contain"
                        />
                    )}
                    <XStack alignItems="center" gap="$2">
                        {loading && (
                            <ActivityIndicator size="small" color={isDark ? '#0a0f0dff' : '#ffffff'} />
                        )}
                        <Text
                            fontFamily="Nunito_900Black"
                            fontSize={18}
                            color={isDark ? '#111315ff' : '#ffffff'}
                            letterSpacing={-0.5}
                        >
                            {loading ? 'Signing you in...' : 'Continue with Google'}
                        </Text>
                    </XStack>
                </XStack>
            </Pressable>

            {error && (
                <YStack
                    backgroundColor={isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2'}
                    borderRadius={14}
                    px="$4"
                    py="$3"
                    borderWidth={1}
                    borderColor={isDark ? 'rgba(239,68,68,0.25)' : '#fecaca'}
                >
                    <XStack alignItems="center" justifyContent="center" gap="$2">
                        <Text fontSize={16}>⚠️</Text>
                        <Text fontFamily="Nunito_700Bold" fontSize={13} color="#ef4444">
                            {error}
                        </Text>
                    </XStack>
                </YStack>
            )}
        </YStack>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 62,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

export default GoogleSignInButton;
