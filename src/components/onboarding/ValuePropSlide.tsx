import React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, XStack, YStack } from 'tamagui';

interface ValuePropSlideProps {
    isDark: boolean;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    step: number;
    totalSteps: number;
}

export const ValuePropSlide: React.FC<ValuePropSlideProps> = ({
    isDark,
    onNext,
    onBack,
    onSkip,
    step,
    totalSteps,
}) => {
    const insets = useSafeAreaInsets();

    const bgColor = isDark ? '#030303' : '#fbfaf5';
    const textColor = isDark ? '#ffffff' : '#18181b';
    const muted = isDark ? '#c7c7c7' : '#5f5f6b';
    const accent = isDark ? '#22d3ee' : '#0f8bff';

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
                        Modes
                    </Text>
                    <Text
                        fontSize={32}
                        fontWeight="900"
                        color={textColor}
                        fontFamily="$heading"
                        lineHeight={38}
                        letterSpacing={-1}
                    >
                        Four play modes so you can study Balanced, Adaptive, Weak, or Hardcore.
                    </Text>
                </YStack>

                <YStack flex={1} />

                <Button
                    height={56}
                    borderRadius={16}
                    backgroundColor={accent}
                    color="#00172b"
                    fontSize="$4"
                    fontWeight="700"
                    onPress={onNext}
                    pressStyle={{ opacity: 0.9, scale: 0.98 }}
                >
                    See a day inside Duck
                </Button>
            </YStack>
        </YStack>
    );
};


