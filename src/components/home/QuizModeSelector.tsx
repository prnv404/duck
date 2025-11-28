import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    FadeIn,
    FadeInDown,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    Extrapolation,
} from 'react-native-reanimated';
import { Text, XStack, YStack } from 'tamagui';

// --------------------------------------------------------------------------------
// --- Design System ---
// --------------------------------------------------------------------------------

const DESIGN_TOKENS = {
    light: {
        background: '#FFFFFF',
        cardBg: '#F8F9FA',
        border: '#E5E7EB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        accent: '#6366F1', // mode buttons (Indigo)
        accentHover: '#4F46E5',
        success: '#10B981',
        muted: '#F3F4F6',
    },
    dark: {
        background: '#0A0A0A',
        cardBg: '#18181B',
        border: '#27272A',
        textPrimary: '#F9FAFB',
        textSecondary: '#9CA3AF',
        accent: '#6366F1', // mode buttons (Indigo)
        accentHover: '#4F46E5',
        success: '#10B981',
        muted: '#1F1F23',
    }
};

// --------------------------------------------------------------------------------
// --- Data & Types ---
// --------------------------------------------------------------------------------

const quizModes = [
    { type: 'balanced', icon: 'scale-balance', title: 'Balanced', description: 'A mix of topics and difficulty for general review.' },
    { type: 'adaptive', icon: 'brain', title: 'Adaptive', description: 'Questions adjust difficulty based on your performance.' },
    { type: 'weak_area', icon: 'target', title: 'Weak Areas', description: 'Focuses on subjects where you need the most practice.' },
    { type: 'hard', icon: 'fire', title: 'Hardcore', description: 'High difficulty, strict timer. For challenging your limits.' },
] as const;

type QuizModeType = typeof quizModes[number]['type'];

const getSelectedModeDetails = (selectedModeType: QuizModeType) =>
    quizModes.find(mode => mode.type === selectedModeType) || quizModes[0];

interface QuizModeSelectorProps {
    selectedMode: QuizModeType;
    onModeSelect: (mode: QuizModeType) => void;
    onStartQuiz: () => void;
    isDark: boolean;
}

// --------------------------------------------------------------------------------
// --- Main Component: QuizModeSelector ---
// --------------------------------------------------------------------------------

export default function QuizModeSelector({ selectedMode, onModeSelect, onStartQuiz, isDark }: QuizModeSelectorProps) {
    const theme = isDark ? DESIGN_TOKENS.dark : DESIGN_TOKENS.light;

    const handleModeSelect = (mode: QuizModeType) => {
        Haptics.selectionAsync();
        onModeSelect(mode);
    };

    const currentMode = getSelectedModeDetails(selectedMode);

    return (
        <Animated.View entering={FadeInDown.delay(100).springify()}>
            <YStack
                bg={theme.background}
                p="$5"
                br={24}
                borderWidth={1}
                borderColor={theme.border}
                gap="$5"
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={isDark ? 0.5 : 0.1}
                shadowRadius={16}
            >
                {/* Header */}
                <YStack gap="$2" ai="center">
                    <Text fontSize={24} fontFamily="Nunito_800ExtraBold" color={theme.textPrimary} textAlign="center">
                        Start your practice
                    </Text>
                    <Text fontSize={14} fontFamily="Nunito_600SemiBold" color={theme.textSecondary} textAlign="center">
                        choose your mode and grind questions
                    </Text>
                </YStack>

                {/* Swipe Button (Constrained Width and Centered) */}
                <YStack width="100%" maxWidth={450} alignSelf="center">
                    <SwipeButton onStart={onStartQuiz} theme={theme} />
                </YStack>

                {/* Mode Selection - Compact Grid */}
                <YStack gap="$2.5">
                    <XStack gap="$1.5">
                        {quizModes.slice(0, 2).map((mode, index) => (
                            <ModePill
                                key={mode.type}
                                mode={mode}
                                isSelected={selectedMode === mode.type}
                                theme={theme}
                                handleSelect={handleModeSelect}
                                delay={100 + index * 50}
                            />
                        ))}
                    </XStack>
                    <XStack gap="$1.5">
                        {quizModes.slice(2, 4).map((mode, index) => (
                            <ModePill
                                key={mode.type}
                                mode={mode}
                                isSelected={selectedMode === mode.type}
                                theme={theme}
                                handleSelect={handleModeSelect}
                                delay={200 + index * 50}
                            />
                        ))}
                    </XStack>
                </YStack>
            </YStack>
        </Animated.View>
    );
}

// --------------------------------------------------------------------------------
// --- Sub-Component: Swipe Button (MODIFIED FOR UX) ---
// --------------------------------------------------------------------------------

const BUTTON_HEIGHT = 64;
const PADDING = 6;
const KNOB_SIZE = BUTTON_HEIGHT - PADDING * 2;

// --- CUSTOMIZATION ---
const BUTTON_RADIUS = 20;
const KNOB_RADIUS = 20;

const SWIPE_BG_COLOR = '#58cc02'; 
const SWIPE_SUCCESS_COLOR = '#0b0c0cff';
const SWIPE_ICON_COLOR = '#437901';

// Reduced threshold for easier completion
const SWIPE_COMPLETE_THRESHOLD = 0.5; // Only 50% of the drag distance is required

