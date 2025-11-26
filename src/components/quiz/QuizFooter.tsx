import React from 'react';
import { Button, Text, YStack } from 'tamagui';

interface QuizFooterProps {
    hasAnswered: boolean;
    isCorrect: boolean;
    selectedOption: string | null;
    onCheck: () => void;
    onContinue: () => void;
    isDark: boolean;
}

export const QuizFooter: React.FC<QuizFooterProps> = ({
    hasAnswered,
    isCorrect,
    selectedOption,
    onCheck,
    onContinue,
    isDark
}) => {
    return (
        <YStack
            p="$3.5"
            pb="$5"
            bg={hasAnswered ? (isCorrect ? (isDark ? '#052e16' : '#dcfce7') : (isDark ? '#450a0a' : '#fee2e2')) : 'transparent'}
        >
            <Button
                size="$5"
                bg={hasAnswered
                    ? (isCorrect ? '#58cc02' : (isDark ? '#ef4444' : '#ff4b4b'))
                    : (selectedOption ? '#58cc02' : (isDark ? '#374151' : '#e5e7eb'))
                }
                disabled={!selectedOption}
                onPress={hasAnswered ? onContinue : onCheck}
                pressStyle={{ scale: 0.98, borderBottomWidth: 0, marginTop: 3 }}
                br={14}
                borderBottomWidth={3}
                borderColor={hasAnswered
                    ? (isCorrect ? '#46a302' : (isDark ? '#b91c1c' : '#ea2b2b'))
                    : (selectedOption ? '#46a302' : (isDark ? '#1f2937' : '#d1d5db'))
                }
                h={52}
            >
                <Text
                    fontSize={18}
                    fontFamily="Nunito_800ExtraBold"
                    color={!selectedOption && !hasAnswered ? (isDark ? '#6b7280' : '#9ca3af') : '#ffffff'}
                    textTransform="uppercase"
                    letterSpacing={0.5}
                >
                    {hasAnswered ? 'Continue' : 'Check'}
                </Text>
            </Button>
        </YStack>
    );
};
