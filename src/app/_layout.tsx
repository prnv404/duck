import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import Constants from 'expo-constants';
import { PostHogProvider } from 'posthog-react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import tamaguiConfig from '../../tamagui.config';
import posthogClient from '@/lib/posthog';
import { AuthProvider } from '@/contexts/AuthContext';
import { audioFeedbackService } from '@/services/audioFeedback.service';



// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      SystemUI.setBackgroundColorAsync('transparent');

      // Pre-load audio SFX for quiz feedback
      audioFeedbackService.load();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <PostHogProvider
        client={posthogClient}
        autocapture={{
          captureTouches: true, // Enable touch event tracking
          captureScreens: true, // Enable screen navigation tracking
          customLabelProp: "ph-label", // Custom label property for better event naming
          noCaptureProp: "ph-no-capture", // Property to exclude sensitive elements
          propsToCapture: ["testID", "accessibilityLabel"], // Capture these props for better identification
          maxElementsCaptured: 20, // Maximum elements in the view hierarchy to capture
        }}
      >
        <SafeAreaProvider>
          <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
            <View style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Daily Challenge' }} />
              </Stack>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </View>
          </TamaguiProvider>
        </SafeAreaProvider>
      </PostHogProvider>
    </AuthProvider>
  );
}
