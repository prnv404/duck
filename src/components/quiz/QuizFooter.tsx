import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Text, YStack, XStack } from 'tamagui';

interface QuizFooterProps {
    hasAnswered: boolean;
    isCorrect: boolean;
    selectedOption: string | null;
    isSubmitting?: boolean;
    isLastQuestion?: boolean;
    isFinishing?: boolean;
    onCheck: () => void;
    onContinue: () => void;
    isDark: boolean;
}

export const QuizFooter: React.FC<QuizFooterProps> = ({
    hasAnswered,
    isCorrect,
    selectedOption,
    isSubmitting = false,
    isLastQuestion = false,
    isFinishing = false,
    onCheck,
    onContinue,
    isDark
}) => {
    const isDisabled = !selectedOption || isSubmitting || isFinishing;

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
                disabled={isDisabled}
                onPress={hasAnswered ? onContinue : onCheck}
                pressStyle={{ scale: 0.98, borderBottomWidth: 0, marginTop: 3 }}
                br={14}
                borderBottomWidth={3}
                borderColor={hasAnswered
                    ? (isCorrect ? '#46a302' : (isDark ? '#b91c1c' : '#ea2b2b'))
                    : (selectedOption ? '#46a302' : (isDark ? '#1f2937' : '#d1d5db'))
                }
                h={52}
                opacity={isDisabled && !hasAnswered ? 0.6 : 1}
            >
                {isSubmitting ? (
                    <XStack ai="center" gap="$2">
                        <ActivityIndicator size="small" color="#ffffff" />
                        <Text
                            fontSize={18}
                            fontFamily="Nunito_800ExtraBold"
                            color="#ffffff"
                            textTransform="uppercase"
                            letterSpacing={0.5}
                        >
                            Checking...
                        </Text>
                    </XStack>
                ) : isFinishing ? (
                    <XStack ai="center" gap="$2">
                        <ActivityIndicator size="small" color="#ffffff" />
                        <Text
                            fontSize={18}
                            fontFamily="Nunito_800ExtraBold"
                            color="#ffffff"
                            textTransform="uppercase"
                            letterSpacing={0.5}
                        >
                            Finishing...
                        </Text>
                    </XStack>
                ) : (
                    <Text
                        fontSize={18}
                        fontFamily="Nunito_800ExtraBold"
                        color={!selectedOption && !hasAnswered ? (isDark ? '#6b7280' : '#9ca3af') : '#ffffff'}
                        textTransform="uppercase"
                        letterSpacing={0.5}
                    >
                        {hasAnswered ? (isLastQuestion ? 'View Summary' : 'Continue') : 'Check'}
                    </Text>
                )}
            </Button>
        </YStack>
    );
};
