import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import Animated from 'react-native-reanimated';
import { Text, XStack, YStack } from 'tamagui';

interface QuizHeaderProps {
    currentQuestion: number;
    totalQuestions: number;
    onClose: () => void;
    isDark: boolean;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
    currentQuestion,
    totalQuestions,
    onClose,
    isDark
}) => {
    return (
        <XStack ai="center" gap="$3" px="$4" py="$2">
            <MaterialCommunityIcons
                name="close"
                size={24}
                color={isDark ? '#9ca3af' : '#9ca3af'}
                onPress={onClose}
            />
            <YStack f={1} h={12} bg={isDark ? '#374151' : '#e5e7eb'} br={8} overflow="hidden">
                <Animated.View
                    style={{
                        height: '100%',
                        backgroundColor: '#58cc02',
                        width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                        borderRadius: 8,
                    }}
                />
                <YStack position="absolute" top={3} left={3} right={3} h={3} bg="rgba(255,255,255,0.2)" br={3} />
            </YStack>
            {/* Reserved for language toggle */}
            <YStack w={24} h={24} />
        </XStack>
    );
};
