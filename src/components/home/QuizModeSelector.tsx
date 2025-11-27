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
    interpolateColor
} from 'react-native-reanimated';
import { Text, XStack, YStack } from 'tamagui';

// --------------------------------------------------------------------------------
// --- Data & Types ---
// --------------------------------------------------------------------------------

const quizModes = [
    {
        type: 'balanced',
        icon: 'scale-balance',
        title: 'Balanced',
        description: 'A mix of topics and difficulty for general review.',
        color: '#6366f1', // Indigo
    },
    {
        type: 'adaptive',
        icon: 'brain',
        title: 'Adaptive',
        description: 'Questions adjust difficulty based on your performance.',
        color: '#8b5cf6', // Violet
    },
    {
        type: 'weak_area',
        icon: 'target',
        title: 'Weak Areas',
        description: 'Focuses on subjects where you need the most practice.',
        color: '#ef4444', // Red
    },
    {
        type: 'hard',
        icon: 'fire',
        title: 'Hardcore',
        description: 'High difficulty, strict timer. For challenging your limits.',
        color: '#dc2626', // Red-Dark
    },
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
    const handleModeSelect = (mode: QuizModeType) => {
        Haptics.selectionAsync();
        onModeSelect(mode);
    };

    const cardBgColor = isDark ? '#14171aff' : '#fff';
    const cardBorderColor = isDark ? '#262626' : '#e0e0e0';
    const cardShadow = isDark 
        ? { shadowOpacity: 0.3, shadowRadius: 12, shadowColor: '#000' } 
        : { shadowOpacity: 0.08, shadowRadius: 8, shadowColor: '#000' };

    const currentMode = getSelectedModeDetails(selectedMode);
    const descriptionKey = currentMode.type;

    return (
        <Animated.View entering={FadeInDown.delay(100).springify()}>
            <YStack
                bg={cardBgColor}
                p="$4"
                br={20}
                borderWidth={1}
                borderColor={cardBorderColor}
                gap="$4"
                style={cardShadow}
            >
                <Text
                    fontSize={20}
                    fontFamily="Nunito_800ExtraBold"
                    color={isDark ? '#e0e0e0' : '#1a1a1a'}
                    textAlign="center"
                >
                    Select Your Training Mode
                </Text>

                {/* --- Mode Selector Grid --- */}
                <YStack gap="$3">
                    <XStack gap="$3">
                        {quizModes.slice(0, 2).map((mode, index) => (
                            <ModePill 
                                key={mode.type} 
                                mode={mode} 
                                isSelected={selectedMode === mode.type} 
                                isDark={isDark} 
                                handleSelect={handleModeSelect} 
                                delay={100 + index * 100} 
                            />
                        ))}
                    </XStack>
                    <XStack gap="$3">
                        {quizModes.slice(2, 4).map((mode, index) => (
                            <ModePill 
                                key={mode.type} 
                                mode={mode} 
                                isSelected={selectedMode === mode.type} 
                                isDark={isDark} 
                                handleSelect={handleModeSelect} 
                                delay={300 + index * 100} 
                            />
                        ))}
                    </XStack>
                </YStack>

                {/* --- Description Panel --- */}
                <Animated.View key={descriptionKey} entering={FadeIn.duration(400)}>
                    <YStack
                        p="$3"
                        br={14}
                        bg={isDark ? '#1a1a1a' : '#f5f5f5'}
                        borderLeftWidth={4}
                        borderColor={currentMode.color}
                        gap="$1.5"
                    >
                        <XStack ai="center" gap="$2">
                            <MaterialCommunityIcons name={currentMode.icon as any} size={16} color={currentMode.color} />
                            <Text fontSize={15} fontFamily="Nunito_800ExtraBold" color={currentMode.color}>
                                {currentMode.title}
                            </Text>
                        </XStack>
                        <Text fontSize={12} color={isDark ? '#a3a3a3' : '#525252'} fontFamily="Nunito_600SemiBold">
                            {currentMode.description}
                        </Text>
                    </YStack>
                </Animated.View>

                {/* --- Swipe To Start Button --- */}
                <SwipeButton onStart={onStartQuiz} />

            </YStack>
        </Animated.View>
    );
}

// --------------------------------------------------------------------------------
// --- Sub-Component: Swipe Button (Solid & Compact) ---
// --------------------------------------------------------------------------------

const BUTTON_HEIGHT = 58;
const PADDING = 5;
const KNOB_SIZE = BUTTON_HEIGHT - (PADDING * 2);

