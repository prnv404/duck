import React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, XStack, YStack } from 'tamagui';

interface JourneySlideProps {
    isDark: boolean;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    step: number;
    totalSteps: number;
}

export const JourneySlide: React.FC<JourneySlideProps> = ({
    isDark,
    onNext,
    onBack,
    onSkip,
    step,
    totalSteps,
}) => {
    const insets = useSafeAreaInsets();

    const bgColor = isDark ? '#050505' : '#f8f7f2';
    const textColor = isDark ? '#ffffff' : '#18181b';
    const muted = isDark ? '#bfbfbf' : '#5a5a62';
    const accent = isDark ? '#fbbf24' : '#b45309';

    return (
        <YStack
            flex={1}
            backgroundColor={bgColor}
            paddingTop={insets.top + 32}
            paddingBottom={Math.max(insets.bottom, 24) + 24}
            paddingHorizontal={24}
        >
            <YStack flex={1} gap="$6">
                <XStack alignItems="center" justifyContent="space-between">
                    <Pressable onPress={onBack} hitSlop={12}>
                        <Text fontSize="$3" fontWeight="700" color={muted}>
                            ← Back
                        </Text>
                    </Pressable>
                    <Text fontSize="$2" color={muted} letterSpacing={2} textTransform="uppercase">
                        Step {step}/{totalSteps}
                    </Text>
                    <Pressable onPress={onSkip} hitSlop={12}>
                        <Text fontSize="$3" fontWeight="600" color={muted}>
                            Skip
                        </Text>
                    </Pressable>
                </XStack>

                <YStack gap="$2">
                    <Text fontSize="$2" color={muted} letterSpacing={2} textTransform="uppercase">
                        Daily flow
                    </Text>
                    <Text
                        fontSize={32}
                        fontWeight="900"
                        color={textColor}
                        fontFamily="$heading"
                        lineHeight={38}
                        letterSpacing={-1}
                    >
                        One warmup, one short practice, one mock — your PSC day is done.
                    </Text>
                </YStack>

                <YStack flex={1} />

                <YStack gap="$3">
                    <Button
                        height={56}
                        borderRadius={16}
                        backgroundColor={accent}
                        color={isDark ? '#1f1300' : '#fff8eb'}
                        fontSize="$4"
                        fontWeight="700"
                        onPress={onNext}
                        pressStyle={{ opacity: 0.9, scale: 0.98 }}
                    >
                        Personalize my sprint
                    </Button>
                    <Text fontSize="$3" color={muted} textAlign="center">
                        One tap left to make Duck yours.
                    </Text>
                </YStack>
            </YStack>
        </YStack>
    );
};


