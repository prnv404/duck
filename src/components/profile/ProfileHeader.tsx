import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, XStack, YStack } from 'tamagui';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { View } from 'react-native';

interface ProfileHeaderProps {
    name: string;
    email: string;
    avatar: string;
    level: number;
    currentXP: number;
    nextLevelXP: number;
    xpProgress: number;
    isDark: boolean;
}

export default function ProfileHeader({
    name,
    email,
    avatar,
    level,
    currentXP,
    nextLevelXP,
    xpProgress,
    isDark
}: ProfileHeaderProps) {
    return (
        <Animated.View entering={FadeInDown.delay(100)}>
            <YStack mx="$4" mb="$4">
                <YStack
                    br={24}
                    overflow="hidden"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: isDark ? 0.4 : 0.15,
                        shadowRadius: 16,
                    }}
                >
                    <LinearGradient
                        colors={isDark ? ['#18181b', '#27272a'] : ['#ffffff', '#fafafa']}
                        style={{ padding: 20 }}
                    >
                        <XStack ai="center" gap="$4" mb="$4">
                            <YStack position="relative">
                                <YStack
                                    w={90}
                                    h={90}
                                    br={45}
                                    overflow="hidden"
                                    style={{
                                        borderWidth: 4,
                                        borderColor: isDark ? '#8b5cf6' : '#a78bfa',
                                    }}
                                >
                                    {avatar && avatar.startsWith('http') ? (
                                        <Image
                                            source={{ uri: avatar, width: 90, height: 90 }}
                                            width="100%"
                                            height="100%"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <LinearGradient
                                            colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Text fontSize={44}>{avatar}</Text>
                                        </LinearGradient>
                                    )}
                                </YStack>
                                {/* Level Badge */}
                                <YStack
                                    position="absolute"
                                    bottom={-4}
                                    right={-4}
                                    w={36}
                                    h={36}
                                    br={18}
                                    ai="center"
                                    jc="center"
                                    style={{
                                        borderWidth: 3,
                                        borderColor: isDark ? '#18181b' : '#ffffff',
                                    }}
                                >
                                    <LinearGradient
                                        colors={['#fbbf24', '#f59e0b', '#d97706']}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 18
                                        }}
                                    >
                                        <Text fontSize={14} fontWeight="900" color="#fff">
                                            {level}
                                        </Text>
                                    </LinearGradient>
                                </YStack>
                            </YStack>

                            <YStack f={1}>
                                <Text fontSize={24} fontWeight="900">
                                    {name}
                                </Text>
                                <Text fontSize={14} color="$gray10" mb="$2">
                                    {email}
                                </Text>
                                <XStack ai="center" gap="$2">
                                    <YStack
                                        px="$2"
                                        py="$1"
                                        br={8}
                                        bg={isDark ? '#8b5cf620' : '#f3e8ff'}
                                    >
                                        <Text fontSize={11} fontWeight="700" color="#8b5cf6">
                                            Level {level}
                                        </Text>
                                    </YStack>
                                </XStack>
                            </YStack>
                        </XStack>

                        {/* XP Progress */}
                        <YStack gap="$2">
                            <XStack jc="space-between" ai="center">
                                <Text fontSize={12} fontWeight="700" color="$gray11">
                                    {currentXP % nextLevelXP} / {nextLevelXP} XP
                                </Text>
                                <Text fontSize={12} fontWeight="700" color="#8b5cf6">
                                    {Math.round(xpProgress)}%
                                </Text>
                            </XStack>
                            <YStack
                                h={10}
                                bg={isDark ? '#27272a' : '#f3f4f6'}
                                br={5}
                                overflow="hidden"
                            >
                                <Animated.View
                                    entering={FadeIn.delay(300)}
                                    style={{ width: `${xpProgress}%`, height: '100%' }}
                                >
                                    <LinearGradient
                                        colors={['#8b5cf6', '#7c3aed']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </Animated.View>
                            </YStack>
                        </YStack>
                    </LinearGradient>
                </YStack>
            </YStack>
        </Animated.View>
    );
}
