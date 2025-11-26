import React, { useState } from 'react';
import { YStack } from 'tamagui';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    FadeOutUp,
    SlideInRight,
    SlideOutLeft,
} from 'react-native-reanimated';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OtpInput } from '@/components/auth/OtpInput';
import { authAPI } from '@/services/auth.api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

type Step = 'phone' | 'otp';

export default function LoginScreen() {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePhoneSubmit = async () => {
        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const fullPhone = `+91${phone}`; // Prepend country code
            await authAPI.requestOtp(fullPhone);
            setStep('otp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP');
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (otp: string) => {
        setError('');
        setLoading(true);

        try {
            const fullPhone = `+91${phone}`;
            await authAPI.verifyOtp(fullPhone, otp);

            // Navigate to main app
            router.replace('/(tabs)');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid OTP');
            Alert.alert('Error', 'Invalid or expired OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        try {
            const fullPhone = `+91${phone}`;
            await authAPI.requestOtp(fullPhone);
            Alert.alert('Success', 'OTP sent successfully!');
        } catch (err) {
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
                        {step === 'phone' ? (
                            <Animated.View
                                entering={FadeInDown.duration(600)}
                                exiting={FadeOutUp.duration(400)}
                                style={styles.formContainer}
                            >
                                <PhoneInput
                                    value={phone}
                                    onChangeText={setPhone}
                                    error={error}
                                    onSubmit={handlePhoneSubmit}
                                    loading={loading}
                                />
                            </Animated.View>
                        ) : (
                            <Animated.View
                                entering={SlideInRight.duration(600)}
                                exiting={SlideOutLeft.duration(400)}
                                style={styles.formContainer}
                            >
                                <OtpInput
                                    phone={`+91${phone}`}
                                    onVerify={handleOtpVerify}
                                    onResend={handleResendOtp}
                                    loading={loading}
                                    error={error}
                                />
                            </Animated.View>
                        )}
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
    },
});
