import React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, XStack, YStack } from 'tamagui';

interface DailyPracticeSlideProps {
    isDark: boolean;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    step: number;
    totalSteps: number;
}

export const DailyPracticeSlide: React.FC<DailyPracticeSlideProps> = ({
    isDark,
    onNext,
    onBack,
    onSkip,
    step,
    totalSteps,
}) => {
    const insets = useSafeAreaInsets();
    const bgColor = isDark ? '#151516ff' : '#f8fafc';
    const textColor = isDark ? '#eeebebff' : '#18181b';
    const accent = isDark ? '#fefefeff' : '#080909ff';
    const muted = isDark ? '#a1a1aa' : '#64748b';

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

                <YStack gap="$2" ai="center" mt={32}>
                    <Text
                        fontSize={40}
                        fontWeight="900"
                        color={accent}
                        fontFamily="$heading"
                        lineHeight={44}
                        letterSpacing={-1}
                        ta="center"
                    >
                        Practice like{'\n'}the real exam.
                    </Text>
                    <Text
                        fontSize={18}
                        color={textColor}
                        fontWeight="600"
                        ta="center"
                        lineHeight={26}
                        maxWidth={340}
                    >
                        Subject-wise MCQs from GK, Maths, English, and more—just like PSC papers.
                    </Text>
                </YStack>

                <YStack flex={1} />

                <Button
                    height={56}
                    borderRadius={16}
                    backgroundColor={accent}
                    color={isDark ? '#000000' : '#ffffff'}
                    fontSize="$5"
                    fontWeight="700"
                    onPress={onNext}
                    pressStyle={{ opacity: 0.9, scale: 0.98 }}
                >
                    Next
                </Button>
            </YStack>
        </YStack>
    );
};
