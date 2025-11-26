import GamificationHeader from '@/components/GamificationHeader';
import StreakCalendar from '@/components/StreakCalendar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Circle, Text, XStack, YStack } from 'tamagui';
import { authAPI } from '@/services/auth.api';
import Skeleton from '@/components/ui/Skeleton';

const { width } = Dimensions.get('window');

const quizModes = [
  {
    type: 'balanced',
    icon: 'scale-balance',
    title: 'Balanced',
    color: '#6366f1',
  },
  {
    type: 'adaptive',
    icon: 'brain',
    title: 'Adaptive',
    color: '#8b5cf6',
  },
  {
    type: 'weak_area',
    icon: 'target',
    title: 'Weak Areas',
    color: '#ef4444',
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('balanced');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      setUserData(user);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userStats = {
    streak: userData?.userStats?.currentStreak || 0,
    xp: userData?.userStats?.totalXp || 0,
    level: userData?.userStats?.level || 1,
    xpToNextLevel: userData?.userStats?.xpToNextLevel || 100,
    accuracy: userData?.userStats?.overallAccuracy || '0.00',
    quizzesCompleted: userData?.userStats?.totalQuizzesCompleted || 0,
    name: userData?.fullName || userData?.username || 'Aspirant',
  };

  const currentLevelXp = userStats.xp - (userStats.xpToNextLevel || 0);
  const nextLevelXp = currentLevelXp + userStats.xpToNextLevel;
  const xpProgress = nextLevelXp > 0 ? Math.round((currentLevelXp / nextLevelXp) * 100) : 0;

  const handleStartQuiz = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/quiz?mode=${selectedMode}` as any);
  };

  const handleModeSelect = (mode: string) => {
    Haptics.selectionAsync();
    setSelectedMode(mode);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#100f0fff' : '#ffffff' }}>
        <YStack p="$4" gap="$6">
          <Skeleton height={120} borderRadius={24} />
          <Skeleton height={280} borderRadius={24} />
          <XStack gap="$3">
            <Skeleton width="48%" height={140} borderRadius={20} />
            <Skeleton width="48%" height={140} borderRadius={20} />
          </XStack>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1a1717ff' : '#fafef9ff' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack gap="$5">
          {/* Header */}
          <GamificationHeader {...userStats} />

          {/* Hero Section - Level Badge + XP Progress */}
          <YStack px="$4" gap="$4">
            {/* Compact Level Badge */}
            <XStack 
              bg={isDark ? '#0f0f0f' : '#fafafa'}
              p="$4"
              br={24}
              ai="center"
              jc="space-between"
              borderWidth={1}
              borderColor={isDark ? '#1a1a1a' : '#f0f0f0'}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={isDark ? 0.3 : 0.06}
              shadowRadius={12}
              elevation={6}
            >
              <XStack ai="center" gap="$4" flex={1}>
                <LinearGradient
                  colors={isDark ? ['#ffffff', '#d4d4d4'] : ['#0a0a0a', '#404040']}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <YStack ai="center">
                    <Text 
                      fontSize={10} 
                      color={isDark ? '#0a0a0a' : '#ffffff'} 
                      fontFamily="Nunito_700Bold"
                      opacity={0.8}
                    >
                      LVL
                    </Text>
                    <Text 
                      fontSize={28} 
                      color={isDark ? '#0a0a0a' : '#ffffff'} 
                      fontFamily="Nunito_900Black"
                      lineHeight={28}
                    >
                      {userStats.level}
                    </Text>
                  </YStack>
                </LinearGradient>

                <YStack flex={1} gap="$2">
                  <XStack jc="space-between" ai="center">
                    <Text 
                      fontSize={16} 
                      fontFamily="Nunito_800ExtraBold" 
                      color={isDark ? '#ffffff' : '#0a0a0a'}
                    >
                      Level {userStats.level + 1}
                    </Text>
                    <XStack ai="center" gap="$1">
                      <MaterialCommunityIcons name="star-four-points" size={14} color="#f59e0b" />
                      <Text 
                        fontSize={14} 
                        fontFamily="Nunito_800ExtraBold" 
                        color={isDark ? '#ffffff' : '#0a0a0a'}
                      >
                        {userStats.xp} XP
                      </Text>
                    </XStack>
                  </XStack>

                  <YStack gap="$1">
                    <View 
                      style={{ 
                        height: 8, 
                        backgroundColor: isDark ? '#262626' : '#e5e5e5', 
                        borderRadius: 4, 
                        overflow: 'hidden' 
                      }}
                    >
                      <LinearGradient
                        colors={isDark ? ['#ffffff', '#d4d4d4'] : ['#0a0a0a', '#404040']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ 
                          width: `${xpProgress}%`, 
                          height: '100%', 
                          borderRadius: 4 
                        }}
                      />
                    </View>
                    <Text 
                      fontSize={11} 
                      color={isDark ? '#737373' : '#a3a3a3'} 
                      fontFamily="Nunito_600SemiBold"
                    >
                      {userStats.xpToNextLevel} XP to next level • {xpProgress}%
                    </Text>
                  </YStack>
                </YStack>
              </XStack>

              <Ionicons name="trophy" size={20} color="#f59e0b" style={{ marginLeft: 12 }} />
            </XStack>

            {/* Quiz Mode Selector + Start Button */}
            <YStack 
              bg={isDark ? '#0f0f0f' : '#fafafa'}
              p="$4"
              br={24}
              borderWidth={1}
              borderColor={isDark ? '#1a1a1a' : '#f0f0f0'}
              gap="$4"
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 6 }}
              shadowOpacity={isDark ? 0.4 : 0.08}
              shadowRadius={16}
              elevation={8}
            >
              <Text 
                fontSize={18} 
                fontFamily="Nunito_800ExtraBold" 
                color={isDark ? '#ffffff' : '#0a0a0a'}
              >
                Choose Quiz Mode
              </Text>

              {/* Mode Pills */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {quizModes.map((mode) => {
                  const isSelected = selectedMode === mode.type;
                  return (
                    <Pressable
                      key={mode.type}
                      onPress={() => handleModeSelect(mode.type)}
                    >
                      <XStack
                        ai="center"
                        gap="$2"
                        px="$3"
                        py="$2.5"
                        br={16}
                        bg={isSelected ? mode.color : (isDark ? '#1a1a1a' : '#f5f5f5')}
                        borderWidth={1}
                        borderColor={isSelected ? mode.color : (isDark ? '#262626' : '#e5e5e5')}
                      >
                        <MaterialCommunityIcons 
                          name={mode.icon as any}
                          size={18} 
                          color={isSelected ? '#ffffff' : mode.color} 
                        />
                        <Text 
                          fontSize={13} 
                          fontFamily="Nunito_700Bold"
                          color={isSelected ? '#ffffff' : (isDark ? '#ffffff' : '#0a0a0a')}
                        >
                          {mode.title}
                        </Text>
                      </XStack>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Start Button */}
              <Button
                size="$5"
                bg={isDark ? '#ffffff' : '#0a0a0a'}
                color={isDark ? '#0a0a0a' : '#ffffff'}
                pressStyle={{ bg: isDark ? '#f5f5f5' : '#1a1a1a', scale: 0.98 }}
                onPress={handleStartQuiz}
                h={56}
                br={18}
                shadowColor={isDark ? '#ffffff' : '#000'}
                shadowOpacity={0.3}
                shadowRadius={12}
                elevation={8}
                icon={<MaterialCommunityIcons name="play" size={24} color={isDark ? '#0a0a0a' : '#ffffff'} />}
              >
                <Text 
                  fontSize={18} 
                  color={isDark ? '#0a0a0a' : '#ffffff'} 
                  fontFamily="Nunito_800ExtraBold"
                >
                  Start Practice
                </Text>
              </Button>
            </YStack>
          </YStack>

          {/* Enhanced Stats Cards */}
          <YStack px="$4" gap="$3">
            <Text 
              fontSize={20} 
              fontFamily="Nunito_900Black" 
              color={isDark ? '#ffffff' : '#0a0a0a'}
              letterSpacing={-0.5}
            >
              Your Progress
            </Text>

            <XStack gap="$3">
              <EnhancedStatCard
                icon="fire"
                value={userStats.streak}
                label="Day Streak"
                color="#ef4444"
                trend="+2"
                isDark={isDark}
              />
              <EnhancedStatCard
                icon="target"
                value={`${userStats.accuracy}%`}
                label="Accuracy"
                color="#10b981"
                trend="+5%"
                isDark={isDark}
              />
            </XStack>

            <XStack gap="$3">
              <EnhancedStatCard
                icon="trophy-outline"
                value={userStats.quizzesCompleted}
                label="Quizzes"
                color="#f59e0b"
                trend="+12"
                isDark={isDark}
              />
              <EnhancedStatCard
                icon="clock-outline"
                value="2.4h"
                label="Study Time"
                color="#06b6d4"
                trend="+30m"
                isDark={isDark}
              />
            </XStack>
          </YStack>

          {/* Focus Areas */}
          <YStack px="$4" gap="$4" mt="$2">
            <XStack jc="space-between" ai="center">
              <Text 
                fontSize={20} 
                fontFamily="Nunito_900Black" 
                color={isDark ? '#ffffff' : '#0a0a0a'}
                letterSpacing={-0.5}
              >
                Focus Areas
              </Text>
              <Text 
                fontSize={14} 
                color={isDark ? '#a3a3a3' : '#737373'} 
                fontFamily="Nunito_700Bold"
              >
                Improve These
              </Text>
            </XStack>

            <YStack gap="$3">
              {[
                { topic: 'Indian Polity', accuracy: 48, questions: 42 },
                { topic: 'Modern History', accuracy: 52, questions: 35 },
                { topic: 'Geography', accuracy: 55, questions: 28 },
                { topic: 'Economy', accuracy: 58, questions: 31 },
              ].map((item) => (
                <Pressable
                  key={item.topic}
                  onPress={() => {
                    Haptics.selectionAsync();
                  }}
                >
                  <YStack
                    bg={isDark ? '#0f0f0f' : '#fafafa'}
                    p="$4"
                    br={20}
                    borderWidth={1}
                    borderColor={isDark ? '#1a1a1a' : '#f0f0f0'}
                    gap="$3"
                    shadowColor="#000"
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowOpacity={isDark ? 0.3 : 0.06}
                    shadowRadius={12}
                    elevation={6}
                  >
                    <XStack jc="space-between" ai="center">
                      <YStack gap="$1" flex={1}>
                        <Text 
                          fontSize={17} 
                          fontFamily="Nunito_800ExtraBold" 
                          color={isDark ? '#ffffff' : '#0a0a0a'}
                        >
                          {item.topic}
                        </Text>
                        <Text 
                          fontSize={13} 
                          color="#ef4444" 
                          fontFamily="Nunito_700Bold"
                        >
                          {item.accuracy}% Accuracy • {item.questions} Questions
                        </Text>
                      </YStack>
                      <View
                        style={{
                          backgroundColor: '#ef4444',
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 14,
                        }}
                      >
                        <Text 
                          color="white" 
                          fontSize={13} 
                          fontFamily="Nunito_800ExtraBold"
                        >
                          Practice
                        </Text>
                      </View>
                    </XStack>
                  </YStack>
                </Pressable>
              ))}
            </YStack>
          </YStack>

          {/* Streak Calendar */}
          <YStack px="$4" mt="$6" gap="$4">
            <XStack jc="space-between" ai="center">
              <Text 
                fontSize={20} 
                fontFamily="Nunito_900Black" 
                color={isDark ? '#ffffff' : '#0a0a0a'}
                letterSpacing={-0.5}
              >
                Your Streak Journey
              </Text>
              <Text 
                fontSize={14} 
                color={isDark ? '#a3a3a3' : '#737373'} 
                fontFamily="Nunito_700Bold"
              >
                View All
              </Text>
            </XStack>
            <StreakCalendar currentStreak={userStats.streak} />
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

// Enhanced Stat Card with Trend
function EnhancedStatCard({ icon, value, label, color, trend, isDark }: any) {
  return (
    <YStack
      flex={1}
      bg={isDark ? '#0f0f0f' : '#fafafa'}
      p="$4"
      br={20}
      gap="$3"
      borderWidth={1}
      borderColor={isDark ? '#1a1a1a' : '#f0f0f0'}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 12,
        elevation: 6,
        minHeight: 120,
      }}
    >
      <XStack jc="space-between" ai="flex-start">
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: `${color}15`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialCommunityIcons name={icon as any} size={24} color={color} />
        </View>

        <XStack 
          bg={`${color}15`}
          px="$2" 
          py="$1" 
          br={8}
          ai="center"
          gap="$1"
        >
          <MaterialCommunityIcons name="trending-up" size={12} color={color} />
          <Text 
            fontSize={11} 
            fontFamily="Nunito_800ExtraBold" 
            color={color}
          >
            {trend}
          </Text>
        </XStack>
      </XStack>

      <YStack gap="$1">
        <Text 
          fontSize={28} 
          fontFamily="Nunito_900Black" 
          color={isDark ? '#ffffff' : '#0a0a0a'}
        >
          {value}
        </Text>
        <Text 
          fontSize={13} 
          color={isDark ? '#737373' : '#a3a3a3'} 
          fontFamily="Nunito_700Bold"
        >
          {label}
        </Text>
      </YStack>
    </YStack>
  );
}