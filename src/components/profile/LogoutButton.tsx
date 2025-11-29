import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface LogoutButtonProps {
    onLogout: () => void;
    isDark: boolean;
}

export default function LogoutButton({ onLogout, isDark }: LogoutButtonProps) {
    return (
        <YStack px="$4" mt="$4">
            <Animated.View entering={FadeInDown.delay(550)}>
                <Pressable onPress={onLogout}>
                    <YStack
                        br={20}
                        py="$4"
                        px="$4"
                        ai="center"
                        bg={isDark ? '#111827' : '#f9fafb'}
                        borderWidth={1}
                        borderColor={isDark ? '#1f2937' : '#e5e7eb'}
                    >
                        <XStack ai="center" gap="$3">
                            <YStack
                                w={48}
                                h={48}
                                br={14}
                                ai="center"
                                jc="center"
                                bg={isDark ? '#3f3f4680' : '#fee2e2'}
                            >
                                <Ionicons name="log-out-outline" size={24} color={isDark ? '#fca5a5' : '#ef4444'} />
                            </YStack>
                            <YStack f={1}>
                                <Text fontSize={18} fontWeight="900" color={isDark ? '#fca5a5' : '#b91c1c'}>
                                    Logout
                                </Text>
                                <Text fontSize={13} fontWeight="600" color={isDark ? '#9ca3af' : '#6b7280'}>
                                    Sign out of this device
                                </Text>
                            </YStack>
                            <Ionicons name="chevron-forward" size={22} color={isDark ? '#6b7280' : '#9ca3af'} />
                        </XStack>
                    </YStack>
                </Pressable>
            </Animated.View>
        </YStack>
    );
}
