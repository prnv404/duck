import { YStack, XStack, Text, Separator, Image } from 'tamagui'
import { ScrollView, Pressable, Alert, Switch } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated'
import { authAPI } from '@/services/auth.api'
import { useRouter } from 'expo-router'
import Skeleton from '@/components/ui/Skeleton'

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const data = await authAPI.getCurrentUser()
      if (data) {
        setUserData(data)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
              await authAPI.logout()
              router.replace('/login')
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.')
            }
          },
        },
      ]
    )
  }

  const user = {
    name: userData?.fullName || userData?.username || 'User',
    email: userData?.phone || 'No phone',
    avatar: userData?.avatarUrl || '👤',
    stats: userData?.userStats || {}
  }

  const level = user.stats.level || 0
  const currentXP = user.stats.totalXp || 0
  const nextLevelXP = user.stats.xpToNextLevel || 100
  const xpProgress = ((currentXP % nextLevelXP) / nextLevelXP) * 100

  const primaryStats = [
    {
      label: 'Streak',
      value: user.stats.currentStreak || 0,
      icon: 'flame',
      gradient: ['#ff6b6b', '#ee5a6f'],
      unit: ''
    },
    {
      label: 'Accuracy',
      value: user.stats.overallAccuracy || 0,
      icon: 'analytics',
      gradient: ['#4ecdc4', '#44a08d'],
      unit: '%'
    },
    {
      label: 'Quizzes',
      value: user.stats.totalQuizzesCompleted || 0,
      icon: 'trophy',
      gradient: ['#ffd93d', '#f6c93f'],
      unit: ''
    },
  ]

  const achievementStats = [
    {
      label: 'Questions',
      value: user.stats.totalQuestionsAttempted || 0,
      icon: 'help-circle',
      color: '#60a5fa'
    },
    {
      label: 'Correct',
      value: user.stats.totalCorrectAnswers || 0,
      icon: 'checkmark-circle',
      color: '#34d399'
    },
    {
      label: 'Practice',
      value: `${user.stats.totalPracticeTimeMinutes || 0}m`,
      icon: 'time',
      color: '#f472b6'
    },
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
          <YStack mx="$4" mb="$4">
            <YStack
              br={24}
              overflow="hidden"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isDark ? 0.4 : 0.15,
                shadowRadius: 16,
              }}
            >
              <LinearGradient
                colors={isDark ? ['#18181b', '#27272a'] : ['#ffffff', '#fafafa']}
                style={{ padding: 20 }}
              >
                <XStack ai="center" gap="$4" mb="$4">
                  <YStack position="relative">
                    <YStack
                      w={90}
                      h={90}
                      br={45}
                      overflow="hidden"
                      style={{
                        borderWidth: 4,
                        borderColor: isDark ? '#8b5cf6' : '#a78bfa',
                      }}
                    >
                      {user.avatar && user.avatar.startsWith('http') ? (
                        <Image
                          source={{ uri: user.avatar, width: 90, height: 90 }}
                          width="100%"
                          height="100%"
                          resizeMode="cover"
                        />
                      ) : (
                        <LinearGradient
                          colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Text fontSize={44}>{user.avatar}</Text>
                        </LinearGradient>
                      )}
                    </YStack>
                    {/* Level Badge */}
                    <YStack
                      position="absolute"
                      bottom={-4}
                      right={-4}
                      w={36}
                      h={36}
                      br={18}
                      ai="center"
                      jc="center"
                      style={{
                        borderWidth: 3,
                        borderColor: isDark ? '#18181b' : '#ffffff',
                      }}
                    >
                      <LinearGradient
                        colors={['#fbbf24', '#f59e0b', '#d97706']}
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 18
                        }}
                      >
                        <Text fontSize={14} fontWeight="900" color="#fff">
                          {level}
                        </Text>
                      </LinearGradient>
                    </YStack>
                  </YStack>

                  <YStack f={1}>
                    <Text fontSize={24} fontWeight="900">
                      {user.name}
                    </Text>
                    <Text fontSize={14} color="$gray10" mb="$2">
                      {user.email}
                    </Text>
                    <XStack ai="center" gap="$2">
                      <YStack
                        px="$2"
                        py="$1"
                        br={8}
                        bg={isDark ? '#8b5cf620' : '#f3e8ff'}
                      >
                        <Text fontSize={11} fontWeight="700" color="#8b5cf6">
                          Level {level}
                        </Text>
                      </YStack>
                    </XStack>
                  </YStack>
                </XStack>

                {/* XP Progress */}
                <YStack gap="$2">
                  <XStack jc="space-between" ai="center">
                    <Text fontSize={12} fontWeight="700" color="$gray11">
                      {currentXP % nextLevelXP} / {nextLevelXP} XP
                    </Text>
                    <Text fontSize={12} fontWeight="700" color="#8b5cf6">
                      {Math.round(xpProgress)}%
                    </Text>
                  </XStack>
                  <YStack
                    h={10}
                    bg={isDark ? '#27272a' : '#f3f4f6'}
                    br={5}
                    overflow="hidden"
                  >
                    <Animated.View
                      entering={FadeIn.delay(300)}
                      style={{ width: `${xpProgress}%`, height: '100%' }}
                    >
                      <LinearGradient
                        colors={['#8b5cf6', '#7c3aed']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Animated.View>
                  </YStack>
                </YStack>
              </LinearGradient>
            </YStack>
          </YStack>
        </Animated.View>

        {/* Stats Grid */}
        <YStack px="$4">
          <Text fontSize={20} fontWeight="800" mb="$3">Quick Stats</Text>

          {loading ? (
            <YStack gap="$2.5">
              <XStack gap="$2.5">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} width="32%" height={95} borderRadius={16} />
                ))}
              </XStack>
              <XStack gap="$2.5">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} width="32%" height={95} borderRadius={16} />
                ))}
              </XStack>
            </YStack>
          ) : (
            <YStack gap="$2.5">
              {/* Top Row - Primary Stats with Gradients */}
              <XStack gap="$2.5" jc="space-between">
                {primaryStats.map((stat, index) => (
                  <Animated.View
                    key={stat.label}
                    entering={ZoomIn.delay(100 + index * 80)}
                    style={{ flex: 1 }}
                  >
                    <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                      <YStack
                        br={16}
                        overflow="hidden"
                        style={{
                          shadowColor: stat.gradient[0],
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.25,
                          shadowRadius: 8,
                        }}
                      >
                        <LinearGradient
                          colors={stat.gradient as any}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{ paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', minHeight: 95 }}
                        >
                          <YStack
                            w={36}
                            h={36}
                            br={10}
                            ai="center"
                            jc="center"
                            bg="rgba(255,255,255,0.3)"
                            mb="$1.5"
                          >
                            <Ionicons name={stat.icon as any} size={20} color="#fff" />
                          </YStack>
                          <Text fontSize={24} fontWeight="900" color="#fff" lineHeight={28}>
                            {stat.value}{stat.unit}
                          </Text>
                          <Text fontSize={9} fontWeight="700" color="rgba(255,255,255,0.85)" textTransform="uppercase" letterSpacing={0.8}>
                            {stat.label}
                          </Text>
                        </LinearGradient>
                      </YStack>
                    </Pressable>
                  </Animated.View>
                ))}
              </XStack>

              {/* Bottom Row - Secondary Stats */}
              <XStack gap="$2.5" jc="space-between">
                {achievementStats.map((stat, index) => (
                  <Animated.View
                    key={stat.label}
                    entering={FadeInDown.delay(300 + index * 80)}
                    style={{ flex: 1 }}
                  >
                    <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                      <YStack
                        br={16}
                        bg={isDark ? '$gray2' : '#fff'}
                        py="$3.5"
                        px="$3"
                        ai="center"
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isDark ? 0.3 : 0.06,
                          shadowRadius: 8,
                          borderWidth: 1,
                          borderColor: isDark ? '#27272a' : '#f3f4f6',
                          minHeight: 95,
                        }}
                      >
                        <YStack
                          w={36}
                          h={36}
                          br={10}
                          ai="center"
                          jc="center"
                          bg={`${stat.color}15`}
                          mb="$1.5"
                          style={{
                            borderWidth: 1.5,
                            borderColor: `${stat.color}35`,
                          }}
                        >
                          <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                        </YStack>
                        <Text fontSize={24} fontWeight="900" color={stat.color} lineHeight={28}>
                          {stat.value}
                        </Text>
                        <Text fontSize={9} fontWeight="700" color="$gray11" textTransform="uppercase" letterSpacing={0.8}>
                          {stat.label}
                        </Text>
                      </YStack>
                    </Pressable>
                  </Animated.View>
                ))}
              </XStack>
            </YStack>
          )}
        </YStack>

        {/* Settings Section */}
        <YStack px="$4" mt="$5" mb="$4">
          <XStack ai="center" jc="space-between" mb="$3">
            <Text fontSize={18} fontWeight="800">⚙️ Settings</Text>
          </XStack>

          <Animated.View entering={FadeInDown.delay(500)}>
            <YStack
              bg={isDark ? '$gray2' : '#fff'}
              br={20}
              p="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 10,
                borderWidth: 2,
                borderColor: isDark ? 'transparent' : '#f3f4f6',
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
          <Animated.View entering={FadeInDown.delay(550)}>
            <Pressable onPress={handleLogout}>
              <YStack
                br={20}
                py="$4"
                px="$4"
                ai="center"
                overflow="hidden"
                style={{
                  borderWidth: 2,
                  borderColor: '#ef4444',
                  shadowColor: '#ef4444',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}
              >
                <LinearGradient
                  colors={isDark ? ['#1a1a1a', '#262626'] : ['#fef2f2', '#fee2e2']}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}
                />
                <XStack ai="center" gap="$3" zIndex={1}>
                  <YStack
                    w={48}
                    h={48}
                    br={14}
                    ai="center"
                    jc="center"
                    bg="#ef444420"
                  >
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                  </YStack>
                  <YStack f={1}>
                    <Text fontSize={18} fontWeight="900" color="#ef4444">
                      Logout
                    </Text>
                    <Text fontSize={13} fontWeight="600" color={isDark ? '#737373' : '#a3a3a3'}>
                      Sign out of your account
                    </Text>
                  </YStack>
                  <Ionicons name="chevron-forward" size={22} color="#ef4444" />
                </XStack>
              </YStack>
            </Pressable>
          </Animated.View>
        </YStack>
      </ScrollView>
    </YStack>
  )
}