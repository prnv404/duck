import { useColorScheme } from '@/hooks/use-color-scheme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, XStack, YStack } from 'tamagui'
import * as Haptics from 'expo-haptics'

type GamificationHeaderProps = {
    streak: number
    xp: number
    energy?: number | 'unlimited'
    userName?: string
}

export default function GamificationHeader({ streak, xp, energy = 'unlimited', userName }: GamificationHeaderProps) {
    const isDark = useColorScheme() === 'dark'

    return (
        <YStack gap="$4" pt="$2">
            {/* Header Row */}
            <XStack jc="space-between" ai="center">
                {/* Welcome Text */}
                <YStack>
                    <Text
                        fontSize={16}
                        fontFamily="Nunito_900Black"
                        color={isDark ? '#ffffff' : '#0f172a'}
                    >
                        Welcome back
                    </Text>
                    <Text
                        mt="$1"
                        fontSize={14}
                        fontFamily="Nunito_600SemiBold"
                        color={isDark ? '#9ca3af' : '#6b7280'}
                    >
                        {userName || 'Learner'}
                    </Text>
                </YStack>

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
                        <MaterialCommunityIcons name="star-circle" size={22} color="#facc15" />
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