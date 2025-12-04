import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { StyleSheet, Image, Pressable, ActivityIndicator, View } from 'react-native';

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
    const isDisabled = disabled || loading;

    return (
        <YStack width="100%" gap="$3">
            <Pressable
                onPress={onPress}
                disabled={isDisabled}
                android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: false }}
                style={({ pressed }) => [
                    styles.button,
                    {
                        opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                ]}
            >
                <View style={styles.buttonBackground} />
                <XStack
                    alignItems="center"
                    justifyContent="center"
                    gap="$3"
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
                            <ActivityIndicator size="small" color="#ffffff" />
                        )}
                        <Text
                            fontFamily="Nunito_900Black"
                            fontSize={18}
                            color="#ffffff"
                            letterSpacing={-0.5}
                        >
                            {loading ? 'Signing you in...' : 'Continue with Google'}
                        </Text>
                    </XStack>
                </XStack>
            </Pressable>

            {error && (
                <YStack
                    backgroundColor="#fef2f2"
                    borderRadius={14}
                    px="$4"
                    py="$3"
                    borderWidth={1}
                    borderColor="#fecaca"
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
        backgroundColor: '#1a1a1a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
    },
});

export default GoogleSignInButton;
