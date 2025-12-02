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
    topicName?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    currentIndex,
    totalQuestions,
    isDark,
    audioUrl,
    onReplay,
    topicName,
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
                {audioUrl ? (
                    <MaterialCommunityIcons
                        name="replay"
                        size={22}
                        color={isDark ? '#6b7280' : '#9ca3af'}
                        onPress={handleReplay}
                    />
                ) : (
                    <XStack ai="center" gap="$1.5" bg={isDark ? '#1f2937' : '#f3f4f6'} px="$2" py="$1" br={6}>
                        <MaterialCommunityIcons name="clock-outline" size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
                        <Text fontSize={10} fontFamily="Nunito_700Bold" color={isDark ? '#9ca3af' : '#6b7280'}>
                            AUDIO UPCOMING
                        </Text>
                    </XStack>
                )}
            </XStack>

            {topicName && (
                <XStack
                    bg={isDark ? '#1f2937' : '#e0f2fe'}
                    px="$3"
                    py="$1.5"
                    br={8}
                    mb="$3"
                    ai="center"
                    gap="$2"
                    alignSelf="flex-start"
                    borderWidth={1}
                    borderColor={isDark ? '#374151' : '#bae6fd'}
                >
                    <MaterialCommunityIcons
                        name="bookmark-outline"
                        size={16}
                        color={isDark ? '#58cc02' : '#0284c7'}
                    />
                    <Text
                        fontSize={12}
                        fontFamily="Nunito_600SemiBold"
                        color={isDark ? '#9ca3af' : '#0c4a6e'}
                    >
                        {topicName}
                    </Text>
                </XStack>
            )}

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
