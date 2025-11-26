import { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence
} from 'react-native-reanimated';
import { YStack } from 'tamagui';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SkeletonProps = {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
};

export default function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
    const isDark = useColorScheme() === 'dark';
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1000 }),
                withTiming(0.3, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[animatedStyle, style]}>
            <YStack
                width={width}
                height={height}
                borderRadius={borderRadius}
                bg={isDark ? '#262626' : '#e5e5e5'}
            />
        </Animated.View>
    );
}
