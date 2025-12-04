import StreakCalendar from '@/components/StreakCalendar';
import QuizModeSelector from '@/components/home/QuizModeSelector';
import FocusAreas from '@/components/home/FocusAreas';
import HomeHeader from '@/components/home/HomeHeader';
import HomeLoadingSkeleton from '@/components/home/HomeLoadingSkeleton';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { YStack } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [streakStats, setStreakStats] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('balanced');

  // Load saved practice mode preference
  useEffect(() => {
    const loadModePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('practiceMode');
        if (savedMode !== null) {
          setSelectedMode(savedMode);
        }
      } catch (error) {
        console.error('Error loading practice mode preference:', error);
      }
    };
    loadModePreference();
  }, []);

  // Save practice mode when it changes
  useEffect(() => {
    const saveModePreference = async () => {
      try {
        await AsyncStorage.setItem('practiceMode', selectedMode);
      } catch (error) {
        console.error('Error saving practice mode preference:', error);
      }
    };
    saveModePreference();
  }, [selectedMode]);

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
      const [user, stats, accuracy, streakResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        userAPI.getStats(),
        curriculumAPI.getMySubjectAccuracy(),
        gamificationAPI.getMyStreak()
      ]);

      setUserData(user);
      setUserStats(stats);
      setSubjectAccuracy(accuracy);

      // Transform streak calendar data to match component format
      const transformedStreakData: { [date: string]: number } = {};
      if (streakResponse?.calendar) {
        streakResponse.calendar.forEach((entry) => {
          // Extract date in YYYY-MM-DD format
          const dateStr = entry.activityDate.split('T')[0];
          // Use questionsAnswered as activity count (you can adjust this logic)
          transformedStreakData[dateStr] = entry.questionsAnswered;
        });
      }

      setStreakData(transformedStreakData);
      setStreakStats({
        currentStreak: streakResponse?.currentStreak || 0,
        longestStreak: streakResponse?.longestStreak || 0,
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayStats = {
    streak: streakStats.currentStreak || userStats?.currentStreak || 0,
    xp: userStats?.totalXp || 0,
    energy: userStats?.energy || 0,
    level: userStats?.level || 1,
    xpToNextLevel: userStats?.xpToNextLevel || 100,
  };

  const handleShowModeExplanation = async (mode: 'adaptive' | 'balanced' | 'weak_area' | 'hard_core' | 'subject_focus') => {
    await Haptics.selectionAsync();
    router.push(`/quiz/mode-explain?mode=${mode}` as any);
  };

  const handleStartQuiz = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/quiz?mode=${selectedMode}` as any);
  };

  if (loading) {
    return (
      <YStack f={1} bg={isDark ? '#0d0b0bff' : '#fafef9ff'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 120,
            paddingHorizontal: 16,
          }}
        >
          <HomeLoadingSkeleton isDark={isDark} />
        </ScrollView>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg={isDark ? '#0d0b0bff' : '#fafef9ff'}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 16,
        }}
      >
        <YStack gap="$5">
          {/* Header */}
          <HomeHeader
            userName={userData?.name || 'User'}
            userImage={userData?.image}
            level={displayStats.level}
            xp={displayStats.xp}
            isDark={isDark}
          />

          {/* Streak Calendar */}
          <StreakCalendar
            streakData={streakData}
            currentStreak={streakStats.currentStreak}
            longestStreak={streakStats.longestStreak}
          />

          {/* Quiz Mode Selector */}
          <QuizModeSelector
            selectedMode={selectedMode as any}
            onModeSelect={setSelectedMode}
            onStartQuiz={handleStartQuiz}
            isDark={isDark}
            onShowModeExplanation={handleShowModeExplanation}
          />

          {/* Focus Areas */}
          <FocusAreas
            currentStreak={displayStats.streak}
            isDark={isDark}
            subjectData={subjectAccuracy}
            streakData={streakData}
            onSubjectSelect={(subject) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.push(`/quiz/mode-explain?mode=subject_focus&subjectId=${subject.subjectId}&subjectName=${encodeURIComponent(subject.subjectName)}` as any);
            }}
          />

        </YStack>
      </ScrollView>
    </YStack>
  );
}