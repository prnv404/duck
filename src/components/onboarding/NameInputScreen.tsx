import React, { useState } from 'react';
import { YStack, Text, Input, Button } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface NameInputScreenProps {
    name: string;
    setName: (name: string) => void;
    onComplete: (name: string) => void;
    onBack: () => void;
    isDark: boolean;
}

export const NameInputScreen: React.FC<NameInputScreenProps> = ({
    name,
    setName,
    onComplete,
    onBack,
    isDark,
}) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        setLoading(true);
        onComplete(name);
    };

    const bgColor = isDark ? '#0a0a0a' : '#faf9f6';
    const textColor = isDark ? '#fff' : '#2c2c2c';
    const mutedColor = isDark ? '#999' : '#666';
    const inputBg = isDark ? '#1a1a1a' : '#ffffff';
    const inputBorder = isDark ? '#333' : '#d4d4d4';
    const inputFocusBorder = isDark ? '#666' : '#2c2c2c';
    const buttonBg = isDark ? '#fff' : '#2c2c2c';
    const buttonText = isDark ? '#000' : '#faf9f6';
    const progressInactive = isDark ? '#333' : '#d4d4d4';
    const progressActive = isDark ? '#fff' : '#2c2c2c';

    return (
        <YStack flex={1} backgroundColor={bgColor}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <YStack
                        flex={1}
                        paddingTop={insets.top + 60}
                        paddingBottom={Math.max(insets.bottom, 20) + 20}
                        paddingHorizontal={24}
                        justifyContent="space-between"
                        gap="$8"
                    >
                        {/* Header */}
                        <YStack gap="$8">
                            {/* Back Button + Progress */}
                            <YStack gap="$4">
                                <Pressable
                                    onPress={onBack}
                                    style={{
                                        alignSelf: 'flex-start',
                                        paddingVertical: 8,
                                        paddingRight: 12,
                                    }}
                                >
                                    <Text fontSize="$8" color={textColor}>←</Text>
                                </Pressable>

                                <YStack flexDirection="row" gap="$2">
                                    <YStack
                                        flex={1}
                                        height={2}
                                        backgroundColor={progressInactive}
                                        borderRadius={10}
                                    />
                                    <YStack
                                        flex={1}
                                        height={2}
                                        backgroundColor={progressActive}
                                        borderRadius={10}
                                    />
                                </YStack>
                            </YStack>

                            {/* Title */}
                            <YStack gap="$5">
                                <Text
                                    fontSize={44}
                                    fontWeight="900"
                                    color={textColor}
                                    fontFamily="$heading"
                                    lineHeight={48}
                                    letterSpacing={-1}
                                >
                                    What's your{'\n'}name?
                                </Text>

                                <Text
                                    fontSize="$5"
                                    color={mutedColor}
                                    fontFamily="$body"
                                    lineHeight={26}
                                    maxWidth={300}
                                >
                                    We'll use this to personalize your learning journey.
                                </Text>
                            </YStack>

                            {/* Input */}
                            <YStack gap="$3" marginTop="$2">
                                <Input
                                    height={56}
                                    placeholder="Enter your name"
                                    value={name}
                                    onChangeText={setName}
                                    fontSize="$6"
                                    fontWeight="600"
                                    backgroundColor={inputBg}
                                    borderWidth={2}
                                    borderColor={inputBorder}
                                    color={textColor}
                                    placeholderTextColor={mutedColor}
                                    borderRadius={14}
                                    paddingHorizontal="$4"
                                    autoFocus
                                    onSubmitEditing={handleSubmit}
                                    focusStyle={{
                                        borderColor: inputFocusBorder,
                                    }}
                                />

                                <Text
                                    fontSize="$2"
                                    color={mutedColor}
                                    fontFamily="$body"
                                    paddingHorizontal="$1"
                                >
                                    Only visible to you
                                </Text>
                            </YStack>
                        </YStack>

                        {/* CTA */}
                        <YStack gap="$3">
                            <Button
                                height={56}
                                backgroundColor={buttonBg}
                                color={buttonText}
                                fontSize="$5"
                                fontWeight="700"
                                borderRadius={14}
                                onPress={handleSubmit}
                                disabled={!name.trim() || loading}
                                opacity={name.trim() && !loading ? 1 : 0.4}
                                pressStyle={{
                                    backgroundColor: isDark ? '#e6e6e6' : '#1a1a1a',
                                    scale: 0.99,
                                }}
                                animation="quick"
                            >
                                {loading ? 'Starting...' : 'Continue'}
                            </Button>
                        </YStack>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </YStack>
    );
};
