/**
 * PostHog Analytics - Tracking Examples
 * 
 * This file contains examples of how to implement PostHog tracking
 * throughout your React Native app.
 */

import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

// ============================================
// EXAMPLE 1: Track Screen Views
// ============================================

export function ExampleScreenTracking() {
    const { trackScreen } = useAnalytics();

    useEffect(() => {
        // Track when screen is viewed
        trackScreen('Home Screen', {
            timestamp: new Date().toISOString(),
            source: 'navigation',
        });
    }, []);

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 2: Track Quiz Events
// ============================================

export function ExampleQuizTracking() {
    const { trackEvent } = useAnalytics();

    const handleQuizStart = (mode: string, subject?: string) => {
        trackEvent('quiz_started', {
            mode,
            subject,
            timestamp: new Date().toISOString(),
        });
    };

    const handleQuestionAnswered = (
        questionId: string,
        isCorrect: boolean,
        timeSpent: number
    ) => {
        trackEvent('question_answered', {
            questionId,
            isCorrect,
            timeSpent, // in seconds
            result: isCorrect ? 'correct' : 'incorrect',
        });
    };

    const handleQuizCompleted = (
        score: number,
        totalQuestions: number,
        timeSpent: number
    ) => {
        trackEvent('quiz_completed', {
            score,
            totalQuestions,
            percentage: (score / totalQuestions) * 100,
            timeSpent,
            performance: score / totalQuestions >= 0.8 ? 'excellent' :
                score / totalQuestions >= 0.6 ? 'good' : 'needs_improvement',
        });
    };

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 3: Track User Actions
// ============================================

export function ExampleUserActions() {
    const { trackEvent } = useAnalytics();

    const handleHintUsed = (questionId: string) => {
        trackEvent('hint_used', {
            questionId,
            timestamp: new Date().toISOString(),
        });
    };

    const handleBookmarkToggle = (questionId: string, isBookmarked: boolean) => {
        trackEvent('question_bookmarked', {
            questionId,
            action: isBookmarked ? 'added' : 'removed',
        });
    };

    const handleShareApp = (method: string) => {
        trackEvent('app_shared', {
            method, // 'whatsapp', 'facebook', 'twitter', etc.
            timestamp: new Date().toISOString(),
        });
    };

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 4: Track User Authentication
// ============================================

export function ExampleAuthTracking() {
    const { identifyUser, setUserProperties, reset, trackEvent } = useAnalytics();

    const handleLogin = (userId: string, userData: any) => {
        // Identify the user
        identifyUser(userId, {
            email: userData.email,
            name: userData.name,
            createdAt: userData.createdAt,
        });

        // Set additional properties
        setUserProperties({
            plan: userData.plan || 'free',
            lastLogin: new Date().toISOString(),
            appVersion: '1.0.0',
        });

        // Track login event
        trackEvent('user_logged_in', {
            method: userData.loginMethod, // 'email', 'google', 'facebook', etc.
        });
    };

    const handleSignup = (userId: string, userData: any) => {
        identifyUser(userId, {
            email: userData.email,
            name: userData.name,
            signupDate: new Date().toISOString(),
        });

        trackEvent('user_signed_up', {
            method: userData.signupMethod,
            source: userData.referralSource,
        });
    };

    const handleLogout = () => {
        trackEvent('user_logged_out');
        reset(); // Clear user data
    };

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 5: Track Ad Interactions
// ============================================

export function ExampleAdTracking() {
    const { trackEvent } = useAnalytics();

    const handleAdImpression = (adType: string, placement: string) => {
        trackEvent('ad_impression', {
            adType, // 'banner', 'interstitial', 'rewarded'
            placement, // 'home', 'quiz_start', 'quiz_end'
            timestamp: new Date().toISOString(),
        });
    };

    const handleAdClick = (adType: string, placement: string) => {
        trackEvent('ad_clicked', {
            adType,
            placement,
            timestamp: new Date().toISOString(),
        });
    };

    const handleAdClosed = (adType: string, watched: boolean) => {
        trackEvent('ad_closed', {
            adType,
            watched, // true if user watched the full ad
            timestamp: new Date().toISOString(),
        });
    };

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 6: Track In-App Purchases
// ============================================

export function ExamplePurchaseTracking() {
    const { trackEvent, setUserProperties } = useAnalytics();

    const handlePurchaseStarted = (productId: string, price: number) => {
        trackEvent('purchase_started', {
            productId,
            price,
            currency: 'USD',
        });
    };

    const handlePurchaseCompleted = (
        productId: string,
        price: number,
        transactionId: string
    ) => {
        trackEvent('purchase_completed', {
            productId,
            price,
            currency: 'USD',
            transactionId,
            timestamp: new Date().toISOString(),
        });

        // Update user properties
        setUserProperties({
            isPremium: true,
            lastPurchaseDate: new Date().toISOString(),
            totalSpent: price, // You might want to increment this
        });
    };

    const handlePurchaseFailed = (productId: string, error: string) => {
        trackEvent('purchase_failed', {
            productId,
            error,
            timestamp: new Date().toISOString(),
        });
    };

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 7: Track Feature Usage
// ============================================

export function ExampleFeatureTracking() {
    const { trackEvent, isFeatureEnabled } = useAnalytics();

    const handleFeatureUsed = (featureName: string) => {
        trackEvent('feature_used', {
            featureName,
            timestamp: new Date().toISOString(),
        });
    };

    const handleSettingChanged = (settingName: string, value: any) => {
        trackEvent('setting_changed', {
            settingName,
            newValue: value,
            timestamp: new Date().toISOString(),
        });
    };

    // Example of using feature flags
    const renderNewFeature = () => {
        const showNewQuizMode = isFeatureEnabled('new-quiz-mode');

        if (showNewQuizMode) {
            trackEvent('feature_flag_shown', {
                flagName: 'new-quiz-mode',
                shown: true,
            });
            // Render new feature
        }
    };

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 8: Track Errors and Performance
// ============================================

export function ExampleErrorTracking() {
    const { trackEvent } = useAnalytics();

    const handleError = (error: Error, context: string) => {
        trackEvent('error_occurred', {
            errorMessage: error.message,
            errorStack: error.stack,
            context,
            timestamp: new Date().toISOString(),
        });
    };

    const handlePerformanceMetric = (metricName: string, value: number) => {
        trackEvent('performance_metric', {
            metricName, // 'quiz_load_time', 'question_render_time', etc.
            value,
            unit: 'milliseconds',
            timestamp: new Date().toISOString(),
        });
    };

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 9: Track Onboarding Flow
// ============================================

export function ExampleOnboardingTracking() {
    const { trackEvent, trackScreen } = useAnalytics();

    const handleOnboardingStep = (stepNumber: number, stepName: string) => {
        trackScreen(`Onboarding Step ${stepNumber}`, {
            stepName,
            stepNumber,
        });

        trackEvent('onboarding_step_viewed', {
            stepNumber,
            stepName,
        });
    };

    const handleOnboardingCompleted = (totalTime: number) => {
        trackEvent('onboarding_completed', {
            totalTime, // in seconds
            timestamp: new Date().toISOString(),
        });
    };

    const handleOnboardingSkipped = (atStep: number) => {
        trackEvent('onboarding_skipped', {
            atStep,
            timestamp: new Date().toISOString(),
        });
    };

    return null; // Your component JSX
}

// ============================================
// EXAMPLE 10: Track Social Features
// ============================================

export function ExampleSocialTracking() {
    const { trackEvent } = useAnalytics();

    const handleScoreShared = (score: number, platform: string) => {
        trackEvent('score_shared', {
            score,
            platform, // 'facebook', 'twitter', 'whatsapp', etc.
            timestamp: new Date().toISOString(),
        });
    };

    const handleLeaderboardViewed = () => {
        trackEvent('leaderboard_viewed', {
            timestamp: new Date().toISOString(),
        });
    };

    const handleFriendInvited = (method: string) => {
        trackEvent('friend_invited', {
            method, // 'sms', 'email', 'social', etc.
            timestamp: new Date().toISOString(),
        });
    };

    return null; // Your component JSX
}
