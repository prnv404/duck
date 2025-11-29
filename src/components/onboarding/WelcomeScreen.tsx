import React from 'react';
import { YStack, Text, Button } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

interface WelcomeScreenProps {
    onNext: () => void;
    isDark: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, isDark }) => {
    const insets = useSafeAreaInsets();

    const bgColor = isDark ? '#0a0a0a' : '#faf9f6';
    const textColor = isDark ? '#fff' : '#2c2c2c';
    const mutedColor = isDark ? '#999' : '#666';
    const borderColor = isDark ? '#333' : '#2c2c2c';
    const buttonBg = isDark ? '#fff' : '#2c2c2c';
    const buttonText = isDark ? '#000' : '#faf9f6';

    return (
        <YStack flex={1} backgroundColor={bgColor}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: insets.top + 60,
                    paddingBottom: Math.max(insets.bottom, 20) + 20,
                    paddingHorizontal: 24,
                }}
            >
                <YStack flex={1} justifyContent="space-between" gap="$8">
                    {/* Header */}
                    <YStack gap="$8">
                        {/* Badge */}
                        <YStack
                            paddingHorizontal="$4"
                            paddingVertical="$2"
                            borderRadius={100}
                            borderWidth={1.5}
                            borderColor={borderColor}
                            alignSelf="flex-start"
                        >
                            <Text
                                fontSize="$2"
                                fontWeight="600"
                                color={textColor}
                                fontFamily="$heading"
                                textTransform="uppercase"
                                letterSpacing={1.5}
                            >
                                Study Platform
                            </Text>
                        </YStack>

                        {/* Hero Text */}
                        <YStack gap="$5">
                            <Text
                                fontSize={48}
                                fontWeight="900"
                                color={textColor}
                                fontFamily="$heading"
                                lineHeight={52}
                                letterSpacing={-1}
                            >
                                Learn at your{'\n'}own pace
                            </Text>

                            <Text
                                fontSize="$5"
                                color={mutedColor}
                                fontFamily="$body"
                                lineHeight={28}
                                maxWidth={340}
                            >
                                Master competitive exams with personalized practice sessions and detailed performance insights.
                            </Text>
                        </YStack>

                        {/* Features */}
                        <YStack gap="$5" marginTop="$4">
                            {[
                                { number: '01', title: 'Smart Practice', desc: 'Questions adapted to your level' },
                                { number: '02', title: 'Instant Analysis', desc: 'Understand mistakes immediately' },
                                { number: '03', title: 'Progress Tracking', desc: 'Monitor your improvement daily' },
                            ].map((item) => (
                                <YStack key={item.number} gap="$2">
                                    <Text
                                        fontSize="$2"
                                        fontWeight="700"
                                        color={isDark ? '#666' : '#999'}
                                        fontFamily="$heading"
                                        letterSpacing={2}
                                    >
                                        {item.number}
                                    </Text>
                                    <YStack gap="$1">
                                        <Text
                                            fontSize="$5"
                                            fontWeight="700"
                                            color={textColor}
                                            fontFamily="$heading"
                                        >
                                            {item.title}
                                        </Text>
                                        <Text
                                            fontSize="$3"
                                            color={mutedColor}
                                            fontFamily="$body"
                                            lineHeight={20}
                                        >
                                            {item.desc}
                                        </Text>
                                    </YStack>
                                </YStack>
                            ))}
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
                            onPress={onNext}
                            pressStyle={{
                                backgroundColor: isDark ? '#e6e6e6' : '#1a1a1a',
                                scale: 0.99,
                            }}
                            animation="quick"
                        >
                            Get Started
                        </Button>
                    </YStack>
                </YStack>
            </ScrollView>
        </YStack>
    );
};
