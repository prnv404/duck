import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                presentation: 'card',
                animation: 'fade',
                contentStyle: { backgroundColor: '#000' },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
        </Stack>
    );
}
