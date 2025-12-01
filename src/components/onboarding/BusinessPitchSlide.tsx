import React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, XStack, YStack } from 'tamagui';

interface BusinessPitchSlideProps {
    isDark: boolean;
    onNext: () => void;
    onSkip: () => void;
    step: number;
    totalSteps: number;
}

export const BusinessPitchSlide: React.FC<BusinessPitchSlideProps> = ({
    isDark,
    onNext,
    onSkip,
    step,
    totalSteps,
}) => {
    const insets = useSafeAreaInsets();

    const bgColor = isDark ? '#020202' : '#fdfcf7';
    const textColor = isDark ? '#ffffff' : '#18181b';
    const muted = isDark ? '#bdbdbd' : '#5b5b65';
    const accent = isDark ? '#10b981' : '#0f8bff';

    return (
        <YStack
            flex={1}
            backgroundColor={bgColor}
            paddingTop={insets.top + 32}
            paddingBottom={Math.max(insets.bottom, 24) + 24}
            paddingHorizontal={24}
        >
            <YStack flex={1} gap="$6">
                <XStack alignItems='center' justifyContent='space-between'>
                    <YStack>
                        <Text fontSize="$2" color={muted} textTransform="uppercase" letterSpacing={2}>
                            Step {step}/{totalSteps}
                        </Text>
                    </YStack>
                    <Pressable onPress={onSkip} hitSlop={12}>
                        <Text fontSize="$3" fontWeight="600" color={muted}>
                            Skip
                        </Text>
                    </Pressable>
                </XStack>

                <YStack flex={1} justifyContent="center">
                    <Text
                        fontSize={32}
                        fontWeight="900"
                        color={textColor}
                        fontFamily="$heading"
                        lineHeight={38}
                        letterSpacing={-0.5}
                    >
                        Duck helps you crack PSC exams with smart questions, audio help, and game-like streaks.
                    </Text>
                </YStack>

                <Button
                    height={56}
                    borderRadius={16}
                    backgroundColor={accent}
                    color={isDark ? '#00160e' : '#f4fffb'}
                    fontSize="$5"
                    fontWeight="700"
                    onPress={onNext}
                    pressStyle={{ opacity: 0.9, scale: 0.98 }}
                >
                    Go to structure
                </Button>
            </YStack>
        </YStack>
    );
};


