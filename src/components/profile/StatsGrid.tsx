import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
    // Determine the color to use for the icon and background tint
    // Prefer explicit color, then first color of gradient, then a fallback
    const displayColor = stat.color || stat.gradient?.[0] || '#8b5cf6';

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 40).springify()}
            style={{ flex: 1 }}
        >
            <Pressable>
                <YStack
                    flex={1}
                    bg={isDark ? '#0f0f0f' : '#fafafa'}
                    p="$3.5"
                    br={20}
                    gap="$2"
                    borderWidth={1}
                    borderColor={isDark ? '#1a1a1a' : '#f0f0f0'}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDark ? 0.3 : 0.06,
                        shadowRadius: 12,
                        elevation: 4,
                        minHeight: 110,
                    }}
                >
                    {/* Icon Circle */}
                    <YStack
                        w={40}
                        h={40}
                        br={20}
                        ai="center"
                        jc="center"
                        bg={`${displayColor}15`} // 15% opacity for subtle tint
                        mb="$1"
                    >
                        <Ionicons name={stat.icon as any} size={20} color={displayColor} />
                    </YStack>

                    <YStack gap="$0.5">
                        <Text fontSize={24} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#0a0a0a'}>
                            {stat.value}{stat.unit || ''}
                        </Text>

                        <Text
                            fontSize={12}
                            fontFamily="Nunito_700Bold"
                            color={isDark ? '#737373' : '#a3a3a3'}
                        >
                            {stat.label}
                        </Text>
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
            <YStack px="$4" gap="$1.5">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} width="100%" height={60} borderRadius={12} />
                ))}
            </YStack>
        );
    }

    const mid = Math.ceil(allStats.length / 2);

    return (
        <YStack px="$4" gap="$2">
            <Text fontSize={25} fontWeight="700" color={isDark ? '#fff' : '#000'}>Stats</Text>

            <XStack gap="$1.5">
                <YStack flex={1} gap="$1.5">
                    {allStats.slice(0, mid).map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} index={i} isDark={isDark} />
                    ))}
                </YStack>

                <YStack flex={1} gap="$1.5">
                    {allStats.slice(mid).map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} index={mid + i} isDark={isDark} />
                    ))}
                </YStack>
            </XStack>
        </YStack>
    );
}
