import { PropsWithChildren } from 'react'
import { Card, XStack, YStack, Text } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated'

export type GlowCapsuleProps = PropsWithChildren<{
  title: string
  subtitle?: string
  color?: string
  icon?: any
  active?: boolean
  onPress?: () => void
} & any>

function resolveHex(c: string) {
  if (c.startsWith('#')) return c
  const s = c.toLowerCase()
  if (s.includes('pink')) return '#ec4899'
  if (s.includes('green')) return '#22c55e'
  if (s.includes('purple')) return '#a855f7'
  if (s.includes('blue')) return '#3b82f6'
  if (s.includes('red')) return '#ef4444'
  if (s.includes('yellow')) return '#f59e0b'
  if (s.includes('orange')) return '#f97316'
  if (s.includes('cyan') || s.includes('teal')) return '#06b6d4'
  return '#22c55e'
}

export default function GlowCapsule({ title, subtitle, color = '#22c55e', icon = 'flash', active, children, onPress, ...rest }: GlowCapsuleProps) {
  const pulse = useSharedValue(0)
  const glowHex = typeof color === 'string' ? resolveHex(color) : '#22c55e'
  const glow = useAnimatedStyle(() => ({
    opacity: active ? 0.2 + pulse.value * 0.25 : 0,
    transform: [{ scale: 0.98 + pulse.value * 0.02 }],
  }))
  pulse.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), -1, true)

  return (
    <Card
      elevate
      bordered
      br={999}
      p="$4"
      onPress={onPress}
      pressStyle={{ scale: 0.98 }}
      animation="bouncy"
      backgroundColor="rgba(14,20,32,0.72)"
      borderColor={active ? (color as any) : '$borderColor'}
      style={{ overflow: 'hidden' }}
      {...rest}
    >
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, glow]} pointerEvents="none">
        <LinearGradient colors={[glowHex, 'transparent']} style={{ flex: 1 }} />
      </Animated.View>
      <XStack ai="center" jc="space-between" gap="$3">
        <XStack ai="center" gap="$3">
          <YStack h={40} w={40} br={999} ai="center" jc="center" backgroundColor={color as any}>
            <Ionicons name={icon as any} size={18} color="#fff" />
          </YStack>
          <YStack>
            <Text fontSize={14} fontWeight="800">{title}</Text>
            {!!subtitle && <Text opacity={0.7} fontSize={12}>{subtitle}</Text>}
          </YStack>
        </XStack>
        {children}
      </XStack>
    </Card>
  )
}
