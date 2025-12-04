import React from 'react';
import { YStack, Text, ScrollView } from 'tamagui';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function PrivacyPolicyScreen() {
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
                            Privacy Policy
                        </Text>
                        <Text fontFamily="Nunito_600SemiBold" fontSize={14} color={textSecondary}>
                            Last updated: December 2024
                        </Text>
                    </YStack>

                    <Section
                        title="Introduction"
                        content="Duck is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our PSC exam practice application."
                        isDark={isDark}
                    />

                    <Section
                        title="Information We Collect"
                        content="We collect information you provide directly to us, including your name, email address, and profile information when you sign in with Google. We also collect usage data such as quiz performance, study time, and progress metrics to provide personalized learning experiences."
                        isDark={isDark}
                    />

                    <Section
                        title="How We Use Your Information"
                        content="We use your information to provide and improve our services, personalize your learning experience, track your progress, maintain your streak data, and communicate important updates about the app."
                        isDark={isDark}
                    />

                    <Section
                        title="Data Security"
                        content="We implement appropriate security measures to protect your personal information. Your data is encrypted in transit and at rest. We use secure authentication through Google Sign-In to protect your account."
                        isDark={isDark}
                    />

                    <Section
                        title="Data Sharing"
                        content="We do not sell your personal information. We may share data with service providers who help us operate the app, but only to the extent necessary and under strict confidentiality agreements."
                        isDark={isDark}
                    />

                    <Section
                        title="Your Rights"
                        content="You have the right to access, update, or delete your personal information. You can request data deletion by contacting us. When you delete your account, we will remove your personal data from our systems."
                        isDark={isDark}
                    />

                    <Section
                        title="Contact Us"
                        content="If you have questions about this Privacy Policy, please contact us through the app or via email."
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
