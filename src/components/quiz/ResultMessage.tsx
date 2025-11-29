import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Circle, Text, XStack, YStack } from 'tamagui';

interface ResultMessageProps {
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
    isDark: boolean;
}

export const ResultMessage: React.FC<ResultMessageProps> = ({
    isCorrect,
    correctAnswer,
    explanation,
    isDark
}) => {
    const hasExplanation = explanation && explanation.trim().length > 0;

    return (
        <YStack gap="$2.5">
            <YStack
                p="$3"
                bg={isDark ? '#111827' : '#ecfdf5'}
                br={12}
            >
                <Text
                    fontSize={13}
                    fontFamily="Nunito_700Bold"
                    color={isDark ? '#6ee7b7' : '#047857'}
                    mb="$1.5"
                >
                    💡 Why this answer is {isCorrect ? 'right' : 'wrong'}
                </Text>
                <Text
                    fontSize={13}
                    fontFamily="Nunito_600SemiBold"
                    color={isDark ? '#e5e7eb' : '#065f46'}
                    lineHeight={18}
                >
                    {hasExplanation
                        ? explanation
                        : `The correct option is "${correctAnswer}". We’ll add a detailed breakdown for this question soon.`}
                </Text>
            </YStack>

            <XStack ai="center" gap="$2.5">
                <Circle size={28} bg={isCorrect ? '#22c55e' : '#ef4444'}>
                    <MaterialCommunityIcons
                        name={isCorrect ? 'check' : 'close'}
                        size={16}
                        color="#fff"
                    />
                </Circle>
                <YStack f={1}>
                    <Text
                        fontSize={20}
                        fontFamily="Nunito_900Black"
                        color={isCorrect ? '#22c55e' : '#ef4444'}
                    >
                        {isCorrect ? 'Nice work!' : 'Incorrect'}
                    </Text>
                    {!isCorrect && (
                        <Text
                            fontSize={13}
                            fontFamily="Nunito_700Bold"
                            color={isDark ? '#fca5a5' : '#b91c1c'}
                        >
                            Correct: {correctAnswer}
                        </Text>
                    )}
                </YStack>
            </XStack>
        </YStack>
    );
};
