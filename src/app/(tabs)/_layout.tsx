import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: isDark ? '#ffffff' : '#000000',
        tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 14,
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1f2937' : '#e5e7eb',
          backgroundColor: isDark ? '#0a0f1c' : '#ffffff',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}>
      {/* Hide the index from tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
              {focused && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginTop: 4 }} />
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => Haptics.selectionAsync(),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
              {focused && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginTop: 4 }} />
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => Haptics.selectionAsync(),
        }}
      />
    </Tabs>

  );
}