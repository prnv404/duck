import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button, Text, XStack, YStack } from 'tamagui';
import { getOptionBorderColor, getOptionColor, getOptionTextColor, hasLongOptions } from '@/utils/quizHelpers';

interface OptionsGridProps {
    options: string[];
    selectedOption: string | null;
    correctAnswer: string;
    hasAnswered: boolean;
    onSelect: (option: string) => void;
    isDark: boolean;
}

export const OptionsGrid: React.FC<OptionsGridProps> = ({
    options,
    selectedOption,
    correctAnswer,
    hasAnswered,
    onSelect,
    isDark
}) => {
    const colorOptions = { selectedOption, correctAnswer, hasAnswered, isDark };
    const useLongLayout = hasLongOptions(options);

    const renderOption = (option: string, index: number) => (
        <Animated.View
            key={index}
            entering={FadeInDown.delay(index * 80).springify()}
            style={useLongLayout ? {} : { flex: 1 }}
        >
            <Button
                unstyled
                bg={getOptionColor(option, colorOptions)}
                borderColor={getOptionBorderColor(option, colorOptions)}
                borderWidth={2}
                borderBottomWidth={3}
                pressStyle={{ scale: 0.98, borderBottomWidth: 1, marginTop: 2 }}
                onPress={() => onSelect(option)}
                disabled={hasAnswered}
                ai="flex-start"
                jc="flex-start"
                minHeight={60}
                height="auto"
                br={14}
                f={useLongLayout ? undefined : 1}
                p="$3"
                w={useLongLayout ? "100%" : undefined}
            >
                <YStack ai="flex-start" gap="$1" w="100%" flexShrink={1}>
                    <Text
                        fontFamily="Nunito_800ExtraBold"
                        color={getOptionTextColor(option, colorOptions)}
                        opacity={0.7}
                        fontSize={12}
                    >
                        {String.fromCharCode(65 + index)}
                    </Text>
                    <Text
                        fontSize={14}
                        fontFamily="Nunito_700Bold"
                        color={getOptionTextColor(option, colorOptions)}
                        lineHeight={18}
                        flexShrink={1}
                        flexWrap="wrap"
                    >
                        {option}
                    </Text>
                </YStack>
            </Button>
        </Animated.View>
    );

    if (useLongLayout) {
        // Vertical list layout for long options
        return (
            <YStack gap="$2">
                {options.map((option, index) => renderOption(option, index))}
            </YStack>
        );
    }

    // 2x2 Grid layout for short options
    return (
        <YStack gap="$2">
            <XStack gap="$2">
                {options.slice(0, 2).map((option, index) => renderOption(option, index))}
            </XStack>
            <XStack gap="$2">
                {options.slice(2, 4).map((option, index) => renderOption(option, index + 2))}
            </XStack>
        </YStack>
    );
};
