import React from 'react';
import { ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
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
    // Only disable if no option selected or finishing session. Don't block on isSubmitting (async submission)
    const isDisabled = !selectedOption && !hasAnswered || isFinishing;

    return (
        <YStack
            p="$3.5"
            pb="$5"
            bg={hasAnswered ? (isCorrect ? (isDark ? '#1e3a32' : '#dcfce7') : (isDark ? '#3a1e1e' : '#fee2e2')) : 'transparent'}
        >
            <Animated.View style={{ width: '100%' }}>
                <Button
                    size="$5"
                    bg={hasAnswered
                        ? (isCorrect ? '#10b981' : '#ef4444')
                        : (selectedOption ? '#10b981' : (isDark ? '#475569' : '#cbd5e1'))
                    }
                    disabled={isDisabled}
                    onPress={hasAnswered ? onContinue : onCheck}
                    pressStyle={{ scale: 0.98, borderBottomWidth: 0, marginTop: 3 }}
                    br={14}
                    borderBottomWidth={3}
                    borderColor={hasAnswered
                        ? (isCorrect ? '#059669' : '#dc2626')
                        : (selectedOption ? '#059669' : (isDark ? '#334155' : '#94a3b8'))
                    }
                    h={52}
                    opacity={!selectedOption && !hasAnswered ? 0.6 : 1}
                >
                    {isFinishing ? (
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
                    ) : isSubmitting && !hasAnswered ? (
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
                    ) : (
                        <Text
                            fontSize={18}
                            fontFamily="Nunito_800ExtraBold"
                            color={!selectedOption && !hasAnswered ? (isDark ? '#64748b' : '#94a3b8') : '#ffffff'}
                            textTransform="uppercase"
                            letterSpacing={0.5}
                        >
                            {hasAnswered ? (isLastQuestion ? 'View Summary' : 'Continue') : 'Check'}
                        </Text>
                    )}
                </Button>
            </Animated.View>
        </YStack>
    );
};
