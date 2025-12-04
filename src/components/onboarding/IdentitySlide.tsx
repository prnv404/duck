import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Button, Input, Text, XStack, YStack } from 'tamagui';

interface IdentitySlideProps {
    name: string;
    setName: (value: string) => void;
    onComplete: (name: string) => void;
    onBack: () => void;
    isDark: boolean;
    step: number;
    totalSteps: number;
}

export const IdentitySlide: React.FC<IdentitySlideProps> = ({
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

    const bgColor = isDark ? '#151516ff' : '#fdfcf7';
    const textColor = isDark ? '#fff' : '#18181b';
    const muted = isDark ? '#c5c5c5' : '#555';
    const inputBg = isDark ? '#0d0d0d' : '#ffffff';
    const inputBorder = isDark ? '#1f1f1f' : '#e2dfd2';
    const inputFocusBorder = isDark ? '#5b5b5b' : '#0f8bff';
    const buttonBg = isDark ? '#f97316' : '#ea580c';

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

                    <YStack gap="$2">
                        <Text fontSize="$2" color={muted} letterSpacing={2} textTransform="uppercase">
                            Personal touch
                        </Text>
                        <Text
                            fontSize={40}
                            fontWeight="900"
                            color={textColor}
                            fontFamily="$heading"
                            lineHeight={44}
                            letterSpacing={-1}
                        >
                            Who should we cheer for?
                        </Text>
                        <Text fontSize="$4" color={muted} lineHeight={22}>
                            Your name shows up on streak cards and mentor shout-outs.
                        </Text>
                    </YStack>

                    <YStack gap="$2">
                        <Text fontSize="$3" color={textColor} fontWeight="700">
                            First name
                        </Text>
                        <Input
                            value={name}
                            onChangeText={setName}
                            placeholder="Ex: Aditi"
                            height={58}
                            borderRadius={16}
                            backgroundColor={inputBg}
                            borderWidth={2}
                            borderColor={inputBorder}
                            color={textColor}
                            fontSize="$6"
                            fontWeight="700"
                            paddingHorizontal="$4"
                            autoFocus
                            placeholderTextColor={muted}
                            onSubmitEditing={handleSubmit}
                            focusStyle={{
                                borderColor: inputFocusBorder,
                            }}
                        />
                            <Text fontSize="$3" color={muted}>
                                Only you and your mentor see this.
                        </Text>
                    </YStack>

                    <YStack gap="$3" marginTop="$2">
                        <Button
                            height={58}
                            borderRadius={18}
                            backgroundColor={buttonBg}
                            color="#fff"
                            fontSize="$5"
                            fontWeight="700"
                            onPress={handleSubmit}
                            disabled={!name.trim() || loading}
                            opacity={name.trim() && !loading ? 1 : 0.4}
                            pressStyle={{ opacity: 0.9, scale: 0.98 }}
                        >
                            {loading ? 'Launching...' : 'Launch my prep HQ'}
                        </Button>
                    </YStack>
                </YStack>
            </KeyboardAvoidingView>
        </YStack>
    );
};


