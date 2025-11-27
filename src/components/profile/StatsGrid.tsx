import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Skeleton from '@/components/ui/Skeleton';

interface StatData {
    label: string;
    value: number | string;
    icon: string;
    gradient?: string[];
    color?: string;
    unit?: string;
}

interface StatsGridProps {
    primaryStats: StatData[];
    achievementStats: StatData[];
    loading: boolean;
    isDark: boolean;
}

export default function StatsGrid({ primaryStats, achievementStats, loading, isDark }: StatsGridProps) {
    return (
        <YStack px="$4">
            <Text fontSize={20} fontWeight="800" mb="$3">Quick Stats</Text>

            {loading ? (
                <YStack gap="$2.5">
                    <XStack gap="$2.5">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} width="32%" height={95} borderRadius={16} />
                        ))}
                    </XStack>
                    <XStack gap="$2.5">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} width="32%" height={95} borderRadius={16} />
                        ))}
                    </XStack>
                </YStack>
            ) : (
                <YStack gap="$2.5">
                    {/* Top Row - Primary Stats with Gradients */}
                    <XStack gap="$2.5" jc="space-between">
                        {primaryStats.map((stat, index) => (
                            <Animated.View
                                key={stat.label}
                                entering={ZoomIn.delay(100 + index * 80)}
                                style={{ flex: 1 }}
                            >
                                <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                                    <YStack
                                        br={16}
                                        overflow="hidden"
                                        style={{
                                            shadowColor: stat.gradient?.[0],
                                            shadowOffset: { width: 0, height: 3 },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 8,
                                        }}
                                    >
                                        <LinearGradient
                                            colors={stat.gradient as any}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{ paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', minHeight: 95 }}
                                        >
                                            <YStack
                                                w={36}
                                                h={36}
                                                br={10}
                                                ai="center"
                                                jc="center"
                                                bg="rgba(255,255,255,0.3)"
                                                mb="$1.5"
                                            >
                                                <Ionicons name={stat.icon as any} size={20} color="#fff" />
                                            </YStack>
                                            <Text fontSize={24} fontWeight="900" color="#fff" lineHeight={28}>
                                                {stat.value}{stat.unit}
                                            </Text>
                                            <Text fontSize={9} fontWeight="700" color="rgba(255,255,255,0.85)" textTransform="uppercase" letterSpacing={0.8}>
                                                {stat.label}
                                            </Text>
                                        </LinearGradient>
                                    </YStack>
                                </Pressable>
                            </Animated.View>
                        ))}
                    </XStack>

                    {/* Bottom Row - Secondary Stats */}
                    <XStack gap="$2.5" jc="space-between">
                        {achievementStats.map((stat, index) => (
                            <Animated.View
                                key={stat.label}
                                entering={FadeInDown.delay(300 + index * 80)}
                                style={{ flex: 1 }}
                            >
                                <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                                    <YStack
                                        br={16}
                                        bg={isDark ? '$gray2' : '#fff'}
                                        py="$3.5"
                                        px="$3"
                                        ai="center"
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: isDark ? 0.3 : 0.06,
                                            shadowRadius: 8,
                                            borderWidth: 1,
                                            borderColor: isDark ? '#27272a' : '#f3f4f6',
                                            minHeight: 95,
                                        }}
                                    >
                                        <YStack
                                            w={36}
                                            h={36}
                                            br={10}
                                            ai="center"
                                            jc="center"
                                            bg={`${stat.color}15`}
                                            mb="$1.5"
                                            style={{
                                                borderWidth: 1.5,
                                                borderColor: `${stat.color}35`,
                                            }}
                                        >
                                            <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                                        </YStack>
                                        <Text fontSize={24} fontWeight="900" color={stat.color} lineHeight={28}>
                                            {stat.value}
                                        </Text>
                                        <Text fontSize={9} fontWeight="700" color="$gray11" textTransform="uppercase" letterSpacing={0.8}>
                                            {stat.label}
                                        </Text>
                                    </YStack>
                                </Pressable>
                            </Animated.View>
                        ))}
                    </XStack>
                </YStack>
            )}
        </YStack>
    );
}
