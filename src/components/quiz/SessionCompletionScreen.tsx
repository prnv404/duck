import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import Animated, {
    FadeInDown,
    ZoomIn,
} from 'react-native-reanimated';
import { Text, XStack, YStack, Button } from 'tamagui';

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
    isDark: boolean;
}

const CountUp = ({ value, suffix = '', style }: { value: number, suffix?: string, style?: any }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1500;
        const startTime = Date.now();

        const frame = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(start + (end - start) * ease);
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    }, [value]);

    return <Text style={style}>{displayValue}{suffix}</Text>;
};

export default function SessionCompletionScreen({
    visible,
    sessionData,
    onContinue,
    isDark,
}: SessionCompletionScreenProps) {
    // Initialize audio player with the reward sound
    const player = useAudioPlayer(require('../../../assets/audio/reward.mp3'));

    useEffect(() => {
        if (visible && sessionData) {
            const playSequence = async () => {
                // Audio
                try {
                    player.seekTo(0);
                    player.play();
                } catch (error) {
                    console.log('Error playing sound:', error);
                }

                // Haptics
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 400);
                setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 800);
            };
            playSequence();
        }
    }, [visible, sessionData]);

    if (!sessionData) return null;

    const { correctAnswers, questionsAttempted, wrongAnswers, accuracy = 0, xpEarned, timeSpentSeconds, totalQuestions } = sessionData;

    const accuracyValue = typeof accuracy === 'number' ? accuracy : parseFloat(accuracy || '0');

    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    // Motivational Message Logic
    let title = 'Good Job!';
    let subtitle = 'You completed the lesson!';
    let titleColor = '#3b82f6'; // blue

    if (accuracyValue >= 90) {
        title = 'Perfect!';
        subtitle = 'You are unstoppable!';
        titleColor = '#eab308'; // yellow
    } else if (accuracyValue >= 70) {
        title = 'Great Job!';
        subtitle = 'Keep up the momentum!';
        titleColor = '#22c55e'; // green
    }

    const topStats = [
        {
            label: 'Total',
            value: totalQuestions,
            icon: 'format-list-bulleted',
            color: '#8b5cf6',
            delay: 300
        },
        {
            label: 'Mistakes',
            value: wrongAnswers,
            icon: 'alert-circle',
            color: '#ef4444',
            delay: 400
        },
    ];

    const bottomStats = [
        {
            label: 'XP Earned',
            value: xpEarned,
            suffix: '',
            icon: 'lightning-bolt',
            color: '#facc15',
            delay: 500
        },
        {
            label: 'Accuracy',
            value: accuracyValue,
            suffix: '%',
            icon: 'target',
            color: '#3b82f6',
            delay: 600
        },
        {
            label: 'Time',
            value: timeDisplay,
            isString: true,
            icon: 'clock-outline',
            color: '#ec4899',
            delay: 700
        },
    ];

    const bg = isDark ? '#020617' : '#ffffff';
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const borderColor = isDark ? '#334155' : '#e2e8f0';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return (
        <Modal
            visible={visible}
            animationType="slide"
            statusBarTranslucent
            presentationStyle="fullScreen"
        >
            <YStack f={1} bg={bg} pt="$8" pb="$6" px="$4" jc="space-between">

                <YStack ai="center" w="100%">
                    {/* Header */}
                    <Animated.View entering={FadeInDown.duration(600).springify()}>
                        <Text
                            fontSize={30}
                            fontFamily="Nunito_900Black"
                            color="#eab308"
                            textAlign="center"
                            mb="$6"
                        >
                            Lesson Complete!
                        </Text>
                    </Animated.View>

                    {/* Hero */}
                    <Animated.View entering={ZoomIn.delay(200).duration(600).springify()}>
                        <YStack
                            w={140}
                            h={140}
                            bg={isDark ? '#334155' : '#fef9c3'}
                            br={999}
                            ai="center"
                            jc="center"
                            borderWidth={4}
                            borderColor="#eab308"
                            mb="$6"
                        >
                            <MaterialCommunityIcons
                                name="trophy"
                                size={80}
                                color="#eab308"
                            />
                        </YStack>
                    </Animated.View>

                    {/* Top Stats (Total & Mistakes) */}
                    <XStack gap="$3" mb="$5">
                        {topStats.map((stat, index) => (
                            <Animated.View
                                key={stat.label}
                                entering={FadeInDown.delay(stat.delay).springify()}
                            >
                                <YStack
                                    bg={cardBg}
                                    px="$4"
                                    py="$2.5"
                                    br={14}
                                    borderWidth={2}
                                    borderColor={borderColor}
                                    ai="center"
                                    style={{ borderBottomWidth: 4 }}
                                >
                                    <Text
                                        fontSize={12}
                                        fontFamily="Nunito_700Bold"
                                        color={stat.color}
                                        textTransform="uppercase"
                                        mb="$1"
                                    >
                                        {stat.label}
                                    </Text>
                                    <Text
                                        fontSize={20}
                                        fontFamily="Nunito_900Black"
                                        color={textColor}
                                    >
                                        {stat.value}
                                    </Text>
                                </YStack>
                            </Animated.View>
                        ))}
                    </XStack>

                    {/* Motivational Message */}
                    <Animated.View entering={ZoomIn.delay(450).springify()}>
                        <YStack ai="center" gap="$1" mb="$6">
                            <Text
                                fontSize={28}
                                fontFamily="Nunito_900Black"
                                color={titleColor}
                                textAlign="center"
                            >
                                {title}
                            </Text>
                            <Text
                                fontSize={16}
                                fontFamily="Nunito_700Bold"
                                color={isDark ? '#94a3b8' : '#64748b'}
                                textAlign="center"
                            >
                                {subtitle}
                            </Text>
                        </YStack>
                    </Animated.View>

                    {/* Bottom Stats (XP, Accuracy, Time) */}
                    <XStack gap="$3" flexWrap="wrap" jc="center">
                        {bottomStats.map((stat, index) => (
                            <Animated.View
                                key={stat.label}
                                entering={FadeInDown.delay(stat.delay).springify()}
                                style={{ width: '30%' }}
                            >
                                <YStack
                                    bg={cardBg}
                                    p="$2"
                                    br={16}
                                    borderWidth={2}
                                    borderColor={borderColor}
                                    ai="center"
                                    gap="$1"
                                    h={100}
                                    jc="center"
                                    style={{ borderBottomWidth: 4 }}
                                >
                                    <MaterialCommunityIcons
                                        name={stat.icon as any}
                                        size={24}
                                        color={stat.color}
                                    />
                                    <Text
                                        fontSize={11}
                                        fontFamily="Nunito_700Bold"
                                        color={isDark ? '#94a3b8' : '#64748b'}
                                        textTransform="uppercase"
                                    >
                                        {stat.label}
                                    </Text>
                                    {stat.isString ? (
                                        <Text
                                            fontSize={14}
                                            fontFamily="Nunito_900Black"
                                            color={textColor}
                                            numberOfLines={1}
                                            adjustsFontSizeToFit
                                        >
                                            {stat.value}
                                        </Text>
                                    ) : (
                                        <CountUp
                                            value={stat.value as number}
                                            suffix={stat.suffix}
                                            style={{
                                                fontSize: 16,
                                                fontFamily: "Nunito_900Black",
                                                color: textColor
                                            }}
                                        />
                                    )}
                                </YStack>
                            </Animated.View>
                        ))}
                    </XStack>
                </YStack>

                {/* Footer */}
                <Animated.View
                    entering={FadeInDown.delay(900).springify()}
                    style={{ width: '100%' }}
                >
                    <Button
                        size="$5"
                        bg="#58cc02"
                        onPress={onContinue}
                        pressStyle={{ scale: 0.96, opacity: 0.9 }}
                        br={16}
                        h={56}
                        borderBottomWidth={4}
                        borderColor="#46a302"
                    >
                        <Text
                            fontSize={18}
                            fontFamily="Nunito_800ExtraBold"
                            color="#ffffff"
                            textTransform="uppercase"
                            letterSpacing={0.5}
                        >
                            Continue
                        </Text>
                    </Button>
                </Animated.View>
            </YStack>
        </Modal>
    );
}