function SwipeButton({ onStart, theme }: { onStart: () => void; theme: typeof DESIGN_TOKENS.light }) {
    const [containerWidth, setContainerWidth] = useState(0);
    const translateX = useSharedValue(0);
    const [isComplete, setIsComplete] = useState(false);

    const maxDrag = containerWidth > 0 ? containerWidth - KNOB_SIZE - PADDING * 2 : 0;

    const handleComplete = () => {
        setIsComplete(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onStart();

        setTimeout(() => {
            // Reset state
            translateX.value = withSpring(0);
            setIsComplete(false);
        }, 800);
    };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (isComplete || maxDrag === 0) return;
            // Constrain translation between 0 and maxDrag
            translateX.value = Math.min(Math.max(e.translationX, 0), maxDrag);
        })
        .onEnd(() => {
            if (isComplete || maxDrag === 0) return;
            
            // Check if the user swiped past the 50% threshold
            if (translateX.value > maxDrag * SWIPE_COMPLETE_THRESHOLD) {
                // Animate to the *end* of the track for visual completion
                translateX.value = withSpring(maxDrag, { damping: 14, stiffness: 100 });
                runOnJS(handleComplete)();
            } else {
                // Snap back to start
                translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
            }
        });

    const knobStyle = useAnimatedStyle(() => ({ 
        transform: [{ translateX: translateX.value }] 
    }));
    
    const textStyle = useAnimatedStyle(() => ({ 
        // Fade out text quickly as the knob moves
        opacity: interpolate(
            translateX.value, 
            [0, maxDrag * SWIPE_COMPLETE_THRESHOLD * 0.5], // Hide text by 25% of max drag
            [1, 0], 
            Extrapolation.CLAMP
        ) 
    }));
    
    const trackStyle = useAnimatedStyle(() => ({
        // Change track color when the threshold is met
        backgroundColor: translateX.value > maxDrag * SWIPE_COMPLETE_THRESHOLD ? SWIPE_SUCCESS_COLOR : SWIPE_BG_COLOR,
    }));
    
    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(translateX.value, [0, maxDrag], [0, 4], Extrapolation.CLAMP) }],
        opacity: isComplete ? withTiming(0) : withTiming(1),
    }));

    return (
        <GestureHandlerRootView style={{ width: '100%' }}>
            <GestureDetector gesture={panGesture}>
                <Animated.View 
                    style={[styles.track, trackStyle]} 
                    onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                >
                    <Animated.View style={[styles.textContainer, textStyle]}>
                        <Text fontFamily="Nunito_800ExtraBold" fontSize={15} color="white" letterSpacing={0.5}>
                            Swipe to start
                        </Text>
                    </Animated.View>
                    <Animated.View style={[styles.knob, knobStyle]}>
                        <Animated.View style={iconStyle}>
                            <MaterialCommunityIcons name="arrow-right" size={24} color={SWIPE_ICON_COLOR} />
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

// --------------------------------------------------------------------------------
// --- Sub-Component: Mode Selection Pill ---
// --------------------------------------------------------------------------------

interface ModePillProps {
    mode: typeof quizModes[number];
    isSelected: boolean;
    theme: typeof DESIGN_TOKENS.light;
    handleSelect: (mode: QuizModeType) => void;
    delay: number;
}

function ModePill({ mode, isSelected, theme, handleSelect, delay }: ModePillProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withTiming(0.95, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 150 });
        handleSelect(mode.type);
    };

    return (
        <Animated.View entering={FadeIn.delay(delay)} style={{ flex: 1 }}>
            <Animated.View style={animatedStyle}>
                <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => handleSelect(mode.type)}>
                    <YStack
                        ai="center"
                        jc="center"
                        gap="$1.5"
                        p="$3"
                        br={16}
                        bg={isSelected ? theme.accent : theme.cardBg}
                        borderWidth={isSelected ? 0 : 1}
                        borderColor={theme.border}
                        h={90}
                    >
                        <YStack w={24} h={24} ai="center" jc="center" br={10} bg={isSelected ? 'rgba(255,255,255,0.2)' : theme.muted}>
                            <MaterialCommunityIcons name={mode.icon as any} size={18} color={isSelected ? '#FFFFFF' : theme.accent} />
                        </YStack>

                        <Text fontSize={13} fontFamily="Nunito_800ExtraBold" color={isSelected ? '#FFFFFF' : theme.textPrimary} textAlign="center">
                            {mode.title}
                        </Text>

                        {isSelected && (
                            <Animated.View entering={FadeIn.duration(200)} style={{ position: 'absolute', top: 8, right: 8 }}>
                                <MaterialCommunityIcons name="check-circle" size={16} color="#FFFFFF" />
                            </Animated.View>
                        )}
                    </YStack>
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
}

// --------------------------------------------------------------------------------
// --- Styles ---
// --------------------------------------------------------------------------------

const styles = StyleSheet.create({
    track: {
        height: BUTTON_HEIGHT,
        width: '100%',
        borderRadius: BUTTON_RADIUS, 
        justifyContent: 'center',
        padding: PADDING,
        overflow: 'hidden',
    },
    textContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    knob: {
        height: KNOB_SIZE,
        width: KNOB_SIZE,
        borderRadius: KNOB_RADIUS, 
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    }
});