import { useEffect } from 'react';
import { YStack, XStack, Circle } from 'tamagui';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    interpolate,
    FadeIn,
} from 'react-native-reanimated';

interface HomeLoadingSkeletonProps {
    isDark: boolean;
}

export default function HomeLoadingSkeleton({ isDark }: HomeLoadingSkeletonProps) {
    const shimmer = useSharedValue(0);
    const pulse = useSharedValue(0);

    const baseBg = isDark ? '#18181B' : '#FFFFFF';
    const border = isDark ? '#27272A' : '#E4E4E7';
    const skeletonBg = isDark ? '#27272A' : '#E4E4E7';
    const shimmerColor = isDark ? '#3f3f46' : '#f4f4f5';

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            false
        );
        pulse.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0.6, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        opacity: pulse.value,
    }));

    const SkeletonBox = ({
        width,
        height,
        borderRadius = 8,
        style = {}
    }: {
        width: number | string;
        height: number;
        borderRadius?: number;
        style?: any;
    }) => (
        <Animated.View style={[shimmerStyle, style]}>
            <YStack
                width={width as any}
                height={height}
                bg={skeletonBg}
                borderRadius={borderRadius}
            />
        </Animated.View>
    );

    return (
        <Animated.View entering={FadeIn.duration(300)}>
            <YStack gap="$5">
                {/* Header Skeleton */}
                <XStack ai="center" jc="space-between">
                    <XStack ai="center" gap="$3" f={1}>
                        <Animated.View style={pulseStyle}>
                            <Circle size={48} bg={skeletonBg} />
                        </Animated.View>
                        <YStack gap="$2" f={1}>
                            <SkeletonBox width={100} height={14} />
                            <SkeletonBox width={140} height={20} />
                        </YStack>
                    </XStack>
                    <XStack gap="$2">
                        <SkeletonBox width={50} height={32} borderRadius={10} />
                        <SkeletonBox width={60} height={32} borderRadius={10} />
                    </XStack>
                </XStack>

                {/* Streak Calendar Skeleton */}
                <YStack
                    bg={baseBg}
                    br={16}
                    p="$4"
                    borderWidth={1}
                    borderColor={border}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isDark ? 0.3 : 0.05,
                        shadowRadius: 3,
                        elevation: 2,
                    }}
                >
                    <XStack ai="center" jc="space-between" mb="$3">
                        <SkeletonBox width={100} height={18} />
                        <XStack ai="center" gap="$1">
                            <SkeletonBox width={40} height={24} />
                            <SkeletonBox width={35} height={14} />
                        </XStack>
                    </XStack>

                    {/* Week days */}
                    <XStack jc="space-between">
                        {[...Array(7)].map((_, i) => (
                            <YStack key={i} ai="center" gap="$1">
                                <SkeletonBox width={20} height={12} />
                                <Animated.View style={pulseStyle}>
                                    <YStack w={34} h={34} br={9} bg={skeletonBg} />
                                </Animated.View>
                                <SkeletonBox width={16} height={10} />
                            </YStack>
                        ))}
                    </XStack>

                    {/* Legend */}
                    <XStack ai="center" jc="space-between" mt="$2" pt="$2" borderTopWidth={1} borderTopColor={border}>
                        <SkeletonBox width={30} height={12} />
                        <XStack gap="$1">
                            {[...Array(5)].map((_, i) => (
                                <YStack key={i} w={16} h={16} br={4} bg={skeletonBg} opacity={0.5 + i * 0.1} />
                            ))}
                        </XStack>
                        <SkeletonBox width={30} height={12} />
                    </XStack>
                </YStack>

                {/* Quiz Mode Selector Skeleton */}
                <YStack ai="center" gap="$4">
                    <YStack ai="center" gap="$2">
                        <SkeletonBox width={160} height={22} />
                        <SkeletonBox width={220} height={14} />
                    </YStack>

                    <YStack
                        bg={baseBg}
                        br={16}
                        p="$3.5"
                        borderWidth={1}
                        borderColor={border}
                        width="100%"
                        gap="$3.5"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0.3 : 0.05,
                            shadowRadius: 3,
                            elevation: 2,
                        }}
                    >
                        <SkeletonBox width={140} height={18} />

                        <YStack gap="$2">
                            <SkeletonBox width={150} height={14} />
                            <XStack gap="$2">
                                {[...Array(4)].map((_, i) => (
                                    <Animated.View key={i} style={[pulseStyle, { flex: 1 }]}>
                                        <YStack f={1} h={60} bg={skeletonBg} br={10} />
                                    </Animated.View>
                                ))}
                            </XStack>
                        </YStack>

                        {/* Start Button Skeleton */}
                        <Animated.View style={pulseStyle}>
                            <YStack h={52} bg={isDark ? '#10b98140' : '#d1fae5'} br={12} />
                        </Animated.View>
                    </YStack>
                </YStack>

                {/* Focus Areas Skeleton */}
                <YStack gap="$3" mt="$2">
                    <YStack gap="$1">
                        <SkeletonBox width={180} height={20} />
                        <SkeletonBox width={160} height={14} />
                    </YStack>

                    <YStack
                        bg={baseBg}
                        p="$4"
                        br={16}
                        borderWidth={1}
                        borderColor={border}
                    >
                        {/* Tap hint skeleton */}
                        <SkeletonBox width="100%" height={36} borderRadius={10} style={{ marginBottom: 12 }} />

                        {/* Bar chart skeleton */}
                        <XStack jc="space-around" ai="flex-end" h={200}>
                            {[0.6, 0.8, 0.4, 0.9, 0.5].map((height, i) => (
                                <Animated.View key={i} style={pulseStyle}>
                                    <YStack
                                        w={45}
                                        h={160 * height}
                                        bg={skeletonBg}
                                        borderTopLeftRadius={8}
                                        borderTopRightRadius={8}
                                    />
                                </Animated.View>
                            ))}
                        </XStack>
                    </YStack>
                </YStack>
            </YStack>
        </Animated.View>
    );
}
