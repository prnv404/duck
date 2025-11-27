import { useColorScheme } from '@/hooks/use-color-scheme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, XStack, YStack } from 'tamagui'
import { Pressable } from 'react-native'
import * as Haptics from 'expo-haptics'

type GamificationHeaderProps = {
    streak: number
    xp: number
    energy?: number | 'unlimited'
    currentCourse?: { name: string; icon: string; color: string; progress?: number }
    onCoursePress?: () => void
}

export default function GamificationHeader({ streak, xp, energy = 'unlimited', currentCourse, onCoursePress }: GamificationHeaderProps) {
    const isDark = useColorScheme() === 'dark'

    return (
        <YStack gap="$4" pt="$2">
            {/* Stats Row - Clean & Minimal */}
            <XStack jc="space-between" ai="center">
                {/* Course Selector */}
                {currentCourse && (
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                            onCoursePress?.()
                        }}
                    >
                        <XStack
                            ai="center"
                            gap="$2"
                            px="$3"
                            py="$2"
                            br={10}
                            bg={isDark ? '#ffffff08' : '#00000005'}
                        >
                            <Text fontSize={20}>{currentCourse.icon}</Text>
                            <Text fontSize={15} fontFamily="Nunito_700Bold" color={isDark ? '#ffffff' : '#000000'}>
                                {currentCourse.name}
                            </Text>
                            <MaterialCommunityIcons
                                name="chevron-down"
                                size={16}
                                color={isDark ? '#ffffff80' : '#00000060'}
                            />
                        </XStack>
                    </Pressable>
                )}

                {/* Stats Group */}
                <XStack gap="$4" ai="center">
                    {/* Streak */}
                    <XStack ai="center" gap="$1.5">
                        <MaterialCommunityIcons name="fire" size={22} color="#ff6b35" />
                        <Text fontSize={17} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#000000'}>
                            {streak}
                        </Text>
                    </XStack>

                    {/* XP */}
                    <XStack ai="center" gap="$1.5">
                        <MaterialCommunityIcons name="diamond-stone" size={22} color="#1cb0f6" />
                        <Text fontSize={17} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#000000'}>
                            {xp}
                        </Text>
                    </XStack>

                    {/* Energy */}
                    <XStack ai="center" gap="$1.5">
                        <MaterialCommunityIcons name="lightning-bolt" size={22} color="#a855f7" />
                        <Text fontSize={17} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#000000'}>
                            {energy === 'unlimited' ? '∞' : energy}
                        </Text>
                    </XStack>
                </XStack>
            </XStack>

            {/* Divider */}
            <YStack
                h={1}
                bg={isDark ? '#ffffff10' : '#00000010'}
            />
        </YStack>
    )
}