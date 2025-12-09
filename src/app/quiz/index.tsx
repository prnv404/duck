import { useColorScheme } from '@/hooks/use-color-scheme';
import { useQuizState } from '@/hooks/useQuizState';
import { useQuizAudio } from '@/hooks/useQuizAudio';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, SlideInRight, SlideOutLeft, FadeInUp, FadeOutDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text, Button, XStack } from 'tamagui';
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

    const [audioEnabled, setAudioEnabled] = useState(true);
    const [audioSpeed, setAudioSpeed] = useState(1.0);

    const audio = useQuizAudio({
        audioUrl: quiz.currentQuestion?.audioUrl,
        isEnabled: audioEnabled,
        autoPlay: true,
        speed: audioSpeed,
    });

    // Load audio preference from AsyncStorage on mount
    useEffect(() => {
        const loadAudioPreference = async () => {
            try {
                const savedEnabled = await AsyncStorage.getItem('quizAudioEnabled');
                if (savedEnabled !== null) {
                    setAudioEnabled(savedEnabled === 'true');
                }

                const savedSpeed = await AsyncStorage.getItem('quizAudioSpeed');
                if (savedSpeed !== null) {
                    setAudioSpeed(parseFloat(savedSpeed));
                }
            } catch (error) {
                console.error('Error loading audio preference:', error);
                // Continue with default value (true)
            }
        };
        loadAudioPreference();
    }, []);

    const [showStartScreen, setShowStartScreen] = useState(false); // Disabled countdown screen
    const [showCompletionScreen, setShowCompletionScreen] = useState(false);
    const [sessionCompletionData, setSessionCompletionData] = useState<any>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isFinishingSession, setIsFinishingSession] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [exitProcessing, setExitProcessing] = useState(false);

    const handleStartComplete = () => {
        setShowStartScreen(false);
    };

    const handleToggleAudio = async () => {
        await Haptics.selectionAsync();
        const newValue = !audioEnabled;
        setAudioEnabled(newValue);

        // Persist preference to AsyncStorage
        try {
            await AsyncStorage.setItem('quizAudioEnabled', newValue.toString());
        } catch (error) {
            console.error('Error saving audio preference:', error);
        }

        if (audioEnabled) {
            audio.stop();
        }
    };

    const handleToggleSpeed = async () => {
        await Haptics.selectionAsync();
        // Cycle through speeds: 1.0 -> 1.25 -> 1.5 -> 0.75 -> 1.0
        let newSpeed = 1.0;
        if (audioSpeed === 1.0) newSpeed = 1.25;
        else if (audioSpeed === 1.25) newSpeed = 1.5;
        else if (audioSpeed === 1.5) newSpeed = 0.75;
        else newSpeed = 1.0;

        setAudioSpeed(newSpeed);

        try {
            await AsyncStorage.setItem('quizAudioSpeed', newSpeed.toString());
        } catch (error) {
            console.error('Error saving audio speed:', error);
        }
    };

    const handleReplayAudio = () => {
        audio.replay();
    };

    const handleExit = async () => {
        await Haptics.selectionAsync();
        setShowExitDialog(true);
    };

    const handleConfirmExit = async () => {
        if (exitProcessing) return;

        setExitProcessing(true);
        try {
            if (quiz.totalQuestions > 0) {
                await quiz.completeSession();
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error('Error exiting quiz:', error);
            router.replace('/(tabs)/home');
        } finally {
            setExitProcessing(false);
            setShowExitDialog(false);
        }
    };

    const handleCheck = async () => {
        // Stop audio when user submits answer
        audio.stop();
        await quiz.handleCheck();
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
        // First hide the completion screen
        setShowCompletionScreen(false);

        // Use push with reset to clear the navigation stack
        // This prevents the back button from returning to the quiz screen
        router.dismissAll();
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
                <YStack f={1} ai="center" jc="center" px="$5" gap="$6">

                    {/* Hero Icon with Animation */}
                    <Animated.View entering={ZoomIn.duration(600).springify()}>
                        <YStack
                            w={140}
                            h={140}
                            bg={isDark ? '#064e3b' : '#d1fae5'}
                            br={70}
                            ai="center"
                            jc="center"
                            style={{
                                shadowColor: '#10b981',
                                shadowOpacity: 0.3,
                                shadowRadius: 16,
                                elevation: 8,
                                borderWidth: 4,
                                borderColor: '#10b981'
                            }}
                        >
                            <MaterialCommunityIcons
                                name="check-decagram"
                                size={72}
                                color="#10b981"
                            />
                        </YStack>
                    </Animated.View>

                    <YStack ai="center" gap="$3" maxWidth={320}>
                        <Animated.View entering={FadeInUp.delay(200).springify()}>
                            <Text
                                fontSize={28}
                                fontFamily="Nunito_900Black"
                                color={isDark ? '#f8fafc' : '#0f172a'}
                                textAlign="center"
                                lineHeight={34}
                            >
                                Mode Conquered!
                            </Text>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(300).springify()}>
                            <Text
                                fontSize={16}
                                fontFamily="Nunito_600SemiBold"
                                color={isDark ? '#94a3b8' : '#64748b'}
                                textAlign="center"
                                lineHeight={24}
                            >
                                You've reached the end of this mode! We'll add more questions shortly.
                            </Text>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(400).springify()}>
                            <YStack bg={isDark ? '#1e293b' : '#f1f5f9'} p="$3" br={12} mt="$2">
                                <Text
                                    fontSize={14}
                                    fontFamily="Nunito_600SemiBold"
                                    color={isDark ? '#cbd5e1' : '#475569'}
                                    textAlign="center"
                                >
                                    💡 Tip: Try a different mode to keep your streak alive while we cook up more challenges for this one.
                                </Text>
                            </YStack>
                        </Animated.View>
                    </YStack>

                    <Animated.View entering={FadeInUp.delay(500).springify()} style={{ width: '100%', maxWidth: 280 }}>
                        <Button
                            size="$5"
                            bg="#0891b2"
                            color="white"
                            fontFamily="Nunito_800ExtraBold"
                            pressStyle={{ scale: 0.96, opacity: 0.9 }}
                            onPress={() => router.replace('/(tabs)/home')}
                            br={16}
                            h={56}
                            borderBottomWidth={4}
                            borderColor="#0e7490"
                            icon={<MaterialCommunityIcons name="home-variant" size={24} color="white" />}
                        >
                            Back to Home
                        </Button>
                    </Animated.View>

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
                    audioEnabled={audioEnabled}
                    onToggleAudio={handleToggleAudio}
                    audioSpeed={audioSpeed}
                    onToggleSpeed={handleToggleSpeed}
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
                            audioUrl={quiz.currentQuestion.audioUrl}
                            onReplay={handleReplayAudio}
                            topicName={quiz.currentQuestion.topicName}
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
                    bg={quiz.hasAnswered ? (quiz.isCorrect ? (isDark ? '#1e3a32' : '#d1fae5') : (isDark ? '#3a1e1e' : '#fee2e2')) : 'transparent'}
                >
                    {quiz.hasAnswered && (
                        <>
                            {quiz.isCorrect ? (
                                <YStack gap="$2.5" mb="$3">
                                    {/* Feedback Section */}
                                    <Animated.View entering={FadeInUp.duration(250).springify()}>
                                        <FeedbackSection
                                            questionFeedback={quiz.questionFeedback}
                                            showFeedbackOptions={quiz.showFeedbackOptions}
                                            feedbackReason={quiz.feedbackReason}
                                            onFeedback={quiz.handleFeedback}
                                            onFeedbackReason={quiz.handleFeedbackReason}
                                            isDark={isDark}
                                        />
                                    </Animated.View>

                                    {/* Result Message */}
                                    <Animated.View entering={FadeInUp.delay(100).duration(250).springify()}>
                                        <ResultMessage
                                            isCorrect={quiz.isCorrect}
                                            correctAnswer={quiz.currentQuestion.correctAnswer}
                                            explanation={quiz.currentQuestion.explanation}
                                            isDark={isDark}
                                        />
                                    </Animated.View>
                                </YStack>
                            ) : (
                                <YStack gap="$2.5" mb="$3">
                                    {/* Result Message */}
                                    <Animated.View entering={FadeInUp.duration(250).springify()}>
                                        <ResultMessage
                                            isCorrect={quiz.isCorrect}
                                            correctAnswer={quiz.currentQuestion.correctAnswer}
                                            explanation={quiz.currentQuestion.explanation}
                                            isDark={isDark}
                                        />
                                    </Animated.View>

                                    {/* Feedback Section for incorrect answers */}
                                    <Animated.View entering={FadeInUp.delay(100).duration(250).springify()}>
                                        <FeedbackSection
                                            questionFeedback={quiz.questionFeedback}
                                            showFeedbackOptions={quiz.showFeedbackOptions}
                                            feedbackReason={quiz.feedbackReason}
                                            onFeedback={quiz.handleFeedback}
                                            onFeedbackReason={quiz.handleFeedbackReason}
                                            isDark={isDark}
                                        />
                                    </Animated.View>
                                </YStack>
                            )}
                        </>
                    )}

                    <QuizFooter
                        hasAnswered={quiz.hasAnswered}
                        isCorrect={quiz.isCorrect}
                        selectedOption={quiz.selectedOption}
                        isSubmitting={quiz.isSubmitting}
                        isLastQuestion={quiz.currentQuestionIndex === quiz.totalQuestions - 1}
                        isFinishing={isFinishingSession}
                        onCheck={handleCheck}
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
            />

            <ExitQuizDialog
                visible={showExitDialog}
                isDark={isDark}
                loading={exitProcessing}
                onCancel={() => {
                    if (!exitProcessing) {
                        setShowExitDialog(false);
                    }
                }}
                onConfirm={handleConfirmExit}
            />
        </>
    );
}

