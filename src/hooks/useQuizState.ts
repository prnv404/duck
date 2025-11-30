import * as Haptics from 'expo-haptics';
import { useAudioPlayer, AudioSource, setAudioModeAsync } from 'expo-audio';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef, useMemo } from 'react';
import { practiceAPI, QuestionResponseDto, QuestionPreferenceType } from '@/services/practice.api';
import { Alert } from 'react-native';

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    audioUrl?: string | null;
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
    const [isMuted, setIsMuted] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // Audio players using expo-audio hooks
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

    // Configure Audio Mode
    useEffect(() => {
        const setupAudio = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    allowsRecording: false,
                });
                // Also setup expo-av just in case, though they might share underlying session
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                });
            } catch (error) {
                console.error('Error setting up audio mode:', error);
                // Continue without audio - non-critical feature
            }
        };

        const loadMutePreference = async () => {
            try {
                const storedMute = await AsyncStorage.getItem('quiz_audio_muted');
                if (storedMute !== null) {
                    setIsMuted(storedMute === 'true');
                }
            } catch (error) {
                console.error('Error loading mute preference:', error);
            }
        };

        setupAudio();
        loadMutePreference();
    }, []);

    const toggleMute = async () => {
        const newValue = !isMuted;
        setIsMuted(newValue);
        try {
            await AsyncStorage.setItem('quiz_audio_muted', String(newValue));
            if (newValue && sound) {
                await sound.stopAsync();
            } else if (!newValue && currentQuestion?.audioUrl) {
                // If unmuting and there is a current question with audio, play it
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: currentQuestion.audioUrl },
                    { shouldPlay: true }
                );
                setSound(newSound);
            }
        } catch (error) {
            console.error('Error saving mute preference:', error);
        }
    };

    // Cleanup sound on unmount
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

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
        explanation: rawQuestion.explanation,
        audioUrl: rawQuestion.audioUrl
    } : null;

    const playQuestionAudio = async () => {
        try {
            if (!currentQuestion?.audioUrl || isMuted) {
                return;
            }

            // If we already have a sound loaded, restart it from the beginning
            if (sound) {
                try {
                    await sound.stopAsync();
                } catch {
                    // ignore stop errors and try to replay anyway
                }

                try {
                    await sound.setPositionAsync(0);
                    await sound.playAsync();
                    return;
                } catch (error) {
                    console.error('Error restarting question audio, reloading sound:', error);
                    // fallthrough to reload sound below
                }
            }

            // If no sound is loaded (or restart failed), load a fresh sound and play it
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: currentQuestion.audioUrl },
                { shouldPlay: true }
            );
            setSound(newSound);
        } catch (error) {
            console.error('Error playing question audio:', error);
        }
    };

    // Load audio when question changes, with race-safety for very fast navigation
    const prevQuestionIdRef = useRef<string | null>(null);
    const audioLoadIdRef = useRef(0);

    useEffect(() => {
        const loadAndPlayAudio = async () => {
            const questionId = currentQuestion?.id || null;

            // Only load new audio if question actually changed
            if (questionId === prevQuestionIdRef.current) {
                return;
            }

            prevQuestionIdRef.current = questionId;

            // Increment load id to invalidate any previous pending loads
            const loadId = ++audioLoadIdRef.current;

            // Unload previous sound snapshot, if any
            if (sound) {
                try {
                    await sound.unloadAsync();
                } catch (error) {
                    console.error('Error unloading sound:', error);
                }

                // If another load started while unloading, do not continue
                if (audioLoadIdRef.current !== loadId) {
                    return;
                }

                setSound(null);
            }

            // Load and play new audio if not muted and question has audio
            if (!isMuted && currentQuestion?.audioUrl && questionId) {
                try {
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: currentQuestion.audioUrl },
                        { shouldPlay: true }
                    );

                    // If a newer load was requested while this one was loading, discard this sound
                    if (audioLoadIdRef.current !== loadId) {
                        try {
                            await newSound.unloadAsync();
                        } catch (error) {
                            console.error('Error unloading stale sound:', error);
                        }
                        return;
                    }

                    setSound(newSound);
                } catch (error) {
                    console.error('Error loading/playing audio:', error);
                }
            }
        };

        loadAndPlayAudio();
    }, [currentQuestion?.id, isMuted]); // Trigger when question ID or mute changes

    const totalQuestions = questions.length;

    const handleOptionPress = async (option: string) => {
        if (hasAnswered) return;

        await Haptics.selectionAsync();
        setSelectedOption(option);
    };

    const handleCheck = async () => {
        if (!selectedOption || !sessionId || !rawQuestion || isSubmitting) return;

        // Immediately stop any ongoing question audio so only feedback sounds are heard
        if (sound) {
            try {
                await sound.stopAsync();
                await sound.setPositionAsync(0);
            } catch (error) {
                console.error('Error stopping question audio on check:', error);
            }
        }

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
            const playerToUse = locallyCorrect ? correctPlayer : incorrectPlayer;
            // Reset to beginning and play
            playerToUse.seekTo(0);
            playerToUse.play();
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
        isMuted,
        toggleMute,
        playQuestionAudio
    };
};
