import GamificationHeader from '@/components/GamificationHeader';
import CourseSelectorModal from '@/components/home/CourseSelectorModal';
import LevelProgressCard from '@/components/home/LevelProgressCard';
import QuizModeSelector from '@/components/home/QuizModeSelector';
import ProgressStats from '@/components/home/ProgressStats';
import FocusAreas from '@/components/home/FocusAreas';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { authAPI } from '@/services/auth.api';
import Skeleton from '@/components/ui/Skeleton';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('balanced');
  const [selectedCourse, setSelectedCourse] = useState('state-psc');
  const [courseModalVisible, setCourseModalVisible] = useState(false);

  // Sample course data - only 3 courses
  const courses = [
    { id: 'state-psc', name: 'State PSC', icon: '🏛️', progress: 0, color: '#ef4444' },
    { id: 'railway', name: 'Railway', icon: '🚂', progress: 32, color: '#f59e0b' },
    { id: 'ssc', name: 'SSC', icon: '📚', progress: 45, color: '#8b5cf6' },
  ];

  const currentCourse = courses.find(c => c.id === selectedCourse);

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
          <YStack gap="$6">
            <Skeleton height={120} borderRadius={16} />
            <Skeleton height={280} borderRadius={16} />
            <XStack gap="$3">
              <Skeleton width="48%" height={140} borderRadius={12} />
              <Skeleton width="48%" height={140} borderRadius={12} />
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg={isDark ? '#1a1717ff' : '#fafef9ff'}>
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
              {...userStats}
              energy="unlimited"
              currentCourse={currentCourse}
              onCoursePress={() => setCourseModalVisible(true)}
            />
          </Animated.View>

          {/* Level Progress Card */}
          <LevelProgressCard
            level={userStats.level}
            xp={userStats.xp}
            xpToNextLevel={userStats.xpToNextLevel}
            xpProgress={xpProgress}
            isDark={isDark}
          />

          {/* Quiz Mode Selector - 2x2 Grid */}
          <QuizModeSelector
            selectedMode={selectedMode}
            onModeSelect={setSelectedMode}
            onStartQuiz={handleStartQuiz}
            isDark={isDark}
          />

          {/* Progress Stats */}
          <ProgressStats
            streak={userStats.streak}
            accuracy={userStats.accuracy}
            quizzesCompleted={userStats.quizzesCompleted}
            isDark={isDark}
          />

          {/* Focus Areas */}
          <FocusAreas currentStreak={userStats.streak} isDark={isDark} />
        </YStack>
      </ScrollView>

      {/* Course Selector Modal */}
      <CourseSelectorModal
        visible={courseModalVisible}
        courses={courses}
        selectedCourseId={selectedCourse}
        onCourseSelect={setSelectedCourse}
        onClose={() => setCourseModalVisible(false)}
        isDark={isDark}
      />
    </YStack>
  );
}