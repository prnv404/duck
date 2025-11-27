import * as Haptics from 'expo-haptics';
import { Separator, Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SettingRow from './SettingRow';

interface SettingsSectionProps {
    notificationsEnabled: boolean;
    setNotificationsEnabled: (value: boolean) => void;
    soundEnabled: boolean;
    setSoundEnabled: (value: boolean) => void;
    darkModeEnabled: boolean;
    setDarkModeEnabled: (value: boolean) => void;
    isDark: boolean;
}

export default function SettingsSection({
    notificationsEnabled,
    setNotificationsEnabled,
    soundEnabled,
    setSoundEnabled,
    darkModeEnabled,
    setDarkModeEnabled,
    isDark
}: SettingsSectionProps) {
    return (
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
                        isDark={isDark}
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
                        isDark={isDark}
                    />
                    <Separator bg="$gray4" />

                    <SettingRow
                        icon="moon"
                        iconColor="#8b5cf6"
                        title="Dark Mode"
                        hasToggle
                        toggleValue={darkModeEnabled}
                        onToggle={setDarkModeEnabled}
                        isDark={isDark}
                    />
                    <Separator bg="$gray4" />

                    <SettingRow
                        icon="person"
                        iconColor="#f59e0b"
                        title="Edit Profile"
                        onPress={() => Haptics.selectionAsync()}
                        isDark={isDark}
                    />
                    <Separator bg="$gray4" />

                    <SettingRow
                        icon="shield-checkmark"
                        iconColor="#06b6d4"
                        title="Privacy & Security"
                        onPress={() => Haptics.selectionAsync()}
                        isDark={isDark}
                    />
                    <Separator bg="$gray4" />

                    <SettingRow
                        icon="help-circle"
                        iconColor="#ec4899"
                        title="Help & Support"
                        onPress={() => Haptics.selectionAsync()}
                        isDark={isDark}
                    />
                    <Separator bg="$gray4" />

                    <SettingRow
                        icon="information-circle"
                        iconColor="#6b7280"
                        title="About"
                        subtitle="Version 1.0.0"
                        onPress={() => Haptics.selectionAsync()}
                        isDark={isDark}
                    />
                </YStack>
            </Animated.View>
        </YStack>
    );
}
