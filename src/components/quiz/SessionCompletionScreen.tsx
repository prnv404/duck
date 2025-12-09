import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Modal, Pressable } from 'react-native';
import { Text, XStack, YStack, Circle } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SessionCompletionScreenProps {
    visible: boolean;
    sessionData: {
        totalQuestions: number;
        questionsAttempted: number;
        correctAnswers: number;
        wrongAnswers: number;
        accuracy: number | string;
        xpEarned: number;
        timeSpentSeconds: number;
    } | null;
    onContinue: () => void;
}

const AnimatedCounter = ({ value, delay = 0 }: { value: number; delay?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            let current = 0;
            const increment = value / 30;
            if (value === 0) {
                setDisplayValue(0);
                return;
            }

            const interval = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setDisplayValue(value);
                    clearInterval(interval);
                } else {
                    setDisplayValue(Math.floor(current));
                }
            }, 16);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    // Return the number as a string so it can be rendered inside a Text component
    return <>{displayValue}</>;
};

const StatCard = ({
    label,
    value,
    color = "#000000",
    delay,
    icon,
    suffix
}: {
    label: string,
    value: number | string,
    color?: string,
    delay: number,
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    suffix?: string
}) => (
    <YStack
        f={1}
        bg="#f8f9fa"
        br={24}
        py="$3.5" // Slightly tighter vertical padding
        px="$3"
        ai="center"
        jc="space-between"
        minHeight={130} // Reduced slightly to fit smaller screens better
    >
        <MaterialCommunityIcons name={icon} size={20} color={color} style={{ opacity: 0.2 }} />
        <YStack ai="center" mt="$-2">
            <XStack ai="flex-end">
                <Text fontSize={32} fontFamily="Nunito_900Black" color={color} lineHeight={34}>
                    {typeof value === 'number' ? <AnimatedCounter value={value} delay={delay} /> : value}
                </Text>
                {suffix && (
                    <Text fontSize={18} fontFamily="Nunito_700Bold" color={color} lineHeight={30} mb={2} opacity={0.6}>
                        {suffix}
                    </Text>
                )}
            </XStack>
        </YStack>
        <Text fontSize={11} fontFamily="Nunito_700Bold" color="#9CA3AF" letterSpacing={0.5} textTransform="uppercase">
            {label}
        </Text>
    </YStack>
);

export default function SessionCompletionScreen({
    visible,
    sessionData,
    onContinue,
}: SessionCompletionScreenProps) {
    const insets = useSafeAreaInsets();
    const player = useAudioPlayer(require('../../../assets/audio/reward.mp3'));

    useEffect(() => {
        if (visible && sessionData) {
            setTimeout(() => {
                try {
                    player.seekTo(0);
                    player.play();
                } catch (e) { }
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }, 200);
        }
    }, [visible, sessionData]);

    if (!sessionData) return null;

    const { correctAnswers, questionsAttempted, wrongAnswers, accuracy = 0, timeSpentSeconds } = sessionData;
    const accuracyValue = typeof accuracy === 'number' ? accuracy : parseFloat(accuracy || '0');

    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const timeDisplay = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : seconds;
    const timeSuffix = minutes > 0 ? '' : 's';

    return (
        <Modal visible={visible} animationType="fade" statusBarTranslucent transparent={false}>
            {/* FIX: Added `+ 20` to top padding to clear status bar completely.
               Changed `jc` to `flex-start` so content doesn't float up.
            */}
            <YStack f={1} bg="#ffffff" pt={insets.top + 20} pb={insets.bottom + 10} px="$5">

                {/* CONTENT CONTAINER 
                    We use a spacer to push this whole block down slightly, 
                    and `f={1}` to let it take up available space but centered properly.
                */}
                <YStack f={1} jc="center" gap="$6">

                    {/* Header Section */}
                    <YStack ai="center" gap="$2">
                        <Circle size={64} bg="#dcfce7">
                            <MaterialCommunityIcons name="trophy-variant" size={32} color="#16a34a" />
                        </Circle>
                        <YStack ai="center">
                            <Text fontSize={24} fontFamily="Nunito_800ExtraBold" color="#000000">
                                Session Complete!
                            </Text>
                            <Text fontSize={14} fontFamily="Nunito_600SemiBold" color="#9CA3AF">
                                Here is how you performed
                            </Text>
                        </YStack>
                    </YStack>

                    {/* Big Score Section */}
                    {/* Big Score Section */}
                    <YStack ai="center" py="$2">
                        <XStack ai="flex-start" h={100}> {/* Give the container explicit height to prevent layout shifts */}
                            <Text
                                fontSize={80}
                                fontFamily="Nunito_900Black"
                                color="#000000"
                                lineHeight={90} // INCREASED: 80 -> 90 to prevent clipping
                                letterSpacing={-2}
                                pt="$2" // Add slight top padding to push glyphs down into the box
                            >
                                <AnimatedCounter value={accuracyValue} delay={200} />
                            </Text>
                            <Text
                                fontSize={32}
                                fontFamily="Nunito_800ExtraBold"
                                color="#000000"
                                mt="$4" // Push the % symbol down slightly to align with the numbers
                            >
                                %
                            </Text>
                        </XStack>
                        <Text
                            fontSize={12}
                            fontFamily="Nunito_700Bold"
                            color="#9CA3AF"
                            bg="#f3f4f6"
                            px="$3"
                            py="$1"
                            br={12}
                            overflow="hidden"
                            letterSpacing={1}
                            mt="$-2" // Pull the label up slightly closer to the number
                        >
                            ACCURACY
                        </Text>
                    </YStack>

                    {/* Grid System */}
                    <YStack gap="$3">
                        <XStack gap="$3">
                            <StatCard
                                label="Correct"
                                value={correctAnswers}
                                color="#16a34a"
                                delay={300}
                                icon="check-circle-outline"
                            />
                            <StatCard
                                label="Mistakes"
                                value={wrongAnswers}
                                color="#ef4444"
                                delay={400}
                                icon="close-circle-outline"
                            />
                        </XStack>

                        <XStack gap="$3">
                            <StatCard
                                label="Time"
                                value={timeDisplay}
                                suffix={timeSuffix}
                                color="#000000"
                                delay={0}
                                icon="clock-outline"
                            />
                            <StatCard
                                label="Questions"
                                value={questionsAttempted}
                                color="#000000"
                                delay={500}
                                icon="format-list-numbered"
                            />
                        </XStack>
                    </YStack>
                </YStack>

                {/* Footer Button - Pushed to bottom via Flex logic above */}
                <YStack pt="$4">
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onContinue();
                        }}
                        style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
                    >
                        <YStack bg="#000000" h={56} br={28} ai="center" jc="center" shadowColor="#000" shadowOpacity={0.1} shadowRadius={10} shadowOffset={{ width: 0, height: 4 }}>
                            <Text fontSize={17} fontFamily="Nunito_800ExtraBold" color="#ffffff">
                                Continue
                            </Text>
                        </YStack>
                    </Pressable>
                </YStack>

            </YStack>
        </Modal>
    );
}