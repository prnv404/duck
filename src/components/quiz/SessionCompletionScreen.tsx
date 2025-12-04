import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Modal, Pressable, useColorScheme } from 'react-native';
import { Text, XStack, YStack, Circle } from 'tamagui';
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

// Counter animation component
const AnimatedCounter = ({ value, delay = 0, isTime = false }: { value: number | string; delay?: number; isTime?: boolean }) => {
    const [displayValue, setDisplayValue] = useState(isTime ? '0s' : 0);

    useEffect(() => {
        if (isTime) {
            const timer = setTimeout(() => {
                setDisplayValue(value as string);
            }, delay);
            return () => clearTimeout(timer);
        } else {
            const numValue = typeof value === 'number' ? value : parseInt(value as string);
            const timer = setTimeout(() => {
                let current = 0;
                const increment = numValue / 30;
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= numValue) {
                        setDisplayValue(numValue);
                        clearInterval(interval);
                    } else {
                        setDisplayValue(Math.floor(current));
                    }
                }, 30);
                return () => clearInterval(interval);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [value, delay, isTime]);

    return <>{displayValue}</>;
};

export default function SessionCompletionScreen({
    visible,
    sessionData,
    onContinue,
}: SessionCompletionScreenProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
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
            }, 200);
        }
    }, [visible, sessionData]);

    if (!sessionData) return null;

    const { correctAnswers, questionsAttempted, wrongAnswers, accuracy = 0, timeSpentSeconds } = sessionData;
    const accuracyValue = typeof accuracy === 'number' ? accuracy : parseFloat(accuracy || '0');

    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    // Theme colors
    const bg = isDark ? '#000000' : '#ffffff';
    const text = isDark ? '#ffffff' : '#000000';
    const textMuted = isDark ? '#666666' : '#999999';
    const cardBg = isDark ? '#0a0a0a' : '#fafafa';

    return (
        <Modal visible={visible} animationType="fade" statusBarTranslucent transparent={false}>
            <YStack
                f={1}
                bg={bg}
                pt={insets.top + 80}
                pb={Math.max(insets.bottom, 20) + 20}
                px="$6"
                jc="space-between"
            >
                {/* Score Section */}
                <YStack ai="center" gap="$4">
                    <Text
                        fontSize={11}
                        fontFamily="Nunito_600SemiBold"
                        color={textMuted}
                        textTransform="uppercase"
                        letterSpacing={2}
                    >
                        Quiz Complete
                    </Text>
                    <YStack ai="center" mt="$2">
                        <Text
                            fontSize={96}
                            fontFamily="Nunito_900Black"
                            color={text}
                            letterSpacing={-4}
                            lineHeight={96}
                        >
                            <AnimatedCounter value={accuracyValue} delay={300} />%
                        </Text>
                    </YStack>
                    <Text
                        fontSize={15}
                        fontFamily="Nunito_600SemiBold"
                        color={textMuted}
                    >
                        {correctAnswers} of {questionsAttempted} correct
                    </Text>
                </YStack>

                {/* Metrics Grid */}
                <YStack gap="$4" mb="$4">
                    <XStack gap="$3">
                        {/* Correct */}
                        <YStack
                            f={1}
                            bg={cardBg}
                            p="$4"
                            br={20}
                            ai="center"
                            gap="$3"
                        >
                            <Circle size={48} bg={isDark ? '#1a1a1a' : '#f0f0f0'}>
                                <MaterialCommunityIcons
                                    name="check"
                                    size={24}
                                    color={text}
                                />
                            </Circle>
                            <Text
                                fontSize={36}
                                fontFamily="Nunito_900Black"
                                color={text}
                                letterSpacing={-2}
                            >
                                <AnimatedCounter value={correctAnswers} delay={500} />
                            </Text>
                            <Text
                                fontSize={10}
                                fontFamily="Nunito_700Bold"
                                color={textMuted}
                                textTransform="uppercase"
                                letterSpacing={1.5}
                            >
                                Correct
                            </Text>
                        </YStack>

                        {/* Wrong */}
                        <YStack
                            f={1}
                            bg={cardBg}
                            p="$4"
                            br={20}
                            ai="center"
                            gap="$3"
                        >
                            <Circle size={48} bg={isDark ? '#1a1a1a' : '#f0f0f0'}>
                                <MaterialCommunityIcons
                                    name="close"
                                    size={24}
                                    color={text}
                                />
                            </Circle>
                            <Text
                                fontSize={36}
                                fontFamily="Nunito_900Black"
                                color={text}
                                letterSpacing={-2}
                            >
                                <AnimatedCounter value={wrongAnswers} delay={600} />
                            </Text>
                            <Text
                                fontSize={10}
                                fontFamily="Nunito_700Bold"
                                color={textMuted}
                                textTransform="uppercase"
                                letterSpacing={1.5}
                            >
                                Wrong
                            </Text>
                        </YStack>

                        {/* Time */}
                        <YStack
                            f={1}
                            bg={cardBg}
                            p="$4"
                            br={20}
                            ai="center"
                            gap="$3"
                        >
                            <Circle size={48} bg={isDark ? '#1a1a1a' : '#f0f0f0'}>
                                <MaterialCommunityIcons
                                    name="clock-outline"
                                    size={24}
                                    color={text}
                                />
                            </Circle>
                            <Text
                                fontSize={36}
                                fontFamily="Nunito_900Black"
                                color={text}
                                letterSpacing={-2}
                            >
                                <AnimatedCounter value={timeDisplay} delay={700} isTime />
                            </Text>
                            <Text
                                fontSize={10}
                                fontFamily="Nunito_700Bold"
                                color={textMuted}
                                textTransform="uppercase"
                                letterSpacing={1.5}
                            >
                                Time
                            </Text>
                        </YStack>
                    </XStack>

                    {/* Button */}
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onContinue();
                        }}
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.6 : 1,
                        })}
                    >
                        <YStack
                            bg={text}
                            h={56}
                            br={28}
                            ai="center"
                            jc="center"
                        >
                            <Text
                                fontSize={16}
                                fontFamily="Nunito_800ExtraBold"
                                color={bg}
                                letterSpacing={0.5}
                            >
                                Continue
                            </Text>
                        </YStack>
                    </Pressable>
                </YStack>
            </YStack>
        </Modal>
    );
}
