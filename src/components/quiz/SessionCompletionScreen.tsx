import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
} from 'react-native-reanimated';
import { Text, XStack, YStack, Button } from 'tamagui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SessionCompletionScreenProps {
    visible: boolean;
    sessionData: {
        totalQuestions: number;
        questionsAttempted: number;
        correctAnswers: number;
        wrongAnswers: number;
        accuracy: number | string;
        xpEarned: number;
        timeSpentSeconds: number;
    } | null;
    onContinue: () => void;
}

// Animated counter component
const AnimatedCounter = ({
    value,
    delay = 0,
    fontSize = 56,
    color,
    suffix = ''
}: {
    value: number;
    delay?: number;
    fontSize?: number;
    color: string;
    suffix?: string;
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            let current = 0;
            const increment = value / 25;
            const interval = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setDisplayValue(value);
                    clearInterval(interval);
                } else {
                    setDisplayValue(Math.floor(current));
                }
            }, 35);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <Text
            fontSize={fontSize}
            fontFamily="Nunito_900Black"
            color={color}
            letterSpacing={-2}
        >
            {displayValue}{suffix}
        </Text>
    );
};

// Stat Card Component
const StatCard = ({
    icon,
    value,
    label,
    iconColor,
    delay = 0
}: {
    icon: string;
    value: string | number;
    label: string;
    iconColor: string;
    delay?: number;
}) => {
    const theme = useColorScheme();
    const isDark = theme === 'dark';

    const cardBg = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.04)';
    const borderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
    const textColor = isDark ? '#fafafa' : '#18181b';
    const labelColor = isDark ? '#d4d4d8' : '#71717a';

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).springify().damping(15)}
            style={{ flex: 1 }}
        >
            <YStack
                f={1}
                bg={cardBg}
                borderWidth={1}
                borderColor={borderColor}
                br={20}
                p="$3"
                ai="center"
                jc="center"
                gap="$1.5"
                minHeight={110}
            >
                <MaterialCommunityIcons name={icon as any} size={28} color={iconColor} />
                <Text
                    fontSize={28}
                    fontFamily="Nunito_900Black"
                    color={textColor}
                    letterSpacing={-1}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {value}
                </Text>
                <Text
                    fontSize={12}
                    fontFamily="Nunito_700Bold"
                    color={labelColor}
                    textTransform="uppercase"
                    letterSpacing={0.5}
                >
                    {label}
                </Text>
            </YStack>
        </Animated.View>
    );
};

