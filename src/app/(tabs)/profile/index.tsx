import { YStack, XStack, Text, Separator } from 'tamagui'
import { ScrollView, Pressable, Alert, Switch } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown } from 'react-native-reanimated'

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark)
  
  const user = {
    name: 'PSC Aspirant',
    email: 'aspirant@example.com',
    avatar: '👤',
    streak: 7,
    xp: 3890,
    lessons: 142,
    accuracy: 78
  }

  const stats = [
    { label: 'Streak', value: user.streak, icon: 'flame', color: '#f59e0b' },
    { label: 'Total XP', value: user.xp, icon: 'flash', color: '#8b5cf6' },
    { label: 'Lessons', value: user.lessons, icon: 'book', color: '#3b82f6' },
    { label: 'Accuracy', value: `${user.accuracy}%`, icon: 'checkmark-circle', color: '#22c55e' },
  ]

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', color: '#3b82f6' },
    { icon: 'notifications-outline', label: 'Notifications', color: '#f59e0b' },
    { icon: 'shield-checkmark-outline', label: 'Privacy', color: '#22c55e' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#8b5cf6' },
    { icon: 'information-circle-outline', label: 'About', color: '#06b6d4' },
    { icon: 'log-out-outline', label: 'Logout', color: '#ef4444' },
  ]

  const SettingRow = ({ 
    icon, 
    iconColor, 
    title, 
    subtitle,
    hasToggle,
    toggleValue,
    onToggle,
    onPress
  }: {
    icon: string
    iconColor: string
    title: string
    subtitle?: string
    hasToggle?: boolean
    toggleValue?: boolean
    onToggle?: (value: boolean) => void
    onPress?: () => void
  }) => (
    <Pressable onPress={onPress} disabled={hasToggle}>
      <XStack ai="center" jc="space-between" py="$3">
        <XStack ai="center" gap="$3" f={1}>
          <YStack
            w={40}
            h={40}
            br={10}
            ai="center"
            jc="center"
            bg={`${iconColor}20`}
          >
            <Ionicons name={icon as any} size={20} color={iconColor} />
          </YStack>
          <YStack f={1}>
            <Text fontSize={15} fontWeight="600">{title}</Text>
            {subtitle && <Text fontSize={12} color="$gray10">{subtitle}</Text>}
          </YStack>
        </XStack>
        {hasToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={(val) => { onToggle?.(val); Haptics.selectionAsync() }}
            trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#8b5cf6' }}
            thumbColor="#fff"
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
        )}
      </XStack>
    </Pressable>
  )

  return (
    <YStack f={1} bg="$background">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <YStack pt={insets.top} pb="$4" px="$4">
          <Text fontSize={28} fontWeight="900" mt="$3">Profile</Text>
        </YStack>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <YStack
            mx="$4"
            mb="$4"
            p="$4"
            br={20}
            bg={isDark ? '$gray2' : '#fff'}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              borderWidth: isDark ? 0 : 1,
              borderColor: isDark ? 'transparent' : '#e5e7eb',
            }}
          >
            <XStack ai="center" gap="$3" mb="$3">
              <YStack
                w={70}
                h={70}
                br={35}
                ai="center"
                jc="center"
                overflow="hidden"
              >
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text fontSize={36}>{user.avatar}</Text>
                </LinearGradient>
              </YStack>
              <YStack f={1}>
                <Text fontSize={20} fontWeight="800">{user.name}</Text>
                <Text fontSize={14} color="$gray10">{user.email}</Text>
              </YStack>
            </XStack>
          </YStack>
        </Animated.View>

        {/* Stats Grid */}
        <YStack px="$4" mb="$4">
          <Text fontSize={16} fontWeight="700" mb="$3">Statistics</Text>
          <XStack gap="$3" flexWrap="wrap">
            {stats.map((stat, index) => (
              <Animated.View
                key={stat.label}
                entering={FadeInDown.delay(150 + index * 50)}
                style={{ width: '48%' }}
              >
                <YStack
                  p="$3"
                  br={16}
                  bg={isDark ? '$gray2' : '#fff'}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.1,
                    shadowRadius: 8,
                    borderWidth: isDark ? 0 : 1,
                    borderColor: isDark ? 'transparent' : '#e5e7eb',
                  }}
                >
                  <XStack ai="center" gap="$2" mb="$2">
                    <YStack
                      w={32}
                      h={32}
                      br={8}
                      ai="center"
                      jc="center"
                      bg={`${stat.color}20`}
                    >
                      <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                    </YStack>
                  </XStack>
                  <Text fontSize={24} fontWeight="900">{stat.value}</Text>
                  <Text fontSize={12} color="$gray10">{stat.label}</Text>
                </YStack>
              </Animated.View>
            ))}
          </XStack>
        </YStack>

        {/* Settings */}
        <YStack px="$4" mb="$4">
          <Text fontSize={16} fontWeight="700" mb="$3">Settings</Text>
          <Animated.View entering={FadeInDown.delay(400)}>
            <YStack
              bg={isDark ? '$gray2' : '#fff'}
              br={16}
              p="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 10,
                borderWidth: isDark ? 0 : 1,
                borderColor: isDark ? 'transparent' : '#e5e7eb',
              }}
            >
              <SettingRow
                icon="notifications"
                iconColor="#3b82f6"
                title="Push Notifications"
                subtitle="Daily reminders & updates"
                hasToggle
                toggleValue={notificationsEnabled}
                onToggle={setNotificationsEnabled}
              />
              <Separator bg="$gray4" />

              <SettingRow
                icon="volume-high"
                iconColor="#22c55e"
                title="Sound Effects"
                subtitle="Quiz sounds & feedback"
                hasToggle
                toggleValue={soundEnabled}
                onToggle={setSoundEnabled}
              />
              <Separator bg="$gray4" />

              <SettingRow
                icon="moon"
                iconColor="#8b5cf6"
                title="Dark Mode"
                hasToggle
                toggleValue={darkModeEnabled}
                onToggle={setDarkModeEnabled}
              />
              <Separator bg="$gray4" />

              <SettingRow
                icon="person"
                iconColor="#f59e0b"
                title="Edit Profile"
                onPress={() => Haptics.selectionAsync()}
              />
              <Separator bg="$gray4" />

              <SettingRow
                icon="shield-checkmark"
                iconColor="#06b6d4"
                title="Privacy & Security"
                onPress={() => Haptics.selectionAsync()}
              />
              <Separator bg="$gray4" />

              <SettingRow
                icon="help-circle"
                iconColor="#ec4899"
                title="Help & Support"
                onPress={() => Haptics.selectionAsync()}
              />
              <Separator bg="$gray4" />

              <SettingRow
                icon="information-circle"
                iconColor="#6b7280"
                title="About"
                subtitle="Version 1.0.0"
                onPress={() => Haptics.selectionAsync()}
              />
            </YStack>
          </Animated.View>
        </YStack>

        {/* Logout Button */}
        <YStack px="$4">
          <Animated.View entering={FadeInDown.delay(450)}>
            <Pressable onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}>
              <YStack
                bg="$red3"
                br={16}
                py="$4"
                ai="center"
                style={{ borderWidth: 1, borderColor: isDark ? '#7f1d1d' : '#fecaca' }}
              >
                <XStack ai="center" gap="$2">
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  <Text fontSize={15} fontWeight="700" color="$red9">Sign Out</Text>
                </XStack>
              </YStack>
            </Pressable>
          </Animated.View>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
