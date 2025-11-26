import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { YStack } from 'tamagui';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function LoginBackground() {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 20000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <YStack style={StyleSheet.absoluteFill}>
            <AnimatedLinearGradient
                colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, animatedStyle, styles.gradient]}
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                style={StyleSheet.absoluteFill}
            />
        </YStack>
    );
}

const styles = StyleSheet.create({
    gradient: {
        opacity: 0.8,
    },
});
