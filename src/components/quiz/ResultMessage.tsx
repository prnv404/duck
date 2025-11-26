import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Circle, Text, XStack, YStack } from 'tamagui';

interface ResultMessageProps {
    isCorrect: boolean;
    correctAnswer: string;
    isDark: boolean;
}

export const ResultMessage: React.FC<ResultMessageProps> = ({
    isCorrect,
    correctAnswer,
    isDark
}) => {
    if (isCorrect) {
        return (
            <XStack ai="center" gap="$2.5">
                <Circle size={28} bg="#58cc02">
                    <MaterialCommunityIcons
                        name="check"
                        size={16}
                        color="#fff"
                    />
                </Circle>
                <YStack f={1}>
                    <Text
                        fontSize={20}
                        fontFamily="Nunito_900Black"
                        color="#58cc02"
                    >
                        Excellent!
                    </Text>
                </YStack>
            </XStack>
        );
    }

    return (
        <YStack gap="$2.5">
            {/* Explanation Section */}
            <YStack
                p="$3"
                bg={isDark ? '#1f2937' : '#fef3c7'}
                br={12}
            >
                <Text
                    fontSize={13}
                    fontFamily="Nunito_700Bold"
                    color={isDark ? '#fbbf24' : '#92400e'}
                    mb="$1.5"
                >
                    💡 Explanation
                </Text>
                <Text
                    fontSize={13}
                    fontFamily="Nunito_600SemiBold"
                    color={isDark ? '#d1d5db' : '#78350f'}
                    lineHeight={18}
                >
                    The correct answer is "{correctAnswer}". This is a placeholder for detailed explanation that will be added in the future.
                </Text>
            </YStack>

            {/* Incorrect Message */}
            <XStack ai="center" gap="$2.5">
                <Circle size={28} bg="#ef4444">
                    <MaterialCommunityIcons
                        name="close"
                        size={16}
                        color="#fff"
                    />
                </Circle>
                <YStack f={1}>
                    <Text
                        fontSize={20}
                        fontFamily="Nunito_900Black"
                        color="#ef4444"
                    >
                        Incorrect
                    </Text>
                    <Text fontSize={13} fontFamily="Nunito_700Bold" color={isDark ? '#f87171' : '#b91c1c'}>
                        Correct: {correctAnswer}
                    </Text>
                </YStack>
            </XStack>
        </YStack>
    );
};
