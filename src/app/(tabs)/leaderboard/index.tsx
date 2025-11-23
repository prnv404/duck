import { YStack, XStack, Text } from 'tamagui'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import Animated, { FadeInDown } from 'react-native-reanimated'

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'

  const leaderboard = [
    { rank: 1, name: 'Rajesh Kumar', xp: 12450, avatar: '👨', streak: 45 },
    { rank: 2, name: 'Priya Nair', xp: 11230, avatar: '👩', streak: 38 },
    { rank: 3, name: 'Arun Menon', xp: 10890, avatar: '👨', streak: 42 },
    { rank: 4, name: 'Lakshmi Devi', xp: 9560, avatar: '👩', streak: 31 },
    { rank: 5, name: 'You', xp: 8920, avatar: '👤', streak: 28, isCurrentUser: true },
    { rank: 6, name: 'Suresh Babu', xp: 8450, avatar: '👨', streak: 25 },
    { rank: 7, name: 'Divya Krishnan', xp: 7890, avatar: '👩', streak: 22 },
    { rank: 8, name: 'Anand Pillai', xp: 7320, avatar: '👨', streak: 19 },
    { rank: 9, name: 'Meera Das', xp: 6780, avatar: '👩', streak: 17 },
    { rank: 10, name: 'Vijay Kumar', xp: 6210, avatar: '👨', streak: 15 },
  ]

  return (
    <YStack f={1} bg="$background">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <YStack pt={insets.top} pb="$4" px="$4">
          <Text fontSize={28} fontWeight="900" mt="$3">Leaderboard</Text>
          <Text fontSize={14} color="$gray10" mt="$1">Top performers this week</Text>
        </YStack>

        {/* Top 3 Podium */}
        <YStack px="$4" mb="$4">
          <XStack ai="flex-end" jc="center" gap="$2" mb="$4">
            {/* 2nd Place */}
            <Animated.View entering={FadeInDown.delay(200)} style={{ flex: 1 }}>
              <YStack ai="center" gap="$2">
                <YStack w={60} h={60} br={30} ai="center" jc="center" overflow="hidden" style={{ borderWidth: 3, borderColor: '#94a3b8' }}>
                  <LinearGradient colors={['#94a3b8', '#64748b']} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text fontSize={32}>{leaderboard[1].avatar}</Text>
                  </LinearGradient>
                </YStack>
                <Text fontSize={18}>🥈</Text>
                <Text fontSize={13} fontWeight="700" textAlign="center" numberOfLines={1}>{leaderboard[1].name}</Text>
                <Text fontSize={12} color="$gray10">{leaderboard[1].xp.toLocaleString()} XP</Text>
              </YStack>
            </Animated.View>

            {/* 1st Place */}
            <Animated.View entering={FadeInDown.delay(100)} style={{ flex: 1 }}>
              <YStack ai="center" gap="$2" mt={-20}>
                <YStack w={80} h={80} br={40} ai="center" jc="center" overflow="hidden" style={{ borderWidth: 4, borderColor: '#fbbf24' }}>
                  <LinearGradient colors={['#fbbf24', '#f59e0b']} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text fontSize={42}>{leaderboard[0].avatar}</Text>
                  </LinearGradient>
                </YStack>
                <Text fontSize={24}>🥇</Text>
                <Text fontSize={15} fontWeight="800" textAlign="center" numberOfLines={1}>{leaderboard[0].name}</Text>
                <Text fontSize={13} fontWeight="700" color="$gray10">{leaderboard[0].xp.toLocaleString()} XP</Text>
              </YStack>
            </Animated.View>

            {/* 3rd Place */}
            <Animated.View entering={FadeInDown.delay(300)} style={{ flex: 1 }}>
              <YStack ai="center" gap="$2">
                <YStack w={60} h={60} br={30} ai="center" jc="center" overflow="hidden" style={{ borderWidth: 3, borderColor: '#fb923c' }}>
                  <LinearGradient colors={['#fb923c', '#f97316']} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text fontSize={32}>{leaderboard[2].avatar}</Text>
                  </LinearGradient>
                </YStack>
                <Text fontSize={18}>🥉</Text>
                <Text fontSize={13} fontWeight="700" textAlign="center" numberOfLines={1}>{leaderboard[2].name}</Text>
                <Text fontSize={12} color="$gray10">{leaderboard[2].xp.toLocaleString()} XP</Text>
              </YStack>
            </Animated.View>
          </XStack>
        </YStack>

        {/* Rest of Leaderboard */}
        <YStack px="$4" gap="$2">
          {leaderboard.slice(3).map((user, index) => (
            <Animated.View key={user.rank} entering={FadeInDown.delay(400 + index * 50)}>
              <YStack
                p="$3"
                br={16}
                bg={user.isCurrentUser ? (isDark ? '$gray3' : '#f3f4f6') : (isDark ? '$gray2' : '#fff')}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isDark ? 0.3 : 0.05,
                  shadowRadius: 4,
                  borderWidth: user.isCurrentUser ? 2 : (isDark ? 0 : 1),
                  borderColor: user.isCurrentUser ? '#8b5cf6' : (isDark ? 'transparent' : '#e5e7eb'),
                }}
              >
                <XStack ai="center" gap="$3">
                  <YStack w={32} ai="center">
                    <Text fontSize={18} fontWeight="900" color={user.isCurrentUser ? '$purple9' : '$gray11'}>{user.rank}</Text>
                  </YStack>
                  <YStack w={48} h={48} br={24} ai="center" jc="center" overflow="hidden">
                    <LinearGradient colors={user.isCurrentUser ? ['#8b5cf6', '#7c3aed'] : ['#8b5cf6', '#7c3aed']} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                      <Text fontSize={24}>{user.avatar}</Text>
                    </LinearGradient>
                  </YStack>
                  <YStack f={1}>
                    <Text fontSize={16} fontWeight="700">{user.name}</Text>
                    <XStack ai="center" gap="$2">
                      <XStack ai="center" gap="$1">
                        <Ionicons name="flash" size={12} color="#8b5cf6" />
                        <Text fontSize={12} color="$gray10">{user.xp.toLocaleString()} XP</Text>
                      </XStack>
                      <Text fontSize={12} color="$gray9">•</Text>
                      <XStack ai="center" gap="$1">
                        <Ionicons name="flame" size={12} color="#f59e0b" />
                        <Text fontSize={12} color="$gray10">{user.streak} days</Text>
                      </XStack>
                    </XStack>
                  </YStack>
                  {user.isCurrentUser && (
                    <YStack bg="$purple9" px="$2" py={4} br={8}>
                      <Text fontSize={10} fontWeight="800" color="#fff">YOU</Text>
                    </YStack>
                  )}
                </XStack>
              </YStack>
            </Animated.View>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  )
}
