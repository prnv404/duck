import { usePostHog } from 'posthog-react-native';

/**
 * Custom hook to use PostHog analytics throughout the app
 * Provides convenient methods for tracking events, identifying users, and more
 */
export function useAnalytics() {
    const posthog = usePostHog();

    /**
     * Track a custom event
     * @param eventName - Name of the event
     * @param properties - Optional properties to attach to the event
     */
    const trackEvent = (eventName: string, properties?: Record<string, any>) => {
        posthog?.capture(eventName, properties);
    };

    /**
     * Identify a user with their unique ID and properties
     * @param userId - Unique user identifier
     * @param properties - User properties
     */
    const identifyUser = (userId: string, properties?: Record<string, any>) => {
        posthog?.identify(userId, properties);
    };

    /**
     * Set user properties that persist across sessions
     * @param properties - Properties to set
     */
    const setUserProperties = (properties: Record<string, any>) => {
        posthog?.capture('$set', { $set: properties });
    };

    /**
     * Track a screen view
     * @param screenName - Name of the screen
     * @param properties - Optional properties
     */
    const trackScreen = (screenName: string, properties?: Record<string, any>) => {
        posthog?.screen(screenName, properties);
    };

    /**
     * Reset user data (useful for logout)
     */
    const reset = () => {
        posthog?.reset();
    };

    /**
     * Get feature flag value
     * @param flagKey - Feature flag key
     */
    const getFeatureFlag = (flagKey: string) => {
        return posthog?.getFeatureFlag(flagKey);
    };

    /**
     * Check if a feature flag is enabled
     * @param flagKey - Feature flag key
     */
    const isFeatureEnabled = (flagKey: string): boolean => {
        return posthog?.isFeatureEnabled(flagKey) ?? false;
    };

    return {
        trackEvent,
        identifyUser,
        setUserProperties,
        trackScreen,
        reset,
        getFeatureFlag,
        isFeatureEnabled,
        posthog, // Expose the raw client for advanced usage
    };
}
