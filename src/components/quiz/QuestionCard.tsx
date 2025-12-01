import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface QuestionCardProps {
    question: string;
    currentIndex: number;
    totalQuestions: number;
    isDark: boolean;
    audioUrl?: string;
    onReplay: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    currentIndex,
    totalQuestions,
    isDark,
    audioUrl,
    onReplay,
}) => {
    const handleReplay = async () => {
        await Haptics.selectionAsync();
        onReplay();
    };

    return (
        <YStack mb="$4">
            <XStack ai="center" jc="space-between" mb="$2">
                <Text
                    fontSize={13}
                    fontFamily="Nunito_700Bold"
                    color={isDark ? '#6b7280' : '#9ca3af'}
                    textTransform="uppercase"
                    letterSpacing={0.5}
                >
                    Question {currentIndex + 1}/{totalQuestions}
                </Text>
                {audioUrl && (
                    <MaterialCommunityIcons
                        name="replay"
                        size={22}
                        color={isDark ? '#6b7280' : '#9ca3af'}
                        onPress={handleReplay}
                    />
                )}
            </XStack>

            <Text
                fontSize={22}
                fontFamily="Nunito_800ExtraBold"
                color={isDark ? '#f3f4f6' : '#1e2937'}
                lineHeight={30}
            >
                {question}
            </Text>
        </YStack>
    );
};
