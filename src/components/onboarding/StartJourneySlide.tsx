import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Button, Input, Text, XStack, YStack } from 'tamagui';

interface StartJourneySlideProps {
    name: string;
    setName: (value: string) => void;
    onComplete: (name: string) => void;
    onBack: () => void;
    isDark: boolean;
    step: number;
    totalSteps: number;
}

export const StartJourneySlide: React.FC<StartJourneySlideProps> = ({
    name,
    setName,
    onComplete,
    onBack,
    isDark,
    step,
    totalSteps,
}) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const bgColor = isDark ? '#151516ff' : '#f8fafc';
    const textColor = isDark ? '#eeebebff' : '#18181b';
    const accent = isDark ? '#fefefeff' : '#080909ff';
    const muted = isDark ? '#a1a1aa' : '#64748b';
    const inputBg = isDark ? '#0d0d0d' : '#ffffff';
    const inputBorder = isDark ? '#1f1f1f' : '#e2dfd2';
    const inputFocusBorder = isDark ? '#5b5b5b' : '#0f8bff';

    const handleSubmit = async () => {
        if (!name.trim()) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        setLoading(true);
        onComplete(name.trim());
    };

    return (
        <YStack flex={1} backgroundColor={bgColor}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={0}
            >
                <YStack
                    flex={1}
                    paddingTop={insets.top + 32}
                    paddingBottom={Math.max(insets.bottom, 24) + 24}
                    paddingHorizontal={24}
                    gap="$6"
                >
                    <XStack alignItems="center" justifyContent="space-between">
                        <Pressable onPress={onBack} hitSlop={12}>
                            <Text fontSize="$3" fontWeight="700" color={muted}>
                                ← Back
                            </Text>
                        </Pressable>
                        <Text fontSize="$2" color={muted} letterSpacing={2} textTransform="uppercase">
                            Step {step}/{totalSteps}
                        </Text>
                        <YStack width={50} />
                    </XStack>

                    <YStack gap="$3" ai="center" mt={32}>
                        <Text
                            fontSize={40}
                            fontWeight="900"
                            color={accent}
                            fontFamily="$heading"
                            lineHeight={44}
                            letterSpacing={-1}
                            ta="center"
                        >
                            Ready to start?
                        </Text>
                        <Text
                            fontSize={18}
                            color={textColor}
                            fontWeight="600"
                            ta="center"
                            lineHeight={26}
                            maxWidth={340}
                        >
                            Begin your PSC exam preparation journey today.
                        </Text>
                    </YStack>

                    <YStack gap="$3" mt="$6">
                        <Text fontSize="$4" color={textColor} fontWeight="700">
                            What should we call you?
                        </Text>
                        <Input
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            height={58}
                            borderRadius={16}
                            backgroundColor={inputBg}
                            borderWidth={2}
                            borderColor={inputBorder}
                            color={textColor}
                            fontSize="$6"
                            fontWeight="600"
                            paddingHorizontal="$4"
                            autoFocus
                            placeholderTextColor={muted}
                            onSubmitEditing={handleSubmit}
                            focusStyle={{
                                borderColor: inputFocusBorder,
                            }}
                        />
                    </YStack>

                    <YStack flex={1} />

                    <Button
                        height={56}
                        borderRadius={16}
                        backgroundColor={accent}
                        color={isDark ? '#000000' : '#ffffff'}
                        fontSize="$5"
                        fontWeight="700"
                        onPress={handleSubmit}
                        disabled={!name.trim() || loading}
                        opacity={name.trim() && !loading ? 1 : 0.4}
                        pressStyle={{ opacity: 0.9, scale: 0.98 }}
                    >
                        {loading ? 'Starting...' : 'Start Learning'}
                    </Button>
                </YStack>
            </KeyboardAvoidingView>
        </YStack>
    );
};
