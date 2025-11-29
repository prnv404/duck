
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import NetInfo from '@react-native-community/netinfo';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, YStack, Text } from 'tamagui';

import { useColorScheme } from '@/hooks/use-color-scheme';
import tamaguiConfig from '../../tamagui.config';



// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isOffline, setIsOffline] = useState(false);

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
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false || state.isInternetReachable === false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsOffline(state.isConnected === false || state.isInternetReachable === false);
    });
  };

  if (!loaded) return null;

  return (
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

          {isOffline && (
            <View style={styles.offlineOverlay} pointerEvents="auto">
              <YStack
                bg={isDark ? '#020617' : '#e0f2fe'}
                br={28}
                p="$5"
                w="90%"
                maxWidth={380}
                alignSelf="center"
                gap="$3.5"
              >
                <YStack ai="center" gap="$2">
                  <MaterialCommunityIcons
                    name="wifi-off"
                    size={32}
                    color={isDark ? '#38bdf8' : '#0ea5e9'}
                  />
                  <Text
                    fontSize={22}
                    fontFamily="Nunito_900Black"
                    color={isDark ? '#e5e7eb' : '#0f172a'}
                    textAlign="center"
                  >
                    No internet, but the duck is still proud of you
                  </Text>
                </YStack>

                <Text
                  fontSize={14}
                  fontFamily="Nunito_700Bold"
                  color={isDark ? '#9ca3af' : '#475569'}
                  textAlign="center"
                >
                  We'll pause your progress here. Fix your connection and hit Try Again to continue grinding.
                </Text>

                <Text
                  fontSize={12}
                  fontFamily="Nunito_600SemiBold"
                  color={isDark ? '#6b7280' : '#64748b'}
                  textAlign="center"
                >
                  Offline mode doesn't eat your streak, but you can't fetch new questions until you reconnect.
                </Text>

                <YStack mt="$4" ai="center">
                  <TouchableOpacity onPress={handleRetry} activeOpacity={0.85}>
                    <View style={[styles.retryButton, { backgroundColor: isDark ? '#0ea5e9' : '#0f172a' }]}>
                      <Text
                        fontSize={15}
                        fontFamily="Nunito_800ExtraBold"
                        color="#ffffff"
                        textAlign="center"
                      >
                        Try Again
                      </Text>
                    </View>
                  </TouchableOpacity>
                </YStack>
              </YStack>
            </View>
          )}

          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </View>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  offlineOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    zIndex: 999,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});
