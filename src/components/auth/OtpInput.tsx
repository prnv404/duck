import React, { useRef, useState, useEffect } from 'react';
import { YStack, XStack, Text, Input, Button } from 'tamagui';
import { StyleSheet, TextInput, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface OtpInputProps {
    phone: string;
    onVerify: (otp: string) => void;
    onResend: () => void;
    loading?: boolean;
    error?: string;
}

export function OtpInput({ phone, onVerify, onResend, loading, error }: OtpInputProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const isDark = useColorScheme() === 'dark';

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (text: string, index: number) => {
        // Only allow numbers
        if (text && !/^\d+$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Auto-focus next input
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are entered
        if (index === 5 && text) {
            const otpString = newOtp.join('');
            if (otpString.length === 6) {
                Keyboard.dismiss();
                onVerify(otpString);
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        setTimer(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        onResend();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const isComplete = otp.every((digit) => digit !== '');

    return (
        <YStack gap="$6" width="100%" alignItems="center">
            <YStack
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor={isDark ? '#1a1a1a' : '#f3f4f6'}
                alignItems="center"
                justifyContent="center"
                marginBottom="$2"
            >
                <MaterialCommunityIcons name="lock-outline" size={40} color={isDark ? '#ffffff' : '#0a0a0a'} />
            </YStack>

            <YStack gap="$2" alignItems="center">
                <Text
                    fontSize={28}
                    fontFamily="Nunito_900Black"
                    color={isDark ? '#ffffff' : '#0a0a0a'}
                    textAlign="center"
                    letterSpacing={-0.5}
                >
                    Enter Code
                </Text>
                <Text
                    fontSize={16}
                    fontFamily="Nunito_600SemiBold"
                    color={isDark ? '#a1a1aa' : '#525252'}
                    textAlign="center"
                >
                    We sent a code to {phone}
                </Text>
            </YStack>

            <XStack gap="$2" marginTop="$2" marginBottom="$2">
                {otp.map((digit, index) => (
                    <Input
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref as any)}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        textAlign="center"
                        fontSize={24}
                        fontFamily="Nunito_800ExtraBold"
                        color={isDark ? '#ffffff' : '#0a0a0a'}
                        width={48}
                        height={64}
                        backgroundColor={isDark ? '#0f0f0f' : '#ffffff'}
                        borderWidth={1.5}
                        borderColor={
                            error
                                ? '#ef4444'
                                : digit
                                    ? (isDark ? '#ffffff' : '#0a0a0a')
                                    : (isDark ? '#262626' : '#e5e5e5')
                        }
                        borderRadius={16}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0.3 : 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    />
                ))}
            </XStack>

            {error && (
                <XStack gap="$2" alignItems="center" justifyContent="center" marginTop="$-2">
                    <MaterialCommunityIcons name="alert-circle" size={16} color="#ef4444" />
                    <Text
                        fontSize={13}
                        fontFamily="Nunito_600SemiBold"
                        color="#ef4444"
                    >
                        {error}
                    </Text>
                </XStack>
            )}

            <YStack gap="$4" width="100%" marginTop="$2">
                <Button
                    size="$5"
                    backgroundColor={isComplete ? (isDark ? '#ffffff' : '#0a0a0a') : (isDark ? '#1a1a1a' : '#f3f4f6')}
                    color={isComplete ? (isDark ? '#0a0a0a' : '#ffffff') : (isDark ? '#525252' : '#a3a3a3')}
                    fontSize={17}
                    fontFamily="Nunito_800ExtraBold"
                    borderRadius={24}
                    height={56}
                    pressStyle={{
                        backgroundColor: isComplete ? (isDark ? '#e5e5e5' : '#262626') : undefined,
                        scale: 0.98
                    }}
                    disabled={!isComplete || loading}
                    onPress={() => onVerify(otp.join(''))}
                    icon={loading ? undefined : <MaterialCommunityIcons name="check" size={20} color={isComplete ? (isDark ? '#0a0a0a' : '#ffffff') : (isDark ? '#525252' : '#a3a3a3')} />}
                >
                    {loading ? 'Verifying...' : 'Verify Code'}
                </Button>

                {timer > 0 ? (
                    <XStack justifyContent="center" alignItems="center" gap="$2">
                        <MaterialCommunityIcons name="timer-outline" size={16} color={isDark ? '#525252' : '#a3a3a3'} />
                        <Text
                            fontSize={14}
                            fontFamily="Nunito_700Bold"
                            color={isDark ? '#525252' : '#a3a3a3'}
                            textAlign="center"
                        >
                            Resend code in {timer}s
                        </Text>
                    </XStack>
                ) : (
                    <Button
                        size="$4"
                        backgroundColor="transparent"
                        color={isDark ? '#ffffff' : '#0a0a0a'}
                        fontSize={15}
                        fontFamily="Nunito_800ExtraBold"
                        onPress={handleResend}
                        pressStyle={{ opacity: 0.7 }}
                        icon={<MaterialCommunityIcons name="refresh" size={16} color={isDark ? '#ffffff' : '#0a0a0a'} />}
                    >
                        Resend Code
                    </Button>
                )}
            </YStack>
        </YStack>
    );
}

const styles = StyleSheet.create({
    otpInput: {
        // Additional styles if needed
    },
});