export default function SessionCompletionScreen({
    visible,
    sessionData,
    onContinue,
}: SessionCompletionScreenProps) {
    const theme = useColorScheme();
    const isDark = theme === 'dark';
    const insets = useSafeAreaInsets();
    const player = useAudioPlayer(require('../../../assets/audio/reward.mp3'));

    useEffect(() => {
        if (visible && sessionData) {
            setTimeout(() => {
                try {
                    player.seekTo(0);
                    player.play();
                } catch (e) { }
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }, 300);
        }
    }, [visible, sessionData]);

    if (!sessionData) return null;

    const { correctAnswers, questionsAttempted, wrongAnswers, accuracy = 0, xpEarned, timeSpentSeconds } = sessionData;
    const accuracyValue = typeof accuracy === 'number' ? accuracy : parseFloat(accuracy || '0');

    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    // Performance evaluation
    let performanceEmoji = '🎯';
    let performanceTitle = 'Good Effort';
    let performanceSubtitle = 'Keep practicing to improve';
    const buttonBg = isDark ? '#fafafa' : '#18181b';
    const buttonText = isDark ? '#18181b' : '#fafafa';

    if (accuracyValue >= 90) {
        performanceEmoji = '🏆';
        performanceTitle = 'Outstanding';
        performanceSubtitle = 'You absolutely nailed it!';
    } else if (accuracyValue >= 75) {
        performanceEmoji = '⭐';
        performanceTitle = 'Excellent';
        performanceSubtitle = 'Great performance!';
    } else if (accuracyValue >= 50) {
        performanceEmoji = '💪';
        performanceTitle = 'Well Done';
        performanceSubtitle = 'You\'re making solid progress';
    }

    // Theme colors
    const bgColor = isDark ? '#09090b' : '#fafafa';
    const textColor = isDark ? '#fafafa' : '#09090b';
    const subtitleColor = isDark ? '#d4d4d8' : '#71717a';
    const scoreColor = isDark ? '#fafafa' : '#18181b';
    const correctColor = isDark ? '#16a34a' : '#22c55e';
    const wrongColor = isDark ? '#dc2626' : '#ef4444';
    const timeColor = isDark ? '#60a5fa' : '#3b82f6';

    return (
        <Modal visible={visible} animationType="fade" statusBarTranslucent transparent={false}>
            <YStack f={1} bg={bgColor}>
                <YStack
                    f={1}
                    pt={insets.top + 40}
                    pb={Math.max(insets.bottom, 20) + 20}
                    px="$5"
                    gap="$6"
                    jc="space-between"
                >
                    {/* Header Section */}
                    <YStack ai="center" gap="$3" mt="$8">
                        <Animated.View entering={FadeIn.duration(500).delay(100)}>
                            <Text fontSize={80} lineHeight={80}>{performanceEmoji}</Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(300).springify()}>
                            <YStack ai="center" gap="$1.5">
                                <Text
                                    fontSize={36}
                                    fontFamily="Nunito_900Black"
                                    color={textColor}
                                    textAlign="center"
                                    letterSpacing={-1.5}
                                >
                                    {performanceTitle}
                                </Text>
                                <Text
                                    fontSize={15}
                                    fontFamily="Nunito_600SemiBold"
                                    color={subtitleColor}
                                    textAlign="center"
                                >
                                    {performanceSubtitle}
                                </Text>
                            </YStack>
                        </Animated.View>
                    </YStack>

                    {/* Main Score Display */}
                    <Animated.View
                        entering={FadeInDown.delay(500).springify()}
                        style={{ width: '100%', alignItems: 'center' }}
                    >
                        <YStack ai="center" gap="$1">
                            <Text
                                fontSize={13}
                                fontFamily="Nunito_700Bold"
                                color={subtitleColor}
                                textTransform="uppercase"
                                letterSpacing={1}
                            >
                                Accuracy
                            </Text>
                            <XStack ai="flex-end" gap="$1">
                                <AnimatedCounter
                                    value={accuracyValue}
                                    delay={50}
                                    fontSize={72}
                                    color={scoreColor}
                                />
                                <Text
                                    fontSize={40}
                                    fontFamily="Nunito_900Black"
                                    color={scoreColor}
                                    mb="$1"
                                    letterSpacing={-1}
                                >
                                    %
                                </Text>
                            </XStack>
                            <Text
                                fontSize={16}
                                fontFamily="Nunito_700Bold"
                                color={subtitleColor}
                            >
                                {correctAnswers} of {questionsAttempted} correct
                            </Text>
                        </YStack>
                    </Animated.View>

                    {/* Stats Grid */}
                    <XStack gap="$3" w="100%" bottom={25}>
                        <StatCard
                            icon="check-circle"
                            value={correctAnswers}
                            label="Correct"
                            iconColor={correctColor}
                            delay={500}
                        />
                        <StatCard
                            icon="close-circle"
                            value={wrongAnswers}
                            label="Wrong"
                            iconColor={wrongColor}
                            delay={500}
                        />
                        <StatCard
                            icon="clock-outline"
                            value={timeDisplay}
                            label="Time"
                            iconColor={timeColor}
                            delay={500}
                        />
                    </XStack>

                    {/* Continue Button */}
                    <Animated.View
                        entering={FadeInDown.delay(1100).springify()}
                        style={{ width: '100%' }}
                    >
                        <Button
                            size="$5"
                            bg={buttonBg}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                onContinue();
                            }}
                            pressStyle={{
                                scale: 0.97,
                                opacity: 0.9
                            }}
                            br={18}
                            h={60}
                        >
                            <Text
                                fontSize={17}
                                fontFamily="Nunito_800ExtraBold"
                                color={buttonText}
                                letterSpacing={0.3}
                            >
                                Continue
                            </Text>
                        </Button>
                    </Animated.View>
                </YStack>
            </YStack>
        </Modal>
    );
}