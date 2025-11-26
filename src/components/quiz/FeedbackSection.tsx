import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button, Text, XStack, YStack } from 'tamagui';

interface FeedbackSectionProps {
    questionFeedback: 'like' | 'dislike' | null;
    showFeedbackOptions: boolean;
    feedbackReason: string | null;
    onFeedback: (type: 'like' | 'dislike') => void;
    onFeedbackReason: (reason: string) => void;
    isDark: boolean;
}

const FEEDBACK_REASONS = [
    { id: 'wrong_answer', label: 'Wrong answer marked as correct' },
    { id: 'unclear', label: "Question doesn't make sense" },
    { id: 'typo', label: 'Contains typos or errors' },
    { id: 'inappropriate', label: 'Inappropriate content' },
    { id: 'other', label: 'Other issue' }
];

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
    questionFeedback,
    showFeedbackOptions,
    feedbackReason,
    onFeedback,
    onFeedbackReason,
    isDark
}) => {
    return (
        <>
            {/* Quality Feedback Section */}
            <XStack ai="center" jc="space-between" mb="$1">
                <Text
                    fontSize={11}
                    fontFamily="Nunito_600SemiBold"
                    color={isDark ? '#9ca3af' : '#6b7280'}
                >
                    Rate this question to improve the quality of the app
                </Text>
                <XStack gap="$2">
                    <Button
                        unstyled
                        onPress={() => onFeedback('like')}
                        bg={questionFeedback === 'like' ? (isDark ? '#22c55e' : '#4ade80') : (isDark ? '#1f2937' : '#f3f4f6')}
                        p="$2"
                        br={8}
                        pressStyle={{ scale: 0.95 }}
                        w={36}
                        h={36}
                        ai="center"
                        jc="center"
                    >
                        <MaterialCommunityIcons
                            name="thumb-up"
                            size={18}
                            color={questionFeedback === 'like' ? '#ffffff' : (isDark ? '#10e461ff' : '#2ede0fff')}
                        />
                    </Button>
                    <Button
                        unstyled
                        onPress={() => onFeedback('dislike')}
                        bg={questionFeedback === 'dislike' ? (isDark ? '#ef4444' : '#f87171') : (isDark ? '#37241fff' : '#f6f3f4ff')}
                        p="$2"
                        br={8}
                        pressStyle={{ scale: 0.95 }}
                        w={36}
                        h={36}
                        ai="center"
                        jc="center"
                    >
                        <MaterialCommunityIcons
                            name="thumb-down"
                            size={18}
                            color={questionFeedback === 'dislike' ? '#ffffff' : (isDark ? '#ec0505ff' : '#f5180cff')}
                        />
                    </Button>
                </XStack>
            </XStack>

            {/* Feedback Options (shown when dislike is selected) */}
            {showFeedbackOptions && (
                <Animated.View entering={FadeInDown.duration(200)}>
                    <YStack
                        gap="$2"
                        p="$3"
                        bg={isDark ? '#1f2937' : '#fef3c7'}
                        br={12}
                    >
                        <Text
                            fontSize={12}
                            fontFamily="Nunito_700Bold"
                            color={isDark ? '#fbbf24' : '#92400e'}
                            mb="$1"
                        >
                            What's wrong with this question?
                        </Text>
                        {FEEDBACK_REASONS.map((reason) => (
                            <Button
                                key={reason.id}
                                unstyled
                                onPress={() => onFeedbackReason(reason.id)}
                                bg={feedbackReason === reason.id ? (isDark ? '#ef4444' : '#fca5a5') : (isDark ? '#374151' : '#ffffff')}
                                p="$2.5"
                                br={8}
                                pressStyle={{ scale: 0.98 }}
                                ai="flex-start"
                                borderWidth={1}
                                borderColor={feedbackReason === reason.id ? 'transparent' : (isDark ? '#4b5563' : '#e5e7eb')}
                            >
                                <Text
                                    fontSize={12}
                                    fontFamily="Nunito_600SemiBold"
                                    color={feedbackReason === reason.id ? '#ffffff' : (isDark ? '#d1d5db' : '#374151')}
                                >
                                    {reason.label}
                                </Text>
                            </Button>
                        ))}
                    </YStack>
                </Animated.View>
            )}
        </>
    );
};
