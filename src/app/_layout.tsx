import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';
import 'react-native-reanimated';
// Premium font (Nunito) will be loaded after package install

import { useColorScheme } from '@/hooks/use-color-scheme';
import tamaguiConfig from '../../tamagui.config';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('transparent');
  }, []);

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Daily Challenge' }} />
        <Stack.Screen name="play" options={{ title: 'Play' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </TamaguiProvider>
  );
}
