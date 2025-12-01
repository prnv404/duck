import { YStack, Text, Button, XStack } from 'tamagui';
import { ScrollView, Alert, Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useColorScheme, setColorSchemeOverride } from '@/hooks/use-color-scheme';

import * as Haptics from 'expo-haptics';
import { authAPI } from '@/services/auth.api';
import { userAPI } from '@/services/user.api';
import { gamificationAPI } from '@/services/gamification.api';
import { useRouter } from 'expo-router';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsGrid from '@/components/profile/StatsGrid';
import LogoutButton from '@/components/profile/LogoutButton';
import StreakCalendar from '@/components/StreakCalendar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SettingRow from '@/components/profile/SettingRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);

  const [userData, setUserData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [logoutProcessing, setLogoutProcessing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [user, stats, streak] = await Promise.all([
        authAPI.getCurrentUser(),
        userAPI.getStats(),
        gamificationAPI.getMyStreak()
      ]);

      setUserData(user);
      setUserStats(stats);
      setStreakData(streak);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = () => {
    Haptics.selectionAsync();
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    if (logoutProcessing) return;

    try {
      setLogoutProcessing(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await AsyncStorage.removeItem("@onboarding_completed");
      await authAPI.logout();
      setShowLogoutDialog(false);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLogoutProcessing(false);
    }
  };

  const user = {
    name: userData?.fullName || userData?.username || 'User',
    email: userData?.phone || 'No phone',
    avatar: userData?.avatarUrl || '👤',
  };

  const level = userStats?.level || 1;
  const currentXP = userStats?.totalXp || 0;
  const xpToNextLevel = userStats?.xpToNextLevel || 100;

  // Calculate XP progress percentage for the current level
  const xpProgress = xpToNextLevel > 0 ? Math.min((currentXP / xpToNextLevel) * 100, 100) : 0;

  const primaryStats = [
    {
      label: 'Streak',
      value: userStats?.currentStreak || 0,
      icon: 'flame',
      gradient: ['#ff6b6b', '#ee5a6f'],
      unit: ''
    },
    {
      label: 'Accuracy',
      value: userStats?.overallAccuracy || '0',
      icon: 'analytics',
      gradient: ['#4ecdc4', '#44a08d'],
      unit: '%'
    },
    {
      label: 'Quizzes',
      value: userStats?.totalQuizzesCompleted || 0,
      icon: 'trophy',
      gradient: ['#ffd93d', '#f6c93f'],
      unit: ''
    },
  ];

  const achievementStats = [
    {
      label: 'Questions',
      value: userStats?.totalQuestionsAttempted || 0,
      icon: 'help-circle',
      color: '#60a5fa'
    },
    {
      label: 'Correct',
      value: userStats?.totalCorrectAnswers || 0,
      icon: 'checkmark-circle',
      color: '#34d399'
    },
    {
      label: 'Practice',
      value: `${userStats?.totalPracticeTimeMinutes || 0}m`,
      icon: 'time',
      color: '#f472b6'
    },
  ];

  const calendarData: { [date: string]: number } = {};
  if (streakData?.calendar) {
    streakData.calendar.forEach((day: any) => {
      const dateStr = new Date(day.activityDate).toISOString().split('T')[0];
      const activityLevel = Math.min(day.quizzesCompleted > 0 ? day.quizzesCompleted : (day.questionsAnswered > 0 ? 1 : 0), 5);
      calendarData[dateStr] = activityLevel;
    });
  }

  const handleDarkModeToggle = async (enabled: boolean) => {
    setDarkModeEnabled(enabled);
    setColorSchemeOverride(enabled ? 'dark' : 'light');
    await Haptics.selectionAsync();
  };

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
          nextLevelXP={xpToNextLevel}
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

        {/* Streak Calendar */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <YStack px="$4" mt="$4">
            <Text fontSize={20} fontFamily="Nunito_900Black" mb="$2">Activity</Text>
            <StreakCalendar
              currentStreak={streakData?.currentStreak || 0}
              longestStreak={streakData?.longestStreak || 0}
              streakData={calendarData}
            />
          </YStack>
        </Animated.View>

        {/* Settings Section */}
        <YStack px="$4" mt="$5" gap="$3">
          <Text fontSize={20} fontFamily="Nunito_900Black" mb="$1">Settings</Text>
          <SettingRow
            icon="moon"
            iconColor={isDark ? '#fbbf24' : '#111827'}
            title="Dark Mode"
            subtitle="Override system theme with a darker look"
            hasToggle
            toggleValue={darkModeEnabled}
            onToggle={handleDarkModeToggle}
            isDark={isDark}
          />

          <SettingRow
            icon="shield-checkmark-outline"
            iconColor={isDark ? '#38bdf8' : '#0f766e'}
            title="Privacy Policy"
            subtitle="Learn how we handle your data"
            onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}
            isDark={isDark}
          />

          <SettingRow
            icon="document-text-outline"
            iconColor={isDark ? '#a855f7' : '#7c3aed'}
            title="Terms & Legal"
            subtitle="Read the terms and legal details"
            onPress={() => Linking.openURL('https://your-terms-and-legal-url.com')}
            isDark={isDark}
          />
        </YStack>

        {/* Logout Button */}
        <LogoutButton onLogout={handleLogoutPress} isDark={isDark} />
      </ScrollView>

      <LogoutDialog
        visible={showLogoutDialog}
        isDark={isDark}
        loading={logoutProcessing}
        onCancel={() => {
          if (!logoutProcessing) {
            setShowLogoutDialog(false);
          }
        }}
        onConfirm={handleLogoutConfirm}
      />
    </YStack>
  );
}

interface LogoutDialogProps {
  visible: boolean;
  isDark: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ visible, isDark, loading, onCancel, onConfirm }) => {
  const accent = '#ef4444';
  const accentBg = isDark ? 'rgba(248,113,113,0.18)' : 'rgba(248,113,113,0.14)';
  const bg = isDark ? '#020617' : '#ffffff';
  const subText = isDark ? '#94a3b8' : '#475569';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} disabled={loading} />

        <Animated.View entering={FadeInDown.springify()} exiting={FadeInDown}>
          <YStack
            width={320}
            bg={bg}
            borderRadius={28}
            padding="$5"
            gap="$4"
            shadowColor="rgba(15,23,42,0.4)"
            shadowOffset={{ width: 0, height: 16 }}
            shadowOpacity={0.5}
            shadowRadius={30}
            elevation={22}
          >
            <YStack ai="center" gap="$3">
              <YStack
                width={68}
                height={68}
                borderRadius={20}
                backgroundColor={accentBg}
                alignItems="center"
                justifyContent="center"
              >
                <MaterialCommunityIcons name="logout-variant" size={30} color={accent} />
              </YStack>

              <YStack gap="$2" ai="center">
                <Text fontSize={22} fontFamily="Nunito_900Black" color={isDark ? '#f8fafc' : '#0f172a'}>
                  Sign out of Duck?
                </Text>
                <Text fontSize={15} fontFamily="Nunito_600SemiBold" color={subText} textAlign="center">
                  We'll keep your streak and XP safe. You can log back in anytime.
                </Text>
              </YStack>
            </YStack>

            <XStack gap="$3">
              <Button
                flex={1}
                height={48}
                borderRadius={18}
                borderWidth={1}
                borderColor={isDark ? '#1e293b' : '#e2e8f0'}
                backgroundColor={isDark ? '#0b1120' : '#ffffff'}
                color={isDark ? '#e2e8f0' : '#0f172a'}
                fontFamily="Nunito_800ExtraBold"
                onPress={onCancel}
                disabled={loading}
                opacity={loading ? 0.6 : 1}
              >
                Stay logged in
              </Button>

              <Button
                flex={1}
                height={48}
                borderRadius={18}
                backgroundColor={accent}
                color="#f8feff"
                fontFamily="Nunito_900Black"
                onPress={onConfirm}
                disabled={loading}
                opacity={loading ? 0.6 : 1}
              >
                {loading ? 'Signing out...' : 'Logout'}
              </Button>
            </XStack>
          </YStack>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});