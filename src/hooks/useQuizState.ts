import * as Haptics from 'expo-haptics';
import { Audio as ExpoAudio } from 'expo-av';
import { useState } from 'react';

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
            const { sound } = await ExpoAudio.Sound.createAsync(
                correct
                    ? require('../../assets/audio/correct.mp3')
                    : require('../../assets/audio/incorrect.mp3')
            );
            await sound.playAsync();
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
