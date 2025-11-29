import GamificationHeader from '@/components/GamificationHeader';
import LevelProgressCard from '@/components/home/LevelProgressCard';
import QuizModeSelector from '@/components/home/QuizModeSelector';
import FocusAreas from '@/components/home/FocusAreas';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { YStack, XStack } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { authAPI } from '@/services/auth.api';
import { curriculumAPI } from '@/services/curriculum.api';
import { gamificationAPI } from '@/services/gamification.api';
import { userAPI } from '@/services/user.api';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [userData, setUserData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [subjectAccuracy, setSubjectAccuracy] = useState<any[]>([]);
  const [streakData, setStreakData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('balanced');

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [user, stats, accuracy, streak] = await Promise.all([
        authAPI.getCurrentUser(),
        userAPI.getStats(),
        curriculumAPI.getMySubjectAccuracy(),
        gamificationAPI.getMyStreak()
      ]);

      setUserData(user);
      setUserStats(stats);
      setSubjectAccuracy(accuracy);
      setStreakData(streak);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayStats = {
    streak: userStats?.currentStreak || 0,
    xp: userStats?.totalXp || 0,
    energy: userStats?.energy || 0,
    level: userStats?.level || 1,
    xpToNextLevel: userStats?.xpToNextLevel || 100,
  };

  const currentLevelXp = displayStats.xp; // Simplified for now
  const nextLevelXp = displayStats.xp + displayStats.xpToNextLevel;
  const xpProgress = nextLevelXp > 0 ? Math.round((currentLevelXp / nextLevelXp) * 100) : 0;

  const handleStartQuiz = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/quiz?mode=${selectedMode}` as any);
  };

  if (loading) {
    return (
      <YStack f={1} bg={isDark ? '#100f0fff' : '#ffffff'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 120,
            paddingHorizontal: 16,
          }}
        >
          <YStack gap="$5">
            {/* Minimal Header */}
            <Animated.View entering={FadeInDown.delay(100)}>
              <GamificationHeader
                streak={displayStats.streak}
                xp={displayStats.xp}
                energy={displayStats.energy}
                userName={userData?.fullName || userData?.username || 'Learner'}
              />
            </Animated.View>

            {/* Level Progress Card */}
            <LevelProgressCard
              level={displayStats.level}
              xp={displayStats.xp}
              xpToNextLevel={displayStats.xpToNextLevel}
              xpProgress={xpProgress}
              isDark={isDark}
            />

            {/* Quiz Mode Selector - 2x2 Grid */}
            <QuizModeSelector
              selectedMode={selectedMode as any}
              onModeSelect={setSelectedMode}
              onStartQuiz={handleStartQuiz}
              isDark={isDark}
            />

            {/* Focus Areas */}
            <FocusAreas
              currentStreak={displayStats.streak}
              isDark={isDark}
              subjectData={subjectAccuracy}
              streakData={streakData}
              onSubjectSelect={(subject) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.push(`/quiz?mode=subject_focus&subjectId=${subject.subjectId}` as any);
              }}
            />

          </YStack>
        </ScrollView>

      </YStack>

    );
  }

  return (
    <YStack f={1} bg={isDark ? '#090808ff' : '#fafef9ff'}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 16,
        }}
      >
        <YStack gap="$5">
          {/* Minimal Header */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <GamificationHeader
              streak={displayStats.streak}
              xp={displayStats.xp}
              energy={displayStats.energy}
              userName={userData?.fullName || userData?.username || 'Learner'}
            />
          </Animated.View>

          {/* Level Progress Card */}
          <LevelProgressCard
            level={displayStats.level}
            xp={displayStats.xp}
            xpToNextLevel={displayStats.xpToNextLevel}
            xpProgress={xpProgress}
            isDark={isDark}
          />

          {/* Quiz Mode Selector - 2x2 Grid */}
          <QuizModeSelector
            selectedMode={selectedMode as any}
            onModeSelect={setSelectedMode}
            onStartQuiz={handleStartQuiz}
            isDark={isDark}
          />

          {/* Focus Areas */}
          <FocusAreas
            currentStreak={displayStats.streak}
            isDark={isDark}
            subjectData={subjectAccuracy}
            streakData={streakData}
            onSubjectSelect={(subject) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.push(`/quiz?mode=subject_focus&subjectId=${subject.subjectId}` as any);
            }}
          />

        </YStack>
      </ScrollView>

    </YStack>

  );
}