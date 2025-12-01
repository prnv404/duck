import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { Button, Text, XStack, YStack } from 'tamagui';

type ConfirmDialogTone = 'info' | 'danger';

interface ConfirmDialogProps {
    visible: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    iconName?: React.ComponentProps<typeof Ionicons>['name'];
    tone?: ConfirmDialogTone;
    loading?: boolean;
    isDark?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const tonePalette: Record<
    ConfirmDialogTone,
    { accent: string; accentBg: string; confirmBg: string; confirmText: string }
> = {
    info: {
        accent: '#0ea5e9',
        accentBg: '#e0f2fe',
        confirmBg: '#0ea5e9',
        confirmText: '#ffffff',
    },
    danger: {
        accent: '#ef4444',
        accentBg: '#fee2e2',
        confirmBg: '#ef4444',
        confirmText: '#ffffff',
    },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    visible,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    iconName = 'alert-circle-outline',
    tone = 'info',
    loading = false,
    isDark = false,
    onCancel,
    onConfirm,
}) => {
    const palette = tonePalette[tone];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                if (!loading) {
                    onCancel();
                }
            }}
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} disabled={loading} />

                <Animated.View entering={FadeInUp.springify()} exiting={FadeOutDown} style={{ width: '80%' }}>
                    <YStack
                        bg={isDark ? '#0f172a' : '#ffffff'}
                        borderRadius={24}
                        padding="$5"
                        shadowColor="rgba(15, 23, 42, 0.4)"
                        shadowOffset={{ width: 0, height: 12 }}
                        shadowOpacity={0.5}
                        shadowRadius={24}
                        elevation={12}
                        gap="$4"
                    >
                        <YStack
                            width={56}
                            height={56}
                            borderRadius={16}
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor={palette.accentBg}
                            alignSelf="center"
                        >
                            <Ionicons name={iconName} size={28} color={palette.accent} />
                        </YStack>

                        <YStack gap="$2">
                            <Text
                                fontSize={22}
                                fontFamily="Nunito_900Black"
                                textAlign="center"
                                color={isDark ? '#f8fafc' : '#0f172a'}
                            >
                                {title}
                            </Text>
                            {description ? (
                                <Text
                                    fontSize={15}
                                    textAlign="center"
                                    fontFamily="Nunito_600SemiBold"
                                    color={isDark ? '#94a3b8' : '#475569'}
                                >
                                    {description}
                                </Text>
                            ) : null}
                        </YStack>

                        <XStack gap="$3">
                            <Button
                                flex={1}
                                height={48}
                                borderRadius={16}
                                borderWidth={1}
                                borderColor={isDark ? '#1f2937' : '#e2e8f0'}
                                backgroundColor={isDark ? '#0b1120' : '#ffffff'}
                                color={isDark ? '#e2e8f0' : '#0f172a'}
                                fontFamily="Nunito_800ExtraBold"
                                disabled={loading}
                                opacity={loading ? 0.6 : 1}
                                onPress={onCancel}
                            >
                                {cancelLabel}
                            </Button>

                            <Button
                                flex={1}
                                height={48}
                                borderRadius={16}
                                backgroundColor={palette.confirmBg}
                                color={palette.confirmText}
                                fontFamily="Nunito_900Black"
                                disabled={loading}
                                opacity={loading ? 0.6 : 1}
                                onPress={onConfirm}
                            >
                                {loading ? 'Please wait...' : confirmLabel}
                            </Button>
                        </XStack>
                    </YStack>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(2, 6, 23, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
});


