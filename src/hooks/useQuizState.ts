import * as Haptics from 'expo-haptics';
import { useAudioPlayer, AudioSource, setAudioModeAsync } from 'expo-audio';
import { useState, useEffect, useMemo } from 'react';
import { practiceAPI, QuestionResponseDto, QuestionPreferenceType } from '@/services/practice.api';
import { Alert } from 'react-native';

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    audioUrl?: string;
    topicName?: string;
}


const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const useQuizState = (mode: string = 'balanced', subjectIds?: string[]) => {
    const [questions, setQuestions] = useState<QuestionResponseDto[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [questionFeedback, setQuestionFeedback] = useState<'like' | 'dislike' | null>(null);
    const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
    const [feedbackReason, setFeedbackReason] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initError, setInitError] = useState<{ code: 'NO_QUESTIONS' | 'GENERIC'; message: string } | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Audio players using expo-audio hooks for feedback sounds
    const correctSoundSource: AudioSource = useMemo(() => require('../../assets/audio/correct.mp3'), []);
    const incorrectSoundSource: AudioSource = useMemo(() => require('../../assets/audio/incorrect.mp3'), []);

    const correctPlayer = useAudioPlayer(correctSoundSource);
    const incorrectPlayer = useAudioPlayer(incorrectSoundSource);

    // Fetch questions on mount
    useEffect(() => {
        const initSession = async () => {
            try {
                setLoading(true);
                // Map string mode to enum, but force SUBJECT_FOCUS if subjectIds are provided
                let sessionType = QuestionPreferenceType.BALANCED;
                if (Object.values(QuestionPreferenceType).includes(mode as QuestionPreferenceType)) {
                    sessionType = mode as QuestionPreferenceType;
                }

                if (subjectIds && subjectIds.length > 0) {
                    sessionType = QuestionPreferenceType.SUBJECT_FOCUS;
                }

                const sessionPayload: any = {
                    sessionType,
                    subjectIds,
                };

                const session = await practiceAPI.createSession(sessionPayload);

                if (session && session.questions && session.questions.length > 0) {
                    const shuffledQuestions = session.questions.map((q) => ({
                        ...q,
                        answerOptions: shuffleArray(q.answerOptions),
                    }));
                    setQuestions(shuffledQuestions);
                    setSessionId(session.id);
                    setStartTime(Date.now());
                    setInitError(null);
                } else {
                }
            } catch (error: any) {
                // console.error('Failed to create session:', error);
                const status = error?.response?.status;
                const apiMessage = error?.response?.data?.message;

                if (status === 404) {
                    setInitError({
                        code: 'NO_QUESTIONS',
                        message: apiMessage || 'Not enough questions available for this mode yet.',
                    });
                } else {
                    const errorMessage = apiMessage || 'Failed to start quiz. Please check your connection.';
                    setInitError({ code: 'GENERIC', message: errorMessage });
                }
            } finally {
                setLoading(false);
            }
        };

        initSession();
    }, [mode, subjectIds?.join(',')]);

    // Configure Audio Mode using expo-audio
    useEffect(() => {
        const setupAudio = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    allowsRecording: false,
                });
            } catch (error) {
                console.error('Error setting up audio mode:', error);
                // Continue without audio - non-critical feature
            }
        };

        setupAudio();
    }, []);

    const rawQuestion = questions[currentQuestionIndex];

    // Map API response to UI format
    const currentQuestion: Question | null = rawQuestion ? {
        id: rawQuestion.id,
        question: rawQuestion.questionText,
        options: rawQuestion.answerOptions.map(o => o.optionText),
        correctAnswer: rawQuestion.answerOptions.find(o => o.isCorrect)?.optionText || '',
        explanation: rawQuestion.explanation,
        audioUrl: rawQuestion.audioUrl || undefined,
        topicName: rawQuestion.topicName,
    } : null;

    const totalQuestions = questions.length;

    const handleOptionPress = async (option: string) => {
        if (hasAnswered) return;

        await Haptics.selectionAsync();
        setSelectedOption(option);
    };

    const handleCheck = async () => {
        if (!selectedOption || !sessionId || !rawQuestion || isSubmitting) return;

        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        // Find option ID for backend payload
        const selectedOptionObj = rawQuestion.answerOptions.find(o => o.optionText === selectedOption);
        if (!selectedOptionObj) {
            return;
        }

        // 1) Compute correctness locally for instant UX
        let locallyCorrect = false;
        if (currentQuestion?.correctAnswer) {
            locallyCorrect = selectedOption === currentQuestion.correctAnswer;
        } else {
            // Fallback if for some reason correctAnswer is empty but isCorrect flags exist
            locallyCorrect = !!rawQuestion.answerOptions.find(o => o.optionText === selectedOption && o.isCorrect);
        }

        setIsCorrect(locallyCorrect);
        setHasAnswered(true);

        // Play Sound based on local correctness using expo-audio
        try {
            // Stop both players first to prevent overlap
            try {
                correctPlayer.pause();
                incorrectPlayer.pause();
            } catch (e) {
                // Ignore pause errors - player might not be playing
            }

            const playerToUse = locallyCorrect ? correctPlayer : incorrectPlayer;

            // Small delay to ensure cleanup, then play
            setTimeout(() => {
                try {
                    playerToUse.seekTo(0);
                    playerToUse.play();
                } catch (playError) {
                    console.warn('Could not play feedback sound:', playError);
                }
            }, 50);
        } catch (error) {
            console.error('Error playing sound:', error);
            // Continue without audio - non-critical feature
        }

        // Strong Haptic Feedback based on local correctness
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (locallyCorrect) {
            setScore(prev => prev + 1);
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // 2) Submit answer in the background (non-blocking)
        setIsSubmitting(true);
        (async () => {
            try {
                await practiceAPI.submitAnswer(sessionId, {
                    questionId: rawQuestion.id,
                    selectedOptionId: selectedOptionObj.id,
                    timeSpentSeconds: timeSpent
                });
            } catch (error: any) {
                console.error('Error submitting answer:', error);
                const errorMessage = error?.response?.data?.message || 'Failed to submit answer. Please try again.';
                Alert.alert('Error', errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        })();
    };

    const completeSession = async (): Promise<any | undefined> => {
        if (!sessionId) return undefined;

        try {
            const completionData = await practiceAPI.completeSession(sessionId);
            console.log(
                'session',
                completionData
            )
            return completionData;
        } catch (error) {
            console.error('Error completing session:', error);
            return undefined;
        }
    };

    const handleContinue = async (): Promise<{ isLastQuestion: boolean; completionData?: any }> => {
        if (isTransitioning) return { isLastQuestion: false };
        setIsTransitioning(true);

        try {
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setHasAnswered(false);
                setIsCorrect(false);
                setQuestionFeedback(null);
                setShowFeedbackOptions(false);
                setFeedbackReason(null);
                setStartTime(Date.now());
                setIsTransitioning(false);
                return { isLastQuestion: false };
            } else {
                // Complete session when finishing the last question
                const completionData = await completeSession();
                setIsTransitioning(false);
                return { isLastQuestion: true, completionData };
            }
        } catch (error) {
            console.error('Error in handleContinue:', error);
            setIsTransitioning(false);
            return { isLastQuestion: false };
        }
    };

    const handleFeedback = async (type: 'like' | 'dislike') => {
        await Haptics.selectionAsync();
        setQuestionFeedback(type);

        if (type === 'like') {
            setShowFeedbackOptions(false);
            setFeedbackReason(null);

            // Call API to update upvote
            if (sessionId && rawQuestion) {
                try {
                    await practiceAPI.updateQuestionVote(rawQuestion.id, 'upvote');
                } catch (error) {
                    console.error('Error updating question vote:', error);
                }
            }
        } else {
            setShowFeedbackOptions(true);
        }
    };

    const handleFeedbackReason = async (reason: string) => {
        await Haptics.selectionAsync();
        setFeedbackReason(reason);

        // Call API to update downvote with reason
        if (sessionId && rawQuestion) {
            try {
                await practiceAPI.updateQuestionVote(rawQuestion.id, 'downvote', reason);
            } catch (error) {
                console.error('Error updating question vote:', error);
            }
        }
    };

    return {
        // State
        currentQuestionIndex,
        selectedOption,
        hasAnswered,
        isCorrect,
        score,
        questionFeedback,
        showFeedbackOptions,
        feedbackReason,
        currentQuestion: currentQuestion || { id: '', question: '', options: [], correctAnswer: '' }, // Fallback
        totalQuestions,
        loading,
        isSubmitting,
        initError,
        isTransitioning,

        // Handlers
        handleOptionPress,
        handleCheck,
        handleContinue,
        handleFeedback,
        handleFeedbackReason,
        // Session
        completeSession,
    };
};