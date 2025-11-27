import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface LogoutButtonProps {
    onLogout: () => void;
    isDark: boolean;
}

export default function LogoutButton({ onLogout, isDark }: LogoutButtonProps) {
    return (
        <YStack px="$4">
            <Animated.View entering={FadeInDown.delay(550)}>
                <Pressable onPress={onLogout}>
                    <YStack
                        br={20}
                        py="$4"
                        px="$4"
                        ai="center"
                        overflow="hidden"
                        style={{
                            borderWidth: 2,
                            borderColor: '#ef4444',
                            shadowColor: '#ef4444',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                        }}
                    >
                        <LinearGradient
                            colors={isDark ? ['#1a1a1a', '#262626'] : ['#fef2f2', '#fee2e2']}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0
                            }}
                        />
                        <XStack ai="center" gap="$3" zIndex={1}>
                            <YStack
                                w={48}
                                h={48}
                                br={14}
                                ai="center"
                                jc="center"
                                bg="#ef444420"
                            >
                                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                            </YStack>
                            <YStack f={1}>
                                <Text fontSize={18} fontWeight="900" color="#ef4444">
                                    Logout
                                </Text>
                                <Text fontSize={13} fontWeight="600" color={isDark ? '#737373' : '#a3a3a3'}>
                                    Sign out of your account
                                </Text>
                            </YStack>
                            <Ionicons name="chevron-forward" size={22} color="#ef4444" />
                        </XStack>
                    </YStack>
                </Pressable>
            </Animated.View>
        </YStack>
    );
}
