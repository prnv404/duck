import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import { Text, XStack, YStack, View } from 'tamagui';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate 
} from 'react-native-reanimated';
import Skeleton from '@/components/ui/Skeleton';
import { memo } from 'react';

interface StatData {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
  gradient?: string[];
  unit?: string;
}

interface StatsGridProps {
  primaryStats: StatData[];
  achievementStats: StatData[];
  loading: boolean;
  isDark: boolean;
}

const StatCard = memo(({ stat, index, isDark }: { stat: StatData; index: number; isDark: boolean }) => {
  const displayColor = stat.color || stat.gradient?.[0] || '#8b5cf6';
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.96]) }],
  }));

  const cardBg = isDark ? '#171717' : '#ffffff';
  const borderColor = isDark ? '#262626' : '#f0f0f0';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subTextColor = isDark ? '#a3a3a3' : '#64748b';

  return (
    <Animated.View 
        entering={FadeInDown.delay(index * 50).springify()}
        style={[{ width: '48%', marginBottom: 12 }, animatedStyle]} // 48% width for 2-column with gap
    >
      <Pressable
        onPressIn={() => (pressed.value = withSpring(1))}
        onPressOut={() => (pressed.value = withSpring(0))}
        style={{ flex: 1 }}
      >
        <YStack
          flex={1}
          bg={cardBg}
          p="$3.5"
          br={24}
          borderWidth={1}
          borderColor={borderColor}
          jc="space-between"
          style={{
            shadowColor: displayColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0 : 0.08,
            shadowRadius: 16,
            elevation: isDark ? 0 : 2,
            minHeight: 120,
          }}
        >
          {/* Header: Label & Icon */}
          <XStack jc="space-between" ai="flex-start">
            <Text 
                fontSize={11} 
                fontFamily="Nunito_700Bold" 
                color={subTextColor} 
                textTransform="uppercase" 
                letterSpacing={1}
                mt="$1"
                flex={1}
                numberOfLines={2}
            >
              {stat.label}
            </Text>

            <YStack
              w={32}
              h={32}
              br={12}
              ai="center"
              jc="center"
              bg={`${displayColor}15`} // 15% opacity tint
            >
              <Ionicons name={stat.icon as any} size={16} color={displayColor} />
            </YStack>
          </XStack>

          {/* Body: Value */}
          <YStack mt="$2">
            <XStack ai="flex-end" gap="$1">
                <Text 
                    fontSize={28} 
                    lineHeight={32}
                    fontFamily="Nunito_900Black" 
                    color={textColor}
                >
                {stat.value}
                </Text>
                {stat.unit && (
                    <Text 
                        fontSize={14} 
                        fontFamily="Nunito_700Bold" 
                        color={subTextColor} 
                        mb="$1"
                    >
                        {stat.unit}
                    </Text>
                )}
            </XStack>
          </YStack>
        </YStack>
      </Pressable>
    </Animated.View>
  );
});

export default function StatsGrid({ primaryStats, achievementStats, loading, isDark }: StatsGridProps) {
  const allStats = [...(primaryStats || []), ...(achievementStats || [])].filter(Boolean);

  if (loading) {
    return (
      <XStack flexWrap="wrap" jc="space-between" px="$4">
        {[...Array(4)].map((_, i) => (
          <View key={i} w="48%" mb="$3">
            <Skeleton width="100%" height={120} borderRadius={24} />
          </View>
        ))}
      </XStack>
    );
  }

  return (
    <YStack px="$4" gap="$2" mt="$2">
      <XStack ai="center" gap="$2" mb="$1">
        <Text fontSize={20} fontFamily="Nunito_900Black" color={isDark ? '#fff' : '#0f172a'}>
            Overview
        </Text>
        <YStack h={1} flex={1} bg={isDark ? '#262626' : '#e2e8f0'} />
      </XStack>

      <XStack flexWrap="wrap" jc="space-between">
        {allStats.map((stat, i) => (
          <StatCard 
            key={stat.label + i} 
            stat={stat} 
            index={i} 
            isDark={isDark} 
          />
        ))}
      </XStack>
    </YStack>
  );
}