import { useColorScheme } from '@/hooks/use-color-scheme';
import { useQuizState } from '@/hooks/useQuizState';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import Animated, { ZoomIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    FeedbackSection,
    OptionsGrid,
    QuestionCard,
    QuizFooter,
    QuizHeader,
    ResultMessage
} from '@/components/quiz';
import SessionStartScreen from '@/components/quiz/SessionStartScreen';
import SessionCompletionScreen from '@/components/quiz/SessionCompletionScreen';
import { practiceAPI } from '@/services/practice.api';
import * as Haptics from 'expo-haptics';

export default function QuizScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const mode = typeof params.mode === 'string' ? params.mode : 'balanced';
    const subjectId = typeof params.subjectId === 'string' ? params.subjectId : undefined;

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const subjectIds = subjectId ? [subjectId] : undefined;
    const quiz = useQuizState(mode, subjectIds);

    const [showStartScreen, setShowStartScreen] = useState(true);
    const [showCompletionScreen, setShowCompletionScreen] = useState(false);
    const [sessionCompletionData, setSessionCompletionData] = useState<any>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isFinishingSession, setIsFinishingSession] = useState(false);

    const handleStartComplete = () => {
        setShowStartScreen(false);
    };

    const handleExit = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            'Exit Quiz?',
            'Your current practice session will be wrapped up. Do you want to exit?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Exit',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (quiz.totalQuestions > 0) {
                                await quiz.completeSession();
                                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            }
                            router.replace('/(tabs)/home');
                        } catch (error) {
                            console.error('Error exiting quiz:', error);
                            router.replace('/(tabs)/home');
                        }
                    },
                },
            ]
        );
    };

    const handleContinue = async () => {
        const isLast = quiz.currentQuestionIndex === quiz.totalQuestions - 1;

        if (isLast) {
            setIsFinishingSession(true);
        }

        const result = await quiz.handleContinue();

        if (result.isLastQuestion) {
            if (result.completionData) {
                setSessionCompletionData(result.completionData);
                setShowCompletionScreen(true);
            } else {
                // Fallback if no completion data
                router.replace('/(tabs)/home');
            }
        }

        if (isLast) {
            setIsFinishingSession(false);
        }
    };

    const handleCompletionContinue = () => {
        setShowCompletionScreen(false);
        router.replace('/(tabs)/home');
    };

    if (quiz.loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
                <Text mt="$4" color={isDark ? '$gray8' : '$gray11'}>Preparing your quiz...</Text>
            </SafeAreaView>
        );
    }

    if (quiz.initError) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }}>
                <Stack.Screen options={{ headerShown: false }} />
                <YStack f={1} ai="center" jc="center" px="$5" gap="$4">
                    <YStack
                        bg={isDark ? '#111827' : '#f1f5f9'}
                        br={24}
                        p="$4.5"
                        w="100%"
                        maxWidth={360}
                        borderWidth={1}
                        borderColor={isDark ? '#1f2937' : '#e5e7eb'}
                        gap="$3.5"
                    >
                        <YStack ai="center" gap="$2">
                            <MaterialCommunityIcons
                                name="controller-classic-outline"
                                size={28}
                                color={isDark ? '#38bdf8' : '#0f766e'}
                            />
                            <Text
                                fontSize={24}
                                fontFamily="Nunito_900Black"
                                color={isDark ? '#e5e7eb' : '#0f172a'}
                                textAlign="center"
                            >
                                You cleared this mode!
                            </Text>
                        </YStack>

                        <Text
                            fontSize={14}
                            fontFamily="Nunito_700Bold"
                            color={isDark ? '#9ca3af' : '#4b5563'}
                            textAlign="center"
                        >
                            There aren’t enough questions here right now. That’s a good sign — you’re ahead of the queue.
                        </Text>

                        <Text
                            fontSize={12}
                            fontFamily="Nunito_600SemiBold"
                            color={isDark ? '#6b7280' : '#6b7280'}
                            textAlign="center"
                        >
                            Jump into another practice mode while we cook up more challenges for this one.
                        </Text>
                    </YStack>

                    <YStack gap="$2" w="100%" maxWidth={260}>
                        <Text
                            onPress={() => router.replace('/(tabs)/home')}
                            fontSize={15}
                            fontFamily="Nunito_800ExtraBold"
                            color={isDark ? '#38bdf8' : '#0284c7'}
                            textAlign="center"
                        >
                            Back to Home
                        </Text>
                    </YStack>
                </YStack>
            </SafeAreaView>
        );
    }

    // If no questions loaded and not loading, show error or empty state (handled in hook via Alert, but good to have fallback UI)
    if (!quiz.totalQuestions) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text color={isDark ? '$gray8' : '$gray11'}>No questions available.</Text>
                <Text color="$blue10" onPress={() => router.back()} mt="$4">Go Back</Text>
            </SafeAreaView>
        );
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }} edges={['top', 'left', 'right']}>
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <QuizHeader
                    currentQuestion={quiz.currentQuestionIndex}
                    totalQuestions={quiz.totalQuestions}
                    onClose={handleExit}
                    isDark={isDark}
                />

                {/* Scrollable Content */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 28, paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Question with slide animation */}
                    <Animated.View
                        key={`question-${quiz.currentQuestionIndex}`}
                        entering={SlideInRight.duration(300).springify()}
                        exiting={SlideOutLeft.duration(200)}
                    >
                        <QuestionCard
                            question={quiz.currentQuestion.question}
                            currentIndex={quiz.currentQuestionIndex}
                            totalQuestions={quiz.totalQuestions}
                            isDark={isDark}
                        />
                    </Animated.View>

                    {/* Character Animation Placeholder */}
                    <YStack h={0} ai="center" jc="center" mb="$3">
                        {/* Reserved space for future character animation */}
                    </YStack>

                    {/* Options with slide animation */}
                    <Animated.View
                        key={`options-${quiz.currentQuestionIndex}`}
                        entering={SlideInRight.delay(100).duration(300).springify()}
                        exiting={SlideOutLeft.duration(200)}
                        style={{ marginTop: 32 }}
                    >
                        <OptionsGrid
                            options={quiz.currentQuestion.options}
                            selectedOption={quiz.selectedOption}
                            correctAnswer={quiz.currentQuestion.correctAnswer}
                            hasAnswered={quiz.hasAnswered}
                            onSelect={quiz.handleOptionPress}
                            isDark={isDark}
                        />
                    </Animated.View>
                </ScrollView>

                {/* Footer */}
                <YStack
                    p="$3.5"
                    pb="$5"
                    bg={quiz.hasAnswered ? (quiz.isCorrect ? (isDark ? '#052e16' : '#dcfce7') : (isDark ? '#450a0a' : '#fee2e2')) : 'transparent'}
                >
                    {quiz.hasAnswered && (
                        <Animated.View entering={ZoomIn.duration(300)}>
                            {quiz.isCorrect ? (
                                <YStack gap="$2.5" mb="$3">
                                    {/* Feedback Section */}
                                    <FeedbackSection
                                        questionFeedback={quiz.questionFeedback}
                                        showFeedbackOptions={quiz.showFeedbackOptions}
                                        feedbackReason={quiz.feedbackReason}
                                        onFeedback={quiz.handleFeedback}
                                        onFeedbackReason={quiz.handleFeedbackReason}
                                        isDark={isDark}
                                    />

                                    {/* Result Message */}
                                    <ResultMessage
                                        isCorrect={quiz.isCorrect}
                                        correctAnswer={quiz.currentQuestion.correctAnswer}
                                        explanation={quiz.currentQuestion.explanation}
                                        isDark={isDark}
                                    />
                                </YStack>
                            ) : (
                                <YStack gap="$2.5" mb="$3">
                                    <ResultMessage
                                        isCorrect={quiz.isCorrect}
                                        correctAnswer={quiz.currentQuestion.correctAnswer}
                                        explanation={quiz.currentQuestion.explanation}
                                        isDark={isDark}
                                    />
                                </YStack>
                            )}
                        </Animated.View>
                    )}

                    <QuizFooter
                        hasAnswered={quiz.hasAnswered}
                        isCorrect={quiz.isCorrect}
                        selectedOption={quiz.selectedOption}
                        isSubmitting={quiz.isSubmitting}
                        isLastQuestion={quiz.currentQuestionIndex === quiz.totalQuestions - 1}
                        isFinishing={isFinishingSession}
                        onCheck={quiz.handleCheck}
                        onContinue={handleContinue}
                        isDark={isDark}
                    />
                </YStack>
            </SafeAreaView>

            {/* Session Start Screen */}
            <SessionStartScreen
                visible={showStartScreen}
                mode={mode}
                topicName={undefined} // Can pass topic name if available
                onComplete={handleStartComplete}
                isDark={isDark}
            />

            {/* Session Completion Screen */}
            <SessionCompletionScreen
                visible={showCompletionScreen}
                sessionData={sessionCompletionData}
                onContinue={handleCompletionContinue}
                isDark={isDark}
            />
        </>
    );
}
