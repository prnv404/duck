import { Image, Text, XStack, YStack, Circle } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    isDark,
}: ProfileHeaderProps) {
    const textMain = isDark ? '#ffffff' : '#0f172a';
    const textSub = isDark ? '#a3a3a3' : '#020406ff';
    const cardBg = isDark ? '#19191bff' : '#FFFFFF';
    const border = isDark ? '#3f3f3fff' : '#e4e4eaff';
    const innerBg = isDark ? '#292828ff' : '#F4F4F5';

    return (
        <Animated.View entering={FadeInDown.delay(100).springify()}>
            <YStack
                mx="$4"
                mb="$4"
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
                {/* Top Row - Avatar & Info */}
                <XStack ai="center" gap="$3" mb="$4">
                    {/* Avatar with Level */}
                    <YStack>
                        {avatar && avatar.startsWith('http') ? (
                            <YStack
                                w={68}
                                h={68}
                                br={34}
                                style={{
                                    borderWidth: 3,
                                    borderColor: '#10b981',
                                    overflow: 'hidden',
                                }}
                            >
                                <Image
                                    source={{ uri: avatar }}
                                    width={68}
                                    height={68}
                                    style={{ width: 68, height: 68 }}
                                />
                            </YStack>
                        ) : (
                            <Circle size={68} bg="#10b981" style={{ borderWidth: 3, borderColor: '#10b981' }}>
                                <Text fontSize={30} fontFamily="Nunito_900Black" color="white">
                                    {name.charAt(0).toUpperCase()}
                                </Text>
                            </Circle>
                        )}
                        <YStack
                            position="absolute"
                            bottom={-4}
                            right={-4}
                            bg="#8B5CF6"
                            w={28}
                            h={28}
                            br={14}
                            ai="center"
                            jc="center"
                            borderWidth={2}
                            borderColor={cardBg}
                        >
                            <Text fontSize={11} fontFamily="Nunito_900Black" color="white">
                                {level}
                            </Text>
                        </YStack>
                    </YStack>

                    {/* Name & Email */}
                    <YStack f={1}>
                        <Text fontSize={20} fontFamily="Nunito_900Black" color={textMain} numberOfLines={1}>
                            {name}
                        </Text>
                        <Text fontSize={13} fontFamily="Nunito_600SemiBold" color={textSub} numberOfLines={1}>
                            {email}
                        </Text>
                    </YStack>
                </XStack>

                {/* Metrics Row */}
                <XStack bg={innerBg} br={12} p="$3" jc="space-between" mb="$3">
                    {/* XP */}
                    <YStack ai="center" f={1}>
                        <XStack ai="center" gap="$1">
                            <MaterialCommunityIcons name="lightning-bolt" size={16} color="#F59E0B" />
                            <Text fontSize={16} fontFamily="Nunito_900Black" color={textMain}>
                                {currentXP >= 1000 ? `${(currentXP / 1000).toFixed(1)}k` : currentXP}
                            </Text>
                        </XStack>
                        <Text fontSize={10} fontFamily="Nunito_600SemiBold" color={textSub} mt="$0.5">
                            XP
                        </Text>
                    </YStack>

                    <YStack w={1} bg={border} />

                    {/* Level */}
                    <YStack ai="center" f={1}>
                        <XStack ai="center" gap="$1">
                            <MaterialCommunityIcons name="star" size={16} color="#8B5CF6" />
                            <Text fontSize={16} fontFamily="Nunito_900Black" color={textMain}>
                                {level}
                            </Text>
                        </XStack>
                        <Text fontSize={10} fontFamily="Nunito_600SemiBold" color={textSub} mt="$0.5">
                            Level
                        </Text>
                    </YStack>

                    <YStack w={1} bg={border} />

                    {/* Progress */}
                    <YStack ai="center" f={1}>
                        <XStack ai="center" gap="$1">
                            <MaterialCommunityIcons name="trending-up" size={16} color="#10b981" />
                            <Text fontSize={16} fontFamily="Nunito_900Black" color={textMain}>
                                {Math.round(xpProgress)}%
                            </Text>
                        </XStack>
                        <Text fontSize={10} fontFamily="Nunito_600SemiBold" color={textSub} mt="$0.5">
                            Progress
                        </Text>
                    </YStack>
                </XStack>

                {/* XP Progress Bar */}
                <YStack gap="$2">
                    <XStack jc="space-between" ai="center">
                        <Text fontSize={11} fontFamily="Nunito_600SemiBold" color={textSub}>
                            Level {level} → {level + 1}
                        </Text>
                        <Text fontSize={11} fontFamily="Nunito_700Bold" color="#10b981">
                            {nextLevelXP} XP needed
                        </Text>
                    </XStack>
                    <YStack
                        h={10}
                        bg={innerBg}
                        br={5}
                        overflow="hidden"
                        borderWidth={1}
                        borderColor={border}
                    >
                        <YStack
                            h="100%"
                            w={`${Math.min(xpProgress, 100)}%`}
                            style={{
                                backgroundColor: '#10b981',
                                borderRadius: 5,
                            }}
                        />
                    </YStack>
                </YStack>
            </YStack>
        </Animated.View>
    );
}
