import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';
import { Button, Text, XStack, YStack } from 'tamagui';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

const quizModes = [
    { type: 'balanced', icon: 'scale-balance', title: 'Balanced', color: '#6366f1' },
    { type: 'adaptive', icon: 'brain', title: 'Adaptive', color: '#8b5cf6' },
    { type: 'weak_area', icon: 'target', title: 'Weak Areas', color: '#ef4444' },
    { type: 'hard', icon: 'fire', title: 'Hard', color: '#dc2626' },
];

interface QuizModeSelectorProps {
    selectedMode: string;
    onModeSelect: (mode: string) => void;
    onStartQuiz: () => void;
    isDark: boolean;
}

export default function QuizModeSelector({ selectedMode, onModeSelect, onStartQuiz, isDark }: QuizModeSelectorProps) {
    const handleModeSelect = (mode: string) => {
        Haptics.selectionAsync();
        onModeSelect(mode);
    };

    return (
        <Animated.View entering={FadeInDown.delay(400)}>
            <YStack
                bg={isDark ? '#0f1511ff' : '#fafafa'}
                p="$4"
                br={12}
                borderWidth={1}
                borderColor={isDark ? '#1a1a1a' : '#f0f0f0'}
                gap="$4"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: isDark ? 0.4 : 0.08,
                    shadowRadius: 16,
                    elevation: 8,
                }}
            >
                <Text fontSize={18} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#0a0a0a'}>
                    Choose Quiz Mode
                </Text>

                {/* 2x2 Grid */}
                <YStack gap="$2.5">
                    <XStack gap="$2.5">
                        {quizModes.slice(0, 2).map((mode, index) => {
                            const isSelected = selectedMode === mode.type;
                            return (
                                <Animated.View key={mode.type} entering={FadeIn.delay(500 + index * 100)} style={{ flex: 1 }}>
                                    <Pressable onPress={() => handleModeSelect(mode.type)}>
                                        <YStack
                                            ai="center"
                                            gap="$2"
                                            px="$3"
                                            py="$3"
                                            br={10}
                                            bg={isSelected ? mode.color : (isDark ? '#1a1a1a' : '#f5f5f5')}
                                            borderWidth={isSelected ? 0 : 1}
                                            borderColor={isSelected ? mode.color : (isDark ? '#262626' : '#e5e5e5')}
                                            style={{
                                                transform: [{ scale: isSelected ? 1.02 : 1 }],
                                            }}
                                        >
                                            <MaterialCommunityIcons name={mode.icon as any} size={24} color={isSelected ? '#ffffff' : mode.color} />
                                            <Text fontSize={13} fontFamily="Nunito_700Bold" color={isSelected ? '#ffffff' : (isDark ? '#ffffff' : '#0a0a0a')} textAlign="center">
                                                {mode.title}
                                            </Text>
                                        </YStack>
                                    </Pressable>
                                </Animated.View>
                            );
                        })}
                    </XStack>
                    <XStack gap="$2.5">
                        {quizModes.slice(2, 4).map((mode, index) => {
                            const isSelected = selectedMode === mode.type;
                            return (
                                <Animated.View key={mode.type} entering={FadeIn.delay(700 + index * 100)} style={{ flex: 1 }}>
                                    <Pressable onPress={() => handleModeSelect(mode.type)}>
                                        <YStack
                                            ai="center"
                                            gap="$2"
                                            px="$3"
                                            py="$3"
                                            br={10}
                                            bg={isSelected ? mode.color : (isDark ? '#1a1a1a' : '#f5f5f5')}
                                            borderWidth={isSelected ? 0 : 1}
                                            borderColor={isSelected ? mode.color : (isDark ? '#262626' : '#e5e5e5')}
                                            style={{
                                                transform: [{ scale: isSelected ? 1.02 : 1 }],
                                            }}
                                        >
                                            <MaterialCommunityIcons name={mode.icon as any} size={24} color={isSelected ? '#ffffff' : mode.color} />
                                            <Text fontSize={13} fontFamily="Nunito_700Bold" color={isSelected ? '#ffffff' : (isDark ? '#ffffff' : '#0a0a0a')} textAlign="center">
                                                {mode.title}
                                            </Text>
                                        </YStack>
                                    </Pressable>
                                </Animated.View>
                            );
                        })}
                    </XStack>
                </YStack>

                <Animated.View entering={ZoomIn.delay(600)}>
                    <Button
                        size="$5"
                        bg={isDark ? '#58cc02' : '#58cc02'}
                        color={isDark ? '#0a0a0a' : '#ffffff'}
                        pressStyle={{ bg: isDark ? '#f5f5f5' : '#1a1a1a', scale: 0.98 }}
                        onPress={onStartQuiz}
                        h={56}
                        br={12}
                        style={{
                            shadowColor: isDark ? '#ffffff' : '#000',
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                        icon={<MaterialCommunityIcons name="play" size={24} color={isDark ? '#0a0a0a' : '#ffffff'} />}
                    >
                        <Text fontSize={18} color={isDark ? '#0a0a0a' : '#ffffff'} fontFamily="Nunito_800ExtraBold">
                            Start Practice
                        </Text>
                    </Button>
                </Animated.View>
            </YStack>
        </Animated.View>
    );
}