function SwipeButton({ onStart }: { onStart: () => void }) {
    const [containerWidth, setContainerWidth] = useState(0);
    const translateX = useSharedValue(0);
    const [isComplete, setIsComplete] = useState(false);
    
    // Calculate draggable area based on actual rendered width
    const maxDrag = containerWidth > 0 ? containerWidth - KNOB_SIZE - (PADDING * 2) : 0;

    const handleComplete = () => {
        setIsComplete(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onStart();
        
        // Reset logic: delay reset so user sees the "success" state briefly
        setTimeout(() => {
             translateX.value = withSpring(0);
             setIsComplete(false);
        }, 1000);
    };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (isComplete || maxDrag === 0) return;
            // Clamp movement
            translateX.value = Math.min(Math.max(e.translationX, 0), maxDrag);
        })
        .onEnd(() => {
            if (isComplete || maxDrag === 0) return;
            
            // Trigger point: 65% of the way
            if (translateX.value > maxDrag * 0.65) {
                translateX.value = withSpring(maxDrag, { damping: 14, stiffness: 100 });
                runOnJS(handleComplete)();
            } else {
                // Snap back
                translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
            }
        });

    // --- Animated Styles ---
    const knobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, maxDrag * 0.7], [1, 0], Extrapolation.CLAMP),
        transform: [{ translateX: interpolate(translateX.value, [0, maxDrag], [0, 15], Extrapolation.CLAMP) }]
    }));

    const trackAnimatedStyle = useAnimatedStyle(() => ({
         backgroundColor: interpolateColor(
             translateX.value, 
             [0, maxDrag], 
             ['#58cc02', '#5ce602'] // Main Green -> Slightly lighter green
         )
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${interpolate(translateX.value, [0, maxDrag], [0, 360])}deg` },
            { scale: interpolate(translateX.value, [maxDrag * 0.8, maxDrag], [1, 1.15], Extrapolation.CLAMP) }
        ]
    }));

    return (
        <GestureHandlerRootView style={{ width: '100%', alignItems: 'center' }}>
            <GestureDetector gesture={panGesture}>
                <Animated.View 
                    style={[styles.trackSolid, trackAnimatedStyle]} 
                    onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                >
                    {/* Background Text */}
                    <Animated.View style={[styles.textContainer, textStyle]}>
                        <Text 
                            fontFamily="Nunito_900Black" 
                            fontSize={16} 
                            color="white" 
                            letterSpacing={1} 
                            style={styles.textShadow}
                        >
                            SWIPE TO START {'>>'}
                        </Text>
                    </Animated.View>

                    {/* Draggable Knob */}
                    <Animated.View style={[styles.knobSolid, knobStyle]}>
                        <Animated.View style={iconStyle}>
                            <MaterialCommunityIcons name="arrow-right" size={28} color="#3a7e0d" />
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
    isDark: boolean;
    handleSelect: (mode: QuizModeType) => void;
    delay: number;
}

function ModePill({ mode, isSelected, isDark, handleSelect, delay }: ModePillProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            ...(isSelected ? {
                shadowColor: mode.color,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 4,
            } : {})
        };
    });

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withTiming(0.95, { duration: 150 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(isSelected ? 1.02 : 1, { damping: 12, stiffness: 100 });
        handleSelect(mode.type);
    };

    const iconColor = isSelected ? '#fff' : mode.color;
    const textColor = isSelected ? '#fff' : (isDark ? '#e0e0e0' : '#1a1a1a');
    const bgColor = isSelected ? mode.color : (isDark ? '#1a1a1a' : '#f8f9fa');
    const borderColor = isSelected ? 'transparent' : (isDark ? '#2a2a2a' : '#e5e7eb');

    return (
        <Animated.View key={mode.type} entering={FadeIn.delay(delay)} style={{ flex: 1 }}>
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={() => handleSelect(mode.type)}
                >
                    <YStack
                        ai="center"
                        gap="$1"
                        px="$3.5"
                        py="$2.5"
                        br={12}
                        bg={bgColor}
                        borderWidth={isSelected ? 0 : 1}
                        borderColor={borderColor}
                        style={{ flex: 1 }}
                    >
                        <MaterialCommunityIcons name={mode.icon as any} size={20} color={iconColor} />
                        <Text fontSize={12} fontFamily={isSelected ? "Nunito_900Black" : "Nunito_700Bold"} color={textColor} textAlign="center">
                            {mode.title}
                        </Text>
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
    trackSolid: {
        height: BUTTON_HEIGHT,
        // Reduced width from 100% to 92% per request
        width: '92%', 
        alignSelf: 'center',
        marginTop: 8,
        
        borderRadius: BUTTON_HEIGHT / 2,
        justifyContent: 'center',
        padding: PADDING,
        overflow: 'hidden',

        // Solid Border Styling
        borderWidth: 3,
        borderBottomWidth: 5, // Thicker bottom for 3D effect
        borderColor: '#3a7e0d', // Dark green border
        
        // Shadow/Depth
        shadowColor: '#3a7e0d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 8,
    },
    textContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        paddingLeft: KNOB_SIZE / 2, // Slight offset to visual center
    },
    textShadow: {
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowRadius: 2,
        textShadowOffset: { width: 0, height: 1 }
    },
    knobSolid: {
        height: KNOB_SIZE,
        width: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        
        // Knob Borders and Shadow
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5
    }
});