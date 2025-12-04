import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { YStack, Spinner, Text } from 'tamagui';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Index screen - handles initial routing based on auth state
 * Uses Better Auth session to determine authentication status
 * 
 * Requirements: 7.1 - WHEN the app starts THEN the System SHALL validate the current 
 * session before proceeding to any protected screen
 * Requirements: 7.5 - WHEN the user is on a protected screen and session expires 
 * THEN the System SHALL redirect to login without crashing
 */
export default function Index() {
    const router = useRouter();
    const { isAuthenticated, isLoading, user, sessionError } = useAuth();
    const [validationStatus, setValidationStatus] = useState<'validating' | 'valid' | 'invalid'>('validating');

    /**
     * Validates the current session and determines navigation path
     * Requirements: 7.1 - Explicit session validation before navigation
     */
    const validateSessionAndNavigate = useCallback(async () => {
        try {
            // Requirements: 7.1 - Validate session before proceeding
            // Check for session errors first
            if (sessionError) {
                console.warn('Session validation failed with error:', sessionError.message);
                setValidationStatus('invalid');
                router.replace('/login');
                return;
            }

            // Check if user is authenticated with valid session
            if (isAuthenticated && user) {
                setValidationStatus('valid');
                // User is authenticated, check onboarding status
                const onboardingCompleted = await AsyncStorage.getItem('@onboarding_completed');
                if (onboardingCompleted === 'true') {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/onboarding');
                }
            } else {
                // User is not authenticated or session is invalid
                setValidationStatus('invalid');
                router.replace('/login');
            }
        } catch (error) {
            // Requirements: 7.5 - Handle session errors gracefully without crashing
            console.error('Error during session validation:', error);
            setValidationStatus('invalid');
            // Gracefully redirect to login on any error
            router.replace('/login');
        }
    }, [isAuthenticated, user, sessionError, router]);

    useEffect(() => {
        // Wait for auth state to be determined
        if (isLoading) {
            setValidationStatus('validating');
            return;
        }

        validateSessionAndNavigate();
    }, [isAuthenticated, isLoading, user, sessionError, validateSessionAndNavigate]);

    return (
        <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
            <Spinner size="large" color="$blue10" />
            {validationStatus === 'validating' && (
                <Text marginTop="$4" color="$gray10" fontSize="$3">
                    Validating session...
                </Text>
            )}
        </YStack>
    );
}
