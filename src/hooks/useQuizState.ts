import * as Haptics from 'expo-haptics';
import { Audio as ExpoAvAudio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

export const useQuizState = (questions: Question[]) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [questionFeedback, setQuestionFeedback] = useState<'like' | 'dislike' | null>(null);
    const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
    const [feedbackReason, setFeedbackReason] = useState<string | null>(null);

    // Refs to hold sound objects
    const correctSoundRef = useRef<ExpoAvAudio.Sound | null>(null);
    const incorrectSoundRef = useRef<ExpoAvAudio.Sound | null>(null);

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

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    const handleOptionPress = async (option: string) => {
        if (hasAnswered) return;

        await Haptics.selectionAsync();
        setSelectedOption(option);
    };

    const handleCheck = async () => {
        if (!selectedOption) return;

        const correct = selectedOption === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setHasAnswered(true);

        // Play Sound
        try {
            const soundToPlay = correct ? correctSoundRef.current : incorrectSoundRef.current;
            if (soundToPlay) {
                // Reset to start before playing to allow replay
                await soundToPlay.replayAsync();
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }

        // Strong Haptic Feedback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        if (correct) {
            setScore(prev => prev + 1);
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleContinue = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setHasAnswered(false);
            setIsCorrect(false);
            setQuestionFeedback(null);
            setShowFeedbackOptions(false);
            setFeedbackReason(null);
            return false;
        }
        return true; // Indicates last question
    };

    const handleFeedback = async (type: 'like' | 'dislike') => {
        await Haptics.selectionAsync();
        setQuestionFeedback(type);

        if (type === 'like') {
            setShowFeedbackOptions(false);
            setFeedbackReason(null);
            // TODO: Send like feedback to backend
            console.log('Question liked:', currentQuestion.id);
        } else {
            setShowFeedbackOptions(true);
        }
    };

    const handleFeedbackReason = async (reason: string) => {
        await Haptics.selectionAsync();
        setFeedbackReason(reason);
        // TODO: Send dislike feedback with reason to backend
        console.log('Question disliked:', currentQuestion.id, 'Reason:', reason);
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
        currentQuestion,
        totalQuestions,

        // Handlers
        handleOptionPress,
        handleCheck,
        handleContinue,
        handleFeedback,
        handleFeedbackReason,
    };
};
