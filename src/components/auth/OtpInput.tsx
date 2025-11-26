import React, { useRef, useState, useEffect } from 'react';
import { YStack, XStack, Text, Input, Button } from 'tamagui';
import { StyleSheet, TextInput, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
        <YStack gap="$4" width="100%" alignItems="center">
            <YStack gap="$2" alignItems="center">
                <Text
                    fontSize={32}
                    fontFamily="Nunito_900Black"
                    color={isDark ? '#ffffff' : '#0a0a0a'}
                    textAlign="center"
                    letterSpacing={-0.5}
                >
                    Enter OTP
                </Text>
                <Text
                    fontSize={15}
                    fontFamily="Nunito_600SemiBold"
                    color={isDark ? '#737373' : '#737373'}
                    textAlign="center"
                >
                    We sent a code to {phone}
                </Text>
            </YStack>

            <XStack gap="$2.5" marginTop="$3" marginBottom="$2">
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
                        width={50}
                        height={60}
                        backgroundColor={isDark ? '#0f0f0f' : '#fafafa'}
                        borderWidth={2}
                        borderColor={
                            error
                                ? '#ef4444'
                                : digit
                                    ? (isDark ? '#ffffff' : '#0a0a0a')
                                    : (isDark ? '#1a1a1a' : '#f0f0f0')
                        }
                        borderRadius={12}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0.3 : 0.1,
                            shadowRadius: 4,
                        }}
                    />
                ))}
            </XStack>

            {error && (
                <Text
                    fontSize={13}
                    fontFamily="Nunito_600SemiBold"
                    color="#ef4444"
                    marginTop="$-1"
                >
                    {error}
                </Text>
            )}

            <YStack gap="$3" width="100%" marginTop="$2">
                <Button
                    size="$5"
                    backgroundColor={isComplete ? (isDark ? '#ffffff' : '#0a0a0a') : (isDark ? '#1a1a1a' : '#f5f5f5')}
                    color={isComplete ? (isDark ? '#0a0a0a' : '#ffffff') : (isDark ? '#525252' : '#a3a3a3')}
                    fontSize={16}
                    fontFamily="Nunito_800ExtraBold"
                    borderRadius={16}
                    height={52}
                    pressStyle={{
                        backgroundColor: isComplete ? (isDark ? '#f5f5f5' : '#1a1a1a') : undefined,
                        scale: 0.98
                    }}
                    disabled={!isComplete || loading}
                    onPress={() => onVerify(otp.join(''))}
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                {timer > 0 ? (
                    <Text
                        fontSize={14}
                        fontFamily="Nunito_600SemiBold"
                        color={isDark ? '#525252' : '#a3a3a3'}
                        textAlign="center"
                    >
                        Resend OTP in {timer}s
                    </Text>
                ) : (
                    <Button
                        size="$4"
                        backgroundColor="transparent"
                        color={isDark ? '#ffffff' : '#0a0a0a'}
                        fontSize={15}
                        fontFamily="Nunito_700Bold"
                        onPress={handleResend}
                        pressStyle={{ opacity: 0.7 }}
                    >
                        Resend OTP
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
