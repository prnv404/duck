import { PostHog } from 'posthog-react-native';

// Initialize PostHog client
// Replace these with your actual PostHog credentials
export const posthogClient = new PostHog(
    'phc_e5nMW5kXu3oYaoKsPynYBIoTFsvf8KTuZckzRngEaq4', // Replace with your PostHog API key
    {
        host: 'https://us.i.posthog.com', // or 'https://eu.i.posthog.com' for EU
        // Enable autocapture features
        captureAppLifecycleEvents: true, // Capture app open, background, etc.

        // Flush configuration for optimal performance
        flushAt: 20, // Send events after 20 are queued
        flushInterval: 10000, // Send events every 10 seconds

        // Enable feature flags
        preloadFeatureFlags: true,

        // Session configuration
        sessionExpirationTimeSeconds: 1800, // 30 minutes
        enablePersistSessionIdAcrossRestart: true,

        // Disable GeoIP if you don't need location data
        disableGeoip: false,

        // Enable debug mode in development
    }
);

export default posthogClient;
