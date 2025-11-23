import { Card, YStack } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { StyleSheet } from 'react-native'
import { PropsWithChildren } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'

export type GlassCardProps = PropsWithChildren<{
  borderColor?: string
} & any>

export default function GlassCard({ borderColor = '$borderColor', children, style, ...rest }: GlassCardProps) {
  const isDark = useColorScheme() === 'dark'
  return (
    <Card
      elevate
      bordered
      br="$8"
      backgroundColor={isDark ? 'rgba(11,17,27,0.72)' : 'rgba(255,255,255,0.82)'}
      borderColor={borderColor}
      style={[
        { overflow: 'hidden', shadowColor: isDark ? '#000' : '#0f172a', shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
        { elevation: 14 },
        style,
      ]}
      {...rest}
    >
      <YStack>
        <BlurView intensity={isDark ? 22 : 28} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
        <LinearGradient
          colors={isDark ? ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.00)'] : ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.00)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 64, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
        {children}
      </YStack>
    </Card>
  )
}
