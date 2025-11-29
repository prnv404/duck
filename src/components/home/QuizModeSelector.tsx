import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Text, XStack, YStack, View } from 'tamagui';

// --------------------------------------------------------------------------------
// --- Configuration ---
// --------------------------------------------------------------------------------

const MODES = [
    { type: 'balanced', icon: 'scale-balance', label: 'Balanced', color: '#3B82F6' },
    { type: 'adaptive', icon: 'brain', label: 'Adaptive', color: '#8B5CF6' },
    { type: 'weak_area', icon: 'target', label: 'Weak Spots', color: '#F59E0B' },
    { type: 'hard_core', icon: 'fire', label: 'Hardcore', color: '#EF4444' },
] as const;

type QuizModeType = typeof MODES[number]['type'];

// --------------------------------------------------------------------------------
// --- Main Component ---
// --------------------------------------------------------------------------------

export default function SolidModeSelector({ 
    selectedMode, 
    onModeSelect, 
    onStartQuiz, 
    isDark 
}: { 
    selectedMode: QuizModeType; 
    onModeSelect: (m: QuizModeType) => void; 
    onStartQuiz: () => void;
    isDark: boolean; 
}) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Theme Constants
    const bg = isDark ? '#18181B' : '#FFFFFF';
    const border = isDark ? '#27272A' : '#E4E4E7';
    const text = isDark ? '#FFFFFF' : '#09090B';
    const textSecondary = isDark ? '#A1A1AA' : '#6B7280';
    const currentModeDetails = MODES.find(m => m.type === selectedMode) || MODES[0];
    const activeColor = currentModeDetails.color;

    const toggleSettings = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsSettingsOpen(!isSettingsOpen);
    };

    const handleSelectMode = (mode: QuizModeType) => {
        Haptics.selectionAsync();
        onModeSelect(mode);
        // Snappy auto-close after selection
        setTimeout(() => setIsSettingsOpen(false), 150);
    };

    return (
        <Animated.View entering={FadeInDown.delay(100).springify()}>
            {/* --- Context Header --- */}
            <YStack mb="$4" ai="center">
                <Text fontSize={20} fontFamily="Nunito_800ExtraBold" color={text} textAlign="center">
                    🎯 Practice Questions
                </Text>
                <Text fontSize={14} fontFamily="Nunito_600SemiBold" color={textSecondary} textAlign="center">
                    Select your focus and start grinding.
                </Text>
            </YStack>

            {/* --- Solid Control Deck Card --- */}
            <YStack 
                bg={bg} 
                br={16} 
                borderWidth={1} 
                borderColor={border} 
                p="$3.5" 
                width="100%"
                maxWidth={400} 
                alignSelf="center"
                gap="$3.5" 
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.05,
                    shadowRadius: 3,
                    elevation: 2,
                }}
            >
                {/* --- 1. Mode Display & Toggle Button (Top Section) --- */}
                <XStack ai="center" jc="space-between">
                    <Text fontSize={16} fontFamily="Nunito_800ExtraBold" color={text}>
                        {currentModeDetails.label} Challenge
                    </Text>

                    <Pressable onPress={toggleSettings} hitSlop={10}>
                        <XStack ai="center" gap="$1.5">
                            <Text fontSize={13} fontFamily="Nunito_600SemiBold" color={isSettingsOpen ? activeColor : text}>
                                {isSettingsOpen ? 'Close Menu' : 'Change Mode'}
                            </Text>
                            <MaterialCommunityIcons 
                                name={isSettingsOpen ? "close-circle" : "cog"} 
                                size={22} 
                                color={isSettingsOpen ? activeColor : text} 
                            />
                        </XStack>
                    </Pressable>
                </XStack>

                {/* --- 2. Expandable Mode Selector (Middle Section) --- */}
                <Animated.View 
                    layout={LinearTransition.duration(250)}
                    style={{ overflow: 'hidden' }}
                >
                    {isSettingsOpen && (
                        <Animated.View key="modes" entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)}>
                            {/* **FIXED: Ensure all children are wrapped in YStack for containment** */}
                            <YStack gap="$2"> 
                                <Text fontSize={13} fontFamily="Nunito_600SemiBold" color={textSecondary}>
                                    Select a new practice strategy:
                                </Text>
                                <XStack gap="$2" f={1}>
                                    {MODES.map((mode) => (
                                        <ModeOption 
                                            key={mode.type}
                                            mode={mode} 
                                            isActive={selectedMode === mode.type}
                                            onPress={() => handleSelectMode(mode.type)}
                                            isDark={isDark}
                                        />
                                    ))}
                                </XStack>
                            </YStack>
                        </Animated.View>
                    )}
                </Animated.View>

                {/* --- 3. Call to Action (Bottom Section) --- */}
                <StartButton 
                    onPress={onStartQuiz} 
                    color={activeColor} 
                    label={`Start ${currentModeDetails.label}`}
                />
            </YStack>
        </Animated.View>
    );
}

// --------------------------------------------------------------------------------
// --- Sub-Components (Unchanged) ---
// --------------------------------------------------------------------------------

function StartButton({ onPress, color, label }: { onPress: () => void, color: string, label: string }) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        scale.value = withTiming(0.97, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    return (
        <Animated.View style={[{ height: 52 }, animatedStyle]}>
            <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ flex: 1 }}>
                <XStack 
                    f={1} 
                    bg={color} 
                    br={12} 
                    ai="center" 
                    jc="center" 
                    gap="$2"
                    style={{ shadowColor: color, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.3, shadowRadius: 4 }}
                >
                    <Text fontFamily="Nunito_800ExtraBold" fontSize={18} color="white" textTransform='uppercase'>
                        {label}
                    </Text>
                    <MaterialCommunityIcons name="chevron-double-right" size={24} color="white" />
                </XStack>
            </Pressable>
        </Animated.View>
    );
}

function ModeOption({ mode, isActive, onPress, isDark }: { mode: typeof MODES[number], isActive: boolean, onPress: () => void, isDark: boolean }) {
    return (
        <Pressable onPress={onPress} style={{ flex: 1 }}>
            <YStack 
                f={1} 
                h={60}
                bg={isActive ? mode.color : (isDark ? '#27272A' : '#F4F4F5')} 
                br={10} 
                ai="center" 
                jc="center" 
                gap="$1"
                borderWidth={isActive ? 0 : 1}
                borderColor={isDark ? '#3F3F46' : '#E4E4E7'}
            >
                <MaterialCommunityIcons 
                    name={mode.icon as any} 
                    size={22} 
                    color={isActive ? 'white' : mode.color} 
                />
                 <Text 
                    fontSize={11} 
                    fontFamily="Nunito_700Bold" 
                    color={isActive ? 'white' : (isDark ? '#A1A1AA' : '#52525B')} 
                    textAlign='center'
                >
                    {mode.label}
                </Text>
            </YStack>
        </Pressable>
    )
}