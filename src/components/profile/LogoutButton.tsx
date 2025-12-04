import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface LogoutButtonProps {
    onLogout: () => void;
    isDark: boolean;
}

export default function LogoutButton({ onLogout, isDark }: LogoutButtonProps) {
    const cardBg = isDark ? '#18181B' : '#FFFFFF';
    const border = isDark ? '#27272A' : '#E4E4E7';
    const dangerBg = isDark ? '#2a1515' : '#fff1f2';
    const dangerBorder = isDark ? '#451a1a' : '#fecdd3';
    const dangerText = isDark ? '#fca5a5' : '#e11d48';

    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onLogout();
    };

    return (
        <YStack px="$4" mt="$6" mb="$8">
            <Animated.View entering={FadeInDown.delay(600).springify()}>
                <Pressable
                    onPress={handlePress}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                >
                    <YStack
                        bg={cardBg}
                        br={16}
                        p="$4"
                        borderWidth={1}
                        borderColor={border}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0.3 : 0.05,
                            shadowRadius: 3,
                            elevation: 2,
                        }}
                    >
                        <XStack ai="center" gap="$3">
                            {/* Icon Container */}
                            <YStack
                                ai="center"
                                jc="center"
                                w={48}
                                h={48}
                                br={14}
                                bg={dangerBg}
                                borderWidth={1}
                                borderColor={dangerBorder}
                            >
                                <MaterialCommunityIcons
                                    name="logout-variant"
                                    size={24}
                                    color={dangerText}
                                />
                            </YStack>

                            {/* Text Content */}
                            <YStack f={1} gap="$0.5">
                                <Text
                                    fontFamily="Nunito_800ExtraBold"
                                    fontSize={16}
                                    color={dangerText}
                                >
                                    Log Out
                                </Text>
                                <Text
                                    fontFamily="Nunito_600SemiBold"
                                    fontSize={13}
                                    color={isDark ? '#a3a3a3' : '#64748b'}
                                >
                                    Sign out of your account
                                </Text>
                            </YStack>

                            {/* Arrow */}
                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={24}
                                color={isDark ? '#52525b' : '#a1a1aa'}
                            />
                        </XStack>
                    </YStack>
                </Pressable>
            </Animated.View>
        </YStack>
    );
}
