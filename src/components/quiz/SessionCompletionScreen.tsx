import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Modal } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
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

export default function SessionCompletionScreen({
    visible,
    sessionData,
    onContinue,
    isDark,
}: SessionCompletionScreenProps) {

    useEffect(() => {
        if (visible && sessionData) {
            // Celebration haptic
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [visible, sessionData]);

    if (!sessionData) return null;

    const { correctAnswers, questionsAttempted, wrongAnswers, accuracy = 0, xpEarned, timeSpentSeconds } = sessionData;

    // Determine performance level
    let performanceLevel = 'Keep Practicing';
    let performanceColor = '#f59e0b';
    let performanceIcon = 'emoticon-neutral';

    const accuracyValue = typeof accuracy === 'number' ? accuracy : parseFloat(accuracy || '0');

    if (accuracyValue >= 80) {
        performanceLevel = 'Excellent!';
        performanceColor = '#10b981';
        performanceIcon = 'emoticon-excited';
    } else if (accuracyValue >= 50) {
        performanceLevel = 'Good Job!';
        performanceColor = '#3b82f6';
        performanceIcon = 'emoticon-happy';
    }

    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const stats = [
        { label: 'Score', value: `${correctAnswers}/${questionsAttempted}`, icon: 'trophy', color: '#fbbf24' },
        { label: 'Wrong Answers', value: `${wrongAnswers}`, icon: 'alert-circle', color: '#f97373' },
        { label: 'Accuracy', value: `${accuracyValue.toFixed(1)}%`, icon: 'target', color: '#3b82f6' },
        { label: 'XP Earned', value: `+${xpEarned}`, icon: 'star-circle', color: '#facc15' },
        { label: 'Time Spent', value: timeDisplay, icon: 'clock-outline', color: '#ec4899' },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <YStack
                f={1}
                bg={isDark ? '#020617ee' : '#f9fafbee'}
                ai="center"
                jc="center"
                p="$6"
            >
                <YStack w="100%" maxWidth={420} gap="$5">
                    <Animated.View entering={ZoomIn.delay(150).duration(500)}>
                        <YStack
                            br={24}
                            p="$4.5"
                            bg={isDark ? '#020617' : '#eef2ff'}
                            borderWidth={1}
                            borderColor={isDark ? '#1e293b' : '#c7d2fe'}
                            gap="$3"
                        >
                            <XStack ai="center" gap="$3">
                                <YStack
                                    w={64}
                                    h={64}
                                    br={20}
                                    bg={`${performanceColor}20`}
                                    ai="center"
                                    jc="center"
                                >
                                    <MaterialCommunityIcons
                                        name={performanceIcon as any}
                                        size={40}
                                        color={performanceColor}
                                    />
                                </YStack>
                                <YStack f={1} gap="$1">
                                    <Text
                                        fontSize={26}
                                        fontFamily="Nunito_900Black"
                                        color={performanceColor}
                                    >
                                        {performanceLevel}
                                    </Text>
                                    <Text
                                        fontSize={14}
                                        fontFamily="Nunito_600SemiBold"
                                        color={isDark ? '#9ca3af' : '#4b5563'}
                                    >
                                        Session summary • {accuracyValue.toFixed(1)}% accuracy
                                    </Text>
                                </YStack>
                            </XStack>

                            <XStack gap="$3" mt="$1">
                                <YStack f={1} bg={isDark ? '#020617' : '#ffffff'} br={16} p="$3" gap="$1.5">
                                    <Text
                                        fontSize={12}
                                        fontFamily="Nunito_700Bold"
                                        color={isDark ? '#9ca3af' : '#6b7280'}
                                    >
                                        QUESTIONS
                                    </Text>
                                    <Text
                                        fontSize={20}
                                        fontFamily="Nunito_900Black"
                                        color={isDark ? '#e5e7eb' : '#111827'}
                                    >
                                        {correctAnswers}/{questionsAttempted}
                                    </Text>
                                </YStack>

                                <YStack f={1} bg={isDark ? '#020617' : '#ffffff'} br={16} p="$3" gap="$1.5">
                                    <Text
                                        fontSize={12}
                                        fontFamily="Nunito_700Bold"
                                        color={isDark ? '#9ca3af' : '#6b7280'}
                                    >
                                        XP EARNED
                                    </Text>
                                    <Text
                                        fontSize={20}
                                        fontFamily="Nunito_900Black"
                                        color={isDark ? '#e5e7eb' : '#111827'}
                                    >
                                        +{xpEarned}
                                    </Text>
                                </YStack>
                            </XStack>
                        </YStack>
                    </Animated.View>

                    <YStack gap="$3" w="100%">
                        {stats.map((stat, index) => (
                            <Animated.View
                                key={stat.label}
                                entering={FadeInDown.delay(350 + index * 100).duration(400)}
                            >
                                <XStack
                                    bg={isDark ? '#020617' : '#ffffff'}
                                    p="$3.5"
                                    br={16}
                                    ai="center"
                                    jc="space-between"
                                    borderWidth={1}
                                    borderColor={isDark ? '#1f2937' : '#e5e7eb'}
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: isDark ? 0 : 0.04,
                                        shadowRadius: 6,
                                        elevation: 1,
                                    }}
                                >
                                    <XStack ai="center" gap="$3">
                                        <YStack
                                            w={36}
                                            h={36}
                                            br={9999}
                                            bg={`${stat.color}18`}
                                            ai="center"
                                            jc="center"
                                        >
                                            <MaterialCommunityIcons
                                                name={stat.icon as any}
                                                size={18}
                                                color={stat.color}
                                            />
                                        </YStack>

                                        <Text
                                            fontSize={14}
                                            fontFamily="Nunito_700Bold"
                                            color={isDark ? '#e5e7eb' : '#4b5563'}
                                        >
                                            {stat.label}
                                        </Text>
                                    </XStack>

                                    <Text
                                        fontSize={18}
                                        fontFamily="Nunito_900Black"
                                        color={isDark ? '#ffffff' : '#111827'}
                                    >
                                        {stat.value}
                                    </Text>
                                </XStack>
                            </Animated.View>
                        ))}
                    </YStack>

                    <Animated.View
                        entering={FadeIn.delay(800).duration(400)}
                        style={{ width: '100%' }}
                    >
                        <Button
                            size="$5"
                            bg={performanceColor}
                            onPress={onContinue}
                            pressStyle={{ scale: 0.98 }}
                            br={16}
                            h={56}
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
            </YStack>
        </Modal>
    );
}
