import { YStack, Text } from 'tamagui';
import { ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { authAPI } from '@/services/auth.api';
import { useRouter } from 'expo-router';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsGrid from '@/components/profile/StatsGrid';
import SettingsSection from '@/components/profile/SettingsSection';
import LogoutButton from '@/components/profile/LogoutButton';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await authAPI.getCurrentUser();
      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

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
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await authAPI.logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const user = {
    name: userData?.fullName || userData?.username || 'User',
    email: userData?.phone || 'No phone',
    avatar: userData?.avatarUrl || '👤',
    stats: userData?.userStats || {}
  };

  const level = user.stats.level || 0;
  const currentXP = user.stats.totalXp || 0;
  const nextLevelXP = user.stats.xpToNextLevel || 100;
  const xpProgress = ((currentXP % nextLevelXP) / nextLevelXP) * 100;

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
  ];

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
  ];

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
        <ProfileHeader
          name={user.name}
          email={user.email}
          avatar={user.avatar}
          level={level}
          currentXP={currentXP}
          nextLevelXP={nextLevelXP}
          xpProgress={xpProgress}
          isDark={isDark}
        />

        {/* Stats Grid */}
        <StatsGrid
          primaryStats={primaryStats}
          achievementStats={achievementStats}
          loading={loading}
          isDark={isDark}
        />

        {/* Settings Section */}
        <SettingsSection
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          darkModeEnabled={darkModeEnabled}
          setDarkModeEnabled={setDarkModeEnabled}
          isDark={isDark}
        />

        {/* Logout Button */}
        <LogoutButton onLogout={handleLogout} isDark={isDark} />
      </ScrollView>
    </YStack>
  );
}