import React from 'react';
import { YStack, Text, ScrollView } from 'tamagui';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function TermsScreen() {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';

    const bgColor = isDark ? '#0a0a0a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const textSecondary = isDark ? '#a3a3a3' : '#64748b';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <YStack px="$4" py="$3" borderBottomWidth={1} borderBottomColor={isDark ? '#27272a' : '#e4e4e7'}>
                <Pressable
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.back();
                    }}
                    style={({ pressed }) => ({
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: pressed ? 0.6 : 1,
                    })}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={textColor} />
                </Pressable>
            </YStack>

            <ScrollView showsVerticalScrollIndicator={false}>
                <YStack px="$5" py="$6" gap="$5">
                    <YStack gap="$2">
                        <Text fontFamily="Nunito_900Black" fontSize={32} color={textColor} letterSpacing={-1}>
                            Terms & Legal
                        </Text>
                        <Text fontFamily="Nunito_600SemiBold" fontSize={14} color={textSecondary}>
                            Last updated: December 2024
                        </Text>
                    </YStack>

                    <Section
                        title="Acceptance of Terms"
                        content="By accessing and using Duck, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app."
                        isDark={isDark}
                    />

                    <Section
                        title="Use of Service"
                        content="Duck is a free educational platform designed to help users prepare for PSC exams. You agree to use the service only for lawful purposes and in accordance with these terms."
                        isDark={isDark}
                    />

                    <Section
                        title="User Accounts"
                        content="You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account."
                        isDark={isDark}
                    />

                    <Section
                        title="Content and Intellectual Property"
                        content="All content provided through Duck, including questions, explanations, and educational materials, is owned by Duck or its licensors. You may not reproduce, distribute, or create derivative works without permission."
                        isDark={isDark}
                    />

                    <Section
                        title="Free Service"
                        content="Duck is provided completely free of charge. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice."
                        isDark={isDark}
                    />

                    <Section
                        title="Disclaimer of Warranties"
                        content="Duck is provided 'as is' without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. Use of the service is at your own risk."
                        isDark={isDark}
                    />

                    <Section
                        title="Limitation of Liability"
                        content="Duck and its creators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service."
                        isDark={isDark}
                    />

                    <Section
                        title="Changes to Terms"
                        content="We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms."
                        isDark={isDark}
                    />

                    <Section
                        title="Contact"
                        content="For questions about these Terms of Service, please contact us through the app or via email."
                        isDark={isDark}
                    />
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}

function Section({ title, content, isDark }: { title: string; content: string; isDark: boolean }) {
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const textSecondary = isDark ? '#d4d4d8' : '#3f3f46';

    return (
        <YStack gap="$2">
            <Text fontFamily="Nunito_800ExtraBold" fontSize={18} color={textColor}>
                {title}
            </Text>
            <Text fontFamily="Nunito_600SemiBold" fontSize={15} color={textSecondary} lineHeight={24}>
                {content}
            </Text>
        </YStack>
    );
}