interface ExitDialogProps {
    visible: boolean;
    isDark: boolean;
    loading: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ExitQuizDialog: React.FC<ExitDialogProps> = ({ visible, isDark, loading, onCancel, onConfirm }) => {
    const accent = '#ef4444';
    const accentBg = isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.12)';
    const subText = isDark ? '#999999' : '#666666';
    const bg = isDark ? '#000000' : '#ffffff';

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={styles.exitOverlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} disabled={loading} />

                <Animated.View entering={FadeInUp.springify()} exiting={FadeOutDown} style={{ width: '88%', maxWidth: 320 }}>
                    <YStack
                        bg={bg}
                        borderRadius={24}
                        padding="$5"
                        gap="$4"
                        shadowColor="rgba(15,23,42,0.5)"
                        shadowOffset={{ width: 0, height: 18 }}
                        shadowOpacity={0.6}
                        shadowRadius={32}
                        elevation={24}
                    >
                        <YStack ai="center" gap="$3">
                            <YStack
                                width={64}
                                height={64}
                                borderRadius={18}
                                backgroundColor={accentBg}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <MaterialCommunityIcons name="flag-outline" size={30} color={accent} />
                            </YStack>

                            <YStack gap="$2" w="100%" ai="center">
                                <Text fontSize={20} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#000000'}>
                                    Leave this quiz?
                                </Text>
                                <Text
                                    fontSize={15}
                                    fontFamily="Nunito_600SemiBold"
                                    color={subText}
                                    textAlign="center"
                                >
                                    This session will not add to your streak or give you any XP.
                                </Text>
                            </YStack>
                        </YStack>

                        <XStack gap="$3">
                            <Button
                                flex={1}
                                height={48}
                                borderRadius={24}
                                backgroundColor={isDark ? '#1a1a1a' : '#f0f0f0'}
                                color={isDark ? '#ffffff' : '#000000'}
                                fontFamily="Nunito_800ExtraBold"
                                onPress={onCancel}
                                disabled={loading}
                                opacity={loading ? 0.6 : 1}
                                pressStyle={{ scale: 0.98, opacity: 0.9 }}
                            >
                                Cancel
                            </Button>

                            <Button
                                flex={1}
                                height={48}
                                borderRadius={24}
                                backgroundColor={accent}
                                color="#ffffff"
                                fontFamily="Nunito_900Black"
                                onPress={onConfirm}
                                disabled={loading}
                                opacity={loading ? 0.6 : 1}
                                pressStyle={{ scale: 0.98, opacity: 0.9 }}
                            >
                                {loading ? 'Exiting...' : 'Exit'}
                            </Button>
                        </XStack>
                    </YStack>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    exitOverlay: {
        flex: 1,
        backgroundColor: 'rgba(2,6,23,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
});
