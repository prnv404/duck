import { useColorScheme } from '@/hooks/use-color-scheme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, XStack, YStack } from 'tamagui'
import * as Haptics from 'expo-haptics'
import React, { useEffect } from 'react'
import Animated, { FadeInDown, Layout, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'

type GamificationHeaderProps = {
    streak: number
    xp: number
    energy?: number | 'unlimited'
    userName?: string
}

export default function GamificationHeader({ streak, xp, energy = 'unlimited', userName }: GamificationHeaderProps) {
    const isDark = useColorScheme() === 'dark'

    // Subtle pulse for XP when header mounts or XP changes
    const xpScale = useSharedValue(1)

    useEffect(() => {
        xpScale.value = withSequence(
            withTiming(1.08, { duration: 180 }),
            withTiming(1, { duration: 160 })
        )
    }, [xp])

    const xpAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: xpScale.value }],
    }))

    return (
        <Animated.View
            entering={FadeInDown.duration(450).springify()}
            layout={Layout.springify()}
        >
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
                    <Animated.View style={xpAnimatedStyle}>
                        <XStack ai="center" gap="$1.5">
                            <MaterialCommunityIcons name="star-circle" size={22} color="#facc15" />
                            <Text fontSize={17} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#000000'}>
                                {xp}
                            </Text>
                        </XStack>
                    </Animated.View>

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
        </Animated.View>
    )
}