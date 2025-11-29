import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { Text, YStack, XStack } from 'tamagui';

interface SessionStartScreenProps {
    visible: boolean;
    mode: string;
    topicName?: string;
    onComplete: () => void;
    isDark: boolean;
}

const MODE_LABELS: Record<string, { title: string; icon: string; color: string; subtitle: string }> = {
    balanced: {
        title: 'Balanced',
        icon: 'scale-balance',
        color: '#3b82f6',
        subtitle: 'Mixed difficulty & topics'
    },
    adaptive: {
        title: 'Adaptive',
        icon: 'brain',
        color: '#8b5cf6',
        subtitle: 'Adjusts to your level'
    },
    weak_area: {
        title: 'Weak Areas',
        icon: 'target',
        color: '#ef4444',
        subtitle: 'Focus on improvement'
    },
    hard_core: {
        title: 'Hardcore',
        icon: 'fire',
        color: '#f97316',
        subtitle: 'Maximum challenge'
    },
};

export default function SessionStartScreen({
    visible,
    mode,
    topicName,
    onComplete,
    isDark
}: SessionStartScreenProps) {
    const [countdown, setCountdown] = useState(3);
    const [showGo, setShowGo] = useState(false);

    useEffect(() => {
        if (!visible) {
            setCountdown(3);
            setShowGo(false);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev > 1) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    return prev - 1;
                } else {
                    clearInterval(timer);
                    setShowGo(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                    // Auto-dismiss after showing "GO!"
                    setTimeout(() => {
                        onComplete();
                    }, 1000);

                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [visible, onComplete]);

    const modeInfo = MODE_LABELS[mode] || MODE_LABELS.balanced;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <YStack
                f={1}
                bg={isDark ? '#000000f5' : '#fffffff5'}
                ai="center"
                jc="center"
                gap="$8"
                px="$6"
            >
                {/* Mode Badge */}
                <Animated.View entering={FadeInDown.duration(500).springify()}>
                    <YStack ai="center" gap="$4">
                        {/* Icon Container with Glow */}
                        <YStack
                            w={140}
                            h={140}
                            br={70}
                            bg={`${modeInfo.color}10`}
                            ai="center"
                            jc="center"
                            borderWidth={3}
                            borderColor={`${modeInfo.color}40`}
                            style={{
                                shadowColor: modeInfo.color,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.6,
                                shadowRadius: 30,
                                elevation: 20,
                            }}
                        >
                            <YStack
                                w={100}
                                h={100}
                                br={50}
                                bg={modeInfo.color}
                                ai="center"
                                jc="center"
                            >
                                <MaterialCommunityIcons
                                    name={modeInfo.icon as any}
                                    size={50}
                                    color="#ffffff"
                                />
                            </YStack>
                        </YStack>

                        {/* Mode Title */}
                        <YStack ai="center" gap="$2">
                            <Text
                                fontSize={36}
                                fontFamily="Nunito_900Black"
                                color={modeInfo.color}
                                letterSpacing={-1}
                            >
                                {modeInfo.title}
                            </Text>

                            <Text
                                fontSize={15}
                                fontFamily="Nunito_600SemiBold"
                                color={isDark ? '#a3a3a3' : '#64748b'}
                            >
                                {modeInfo.subtitle}
                            </Text>

                            {topicName && (
                                <XStack
                                    mt="$2"
                                    px="$4"
                                    py="$2"
                                    br={20}
                                    bg={isDark ? '#ffffff10' : '#00000008'}
                                >
                                    <Text
                                        fontSize={14}
                                        fontFamily="Nunito_700Bold"
                                        color={isDark ? '#ffffff' : '#000000'}
                                    >
                                        {topicName}
                                    </Text>
                                </XStack>
                            )}
                        </YStack>
                    </YStack>
                </Animated.View>

                {/* Countdown / GO */}
                {!showGo ? (
                    <Animated.View
                        key={countdown}
                        entering={ZoomIn.duration(400).springify()}
                    >
                        <YStack
                            w={160}
                            h={160}
                            br={80}
                            bg={modeInfo.color}
                            ai="center"
                            jc="center"
                            style={{
                                shadowColor: modeInfo.color,
                                shadowOffset: { width: 0, height: 12 },
                                shadowOpacity: 0.5,
                                shadowRadius: 25,
                                elevation: 15,
                            }}
                        >
                            <Text
                                fontSize={80}
                                fontFamily="Nunito_900Black"
                                color="#ffffff"
                            >
                                {countdown}
                            </Text>
                        </YStack>
                    </Animated.View>
                ) : (
                    <Animated.View entering={ZoomIn.duration(500).springify()}>
                        <YStack ai="center" gap="$3">
                            <Text
                                fontSize={90}
                                fontFamily="Nunito_900Black"
                                color={modeInfo.color}
                                letterSpacing={-2}
                                style={{
                                    textShadowColor: `${modeInfo.color}40`,
                                    textShadowOffset: { width: 0, height: 4 },
                                    textShadowRadius: 20,
                                }}
                            >
                                GO!
                            </Text>
                            <XStack ai="center" gap="$2">
                                <Text
                                    fontSize={18}
                                    fontFamily="Nunito_800ExtraBold"
                                    color={isDark ? '#ffffff' : '#000000'}
                                >
                                    Good Luck
                                </Text>
                                <Text fontSize={20}>🚀</Text>
                            </XStack>
                        </YStack>
                    </Animated.View>
                )}

                {/* Bottom Hint */}
                {!showGo && (
                    <Animated.View entering={FadeIn.delay(500).duration(600)}>
                        <Text
                            fontSize={13}
                            fontFamily="Nunito_600SemiBold"
                            color={isDark ? '#71717a' : '#a1a1aa'}
                            textAlign="center"
                        >
                            Get ready to test your knowledge
                        </Text>
                    </Animated.View>
                )}
            </YStack>
        </Modal>
    );
}
