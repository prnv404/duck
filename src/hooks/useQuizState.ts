import * as Haptics from 'expo-haptics';
import { Audio as ExpoAvAudio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';
import { practiceAPI, QuestionResponseDto, QuestionPreferenceType } from '@/services/practice.api';
import { Alert } from 'react-native';

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
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

    // Refs to hold sound objects
    const correctSoundRef = useRef<ExpoAvAudio.Sound | null>(null);
    const incorrectSoundRef = useRef<ExpoAvAudio.Sound | null>(null);

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

    // Configure Audio Mode and Preload Sounds
    useEffect(() => {
        const setupAudio = async () => {
            try {
                // 1. Configure Audio Mode
                await ExpoAvAudio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });

                // 2. Preload Sounds
                const { sound: correctSound } = await ExpoAvAudio.Sound.createAsync(
                    require('../../assets/audio/correct.mp3')
                );
                correctSoundRef.current = correctSound;

                const { sound: incorrectSound } = await ExpoAvAudio.Sound.createAsync(
                    require('../../assets/audio/incorrect.mp3')
                );
                incorrectSoundRef.current = incorrectSound;

            } catch (error) {
                console.error('Error setting up audio:', error);
            }
        };

        setupAudio();

        // Cleanup: Unload sounds on unmount
        return () => {
            if (correctSoundRef.current) {
                correctSoundRef.current.unloadAsync();
            }
            if (incorrectSoundRef.current) {
                incorrectSoundRef.current.unloadAsync();
            }
        };
    }, []);

    const rawQuestion = questions[currentQuestionIndex];

    // Map API response to UI format
    const currentQuestion: Question | null = rawQuestion ? {
        id: rawQuestion.id,
        question: rawQuestion.questionText,
        options: rawQuestion.answerOptions.map(o => o.optionText),
        // We might not know the correct answer upfront in some modes, but for now let's assume we do 
        // or we handle it after submission. 
        // If the API doesn't return isCorrect for options (to prevent cheating), we rely on submit response.
        // For UI compatibility, let's try to find it if available, or empty string.
        correctAnswer: rawQuestion.answerOptions.find(o => o.isCorrect)?.optionText || '',
        explanation: rawQuestion.explanation
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

        // Play Sound based on local correctness
        try {
            const soundToPlay = locallyCorrect ? correctSoundRef.current : incorrectSoundRef.current;
            if (soundToPlay) {
                await soundToPlay.replayAsync();
            }
        } catch (error) {
            console.error('Error playing sound:', error);
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
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setHasAnswered(false);
            setIsCorrect(false);
            setQuestionFeedback(null);
            setShowFeedbackOptions(false);
            setFeedbackReason(null);
            setStartTime(Date.now());
            return { isLastQuestion: false };
        } else {
            // Complete session when finishing the last question
            const completionData = await completeSession();
            return { isLastQuestion: true, completionData };
        }
    };

    const handleFeedback = async (type: 'like' | 'dislike') => {
        await Haptics.selectionAsync();
        setQuestionFeedback(type);

        if (type === 'like') {
            setShowFeedbackOptions(false);
            setFeedbackReason(null);
            console.log('Question liked:', rawQuestion?.id);
        } else {
            setShowFeedbackOptions(true);
        }
    };

    const handleFeedbackReason = async (reason: string) => {
        await Haptics.selectionAsync();
        setFeedbackReason(reason);
        console.log('Question disliked:', rawQuestion?.id, 'Reason:', reason);
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
