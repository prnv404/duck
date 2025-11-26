import { useColorScheme } from '@/hooks/use-color-scheme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, XStack, YStack } from 'tamagui'

type GamificationHeaderProps = {
    streak: number
    xp: number
    name: string
}

export default function GamificationHeader({ streak, xp, name }: GamificationHeaderProps) {
    const isDark = useColorScheme() === 'dark'

    return (
        <XStack
            pt="$4"
            pb="$2"
            px="$4"
            jc="space-between"
            ai="center"
            bg="transparent"
        >
            {/* Welcome Message */}
            <YStack>
                <Text fontSize={12} fontFamily="Nunito_700Bold" color={isDark ? '#94a3b8' : '#64748b'}>
                    WELCOME BACK
                </Text>
                <Text fontSize={22} fontFamily="Nunito_900Black" color={isDark ? '#fff' : '#1e293b'}>
                    {name}
                </Text>
            </YStack>

            {/* Stats Grouped Right */}
            <XStack gap="$3">
                {/* Streak */}
                <XStack ai="center" gap="$1" bg={isDark ? '#1f2937' : '#f1f5f9'} px="$2.5" py="$1.5" br={12}>
                    <MaterialCommunityIcons name="fire" size={18} color="#f97316" />
                    <Text fontSize={14} fontFamily="Nunito_800ExtraBold" color={isDark ? '#f97316' : '#ea580c'}>
                        {streak}
                    </Text>
                </XStack>

                {/* XP */}
                <XStack ai="center" gap="$1" bg={isDark ? '#1f2937' : '#f1f5f9'} px="$2.5" py="$1.5" br={12}>
                    <MaterialCommunityIcons name="star-four-points" size={18} color="#eab308" />
                    <Text fontSize={14} fontFamily="Nunito_800ExtraBold" color={isDark ? '#facc15' : '#ca8a04'}>
                        {xp}
                    </Text>
                </XStack>
            </XStack>
        </XStack>
    )
}
