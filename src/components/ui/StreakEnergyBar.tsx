import { XStack, YStack, Text } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'
import { useEffect } from 'react'

export type StreakEnergyBarProps = {
  value: number
  color?: string
}

export default function StreakEnergyBar({ value, color = '#f97316' }: StreakEnergyBarProps) {
  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withTiming(Math.max(0, Math.min(1, value / 100)), { duration: 600, easing: Easing.out(Easing.cubic) })
  }, [value])

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }))

  return (
    <YStack gap="$2">
      <XStack ai="center" gap="$2">
        <Ionicons name="flame" size={16} color={color} />
        <Text fontSize={12} opacity={0.8}>Streak Energy</Text>
        <Text fontSize={12} fontWeight="800">{Math.round(value)}%</Text>
      </XStack>
      <YStack h={14} br={999} borderColor="$colorTransparent" overflow="hidden" bg="rgba(255,255,255,0.06)">
        <Animated.View style={[{ height: '100%' }, fillStyle]}>
          <LinearGradient
            colors={[`${color}`, `${color}99`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </YStack>
    </YStack>
  )
}
