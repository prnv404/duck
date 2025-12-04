import { YStack, Text, Button, XStack } from 'tamagui';
import { ScrollView, Alert, Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useColorScheme, setColorSchemeOverride } from '@/hooks/use-color-scheme';

import * as Haptics from 'expo-haptics';
import { authAPI } from '@/services/auth.api';
import { userAPI } from '@/services/user.api';
import { gamificationAPI } from '@/services/gamification.api';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsGrid from '@/components/profile/StatsGrid';
import LogoutButton from '@/components/profile/LogoutButton';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SettingRow from '@/components/profile/SettingRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Storage key prefix used by Better Auth expo client
const BETTER_AUTH_STORAGE_PREFIX = 'duck-auth';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const { signOutUser } = useAuth();
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);

  const [userData, setUserData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [logoutProcessing, setLogoutProcessing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [user, stats] = await Promise.all([
        authAPI.getCurrentUser(),
        userAPI.getStats()
      ]);

      setUserData(user);
      setUserStats(stats);
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

  /**
   * Clear all local storage data related to authentication and app state
   * This includes Better Auth session data, legacy auth data, and onboarding state
   */
  const clearAllLocalData = async () => {
    try {
      // Clear Better Auth session data from SecureStore
      const betterAuthKeys = [
        `${BETTER_AUTH_STORAGE_PREFIX}.session`,
        `${BETTER_AUTH_STORAGE_PREFIX}.session_token`,
      ];

      await Promise.all(
        betterAuthKeys.map(key =>
          SecureStore.deleteItemAsync(key).catch(() => {
            // Ignore errors if key doesn't exist
          })
        )
      );

      // Clear legacy auth data and app state from AsyncStorage
      await AsyncStorage.multiRemove([
        '@onboarding_completed',
        'access_token',
        'refresh_token',
        'user',
      ]);
    } catch (error) {
      console.error('Error clearing local data:', error);
      // Continue with logout even if clearing fails
    }
  };

  const handleLogoutConfirm = async () => {
    if (logoutProcessing) return;

    setLogoutProcessing(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    try {
      // Call Better Auth signOut to invalidate session on server
      await signOutUser();
    } catch (error) {
      // Log the error but continue with local cleanup
      // Requirements 6.4: Clear local session even if server call fails
      console.error('Server logout failed:', error);
    }

    // Always clear local data and navigate to login, regardless of server response
    // Requirements 6.2, 6.3: Clear stored session data and navigate to login
    await clearAllLocalData();
    setShowLogoutDialog(false);
    setLogoutProcessing(false);
    router.replace('/login');
  };

  const user = {
    name: userData?.name || 'User',
    email: userData?.email || '',
    avatar: userData?.image || '👤',
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
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/legal/privacy');
            }}
            isDark={isDark}
          />

          <SettingRow
            icon="document-text-outline"
            iconColor={isDark ? '#a855f7' : '#7c3aed'}
            title="Terms & Legal"
            subtitle="Read the terms and legal details"
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/legal/terms');
            }}
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
  const accentBg = isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.12)';
  const bg = isDark ? '#000000' : '#ffffff';
  const subText = isDark ? '#999999' : '#666666';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} disabled={loading} />

        <Animated.View entering={FadeInDown.springify()} exiting={FadeInDown}>
          <YStack
            width={320}
            bg={bg}
            borderRadius={24}
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
                width={64}
                height={64}
                borderRadius={18}
                backgroundColor={accentBg}
                alignItems="center"
                justifyContent="center"
              >
                <MaterialCommunityIcons name="logout-variant" size={28} color={accent} />
              </YStack>

              <YStack gap="$2" ai="center">
                <Text fontSize={20} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#000000'}>
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
                borderRadius={24}
                backgroundColor={isDark ? '#1a1a1a' : '#f0f0f0'}
                color={isDark ? '#ffffff' : '#000000'}
                fontFamily="Nunito_800ExtraBold"
                onPress={onCancel}
                disabled={loading}
                opacity={loading ? 0.6 : 1}
                pressStyle={{ scale: 0.98, opacity: 0.9 }}
              >
                Cancel
              </Button>

              <Button
                flex={1}
                height={48}
                borderRadius={24}
                backgroundColor={accent}
                color="#ffffff"
                fontFamily="Nunito_900Black"
                onPress={onConfirm}
                disabled={loading}
                opacity={loading ? 0.6 : 1}
                pressStyle={{ scale: 0.98, opacity: 0.9 }}
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