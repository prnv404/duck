import React, { useState } from 'react';
import { YStack, XStack, Text, Input, Button } from 'tamagui';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    onSubmit: () => void;
    loading?: boolean;
}

const COUNTRY_CODES = [
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
];

export function PhoneInput({ value, onChangeText, error, onSubmit, loading }: PhoneInputProps) {
    const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const isDark = useColorScheme() === 'dark';

    const isValid = value.length >= 10;

    return (
        <YStack gap="$6" alignItems="center" width="100%">
            {/* <YStack
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor={isDark ? '#1a1a1a' : '#f3f4f6'}
                alignItems="center"
                justifyContent="center"
                marginBottom="$2"
            >
                <MaterialCommunityIcons name="cellphone" size={40} color={isDark ? '#ffffff' : '#0a0a0a'} />
            </YStack> */}

            <YStack gap="$2" alignItems="center">
                <Text
                    fontSize={28}
                    fontFamily="Nunito_900Black"
                    color={isDark ? '#ffffff' : '#0a0a0a'}
                    textAlign="center"
                    letterSpacing={-0.5}
                >
                    Welcome Back
                </Text>
                <Text
                    fontSize={16}
                    fontFamily="Nunito_600SemiBold"
                    color={isDark ? '#a1a1aa' : '#525252'}
                    textAlign="center"
                >
                    Enter your phone number to continue
                </Text>
            </YStack>

            <YStack width="100%" gap="$4">
                <YStack
                    backgroundColor={isDark ? '#0f0f0f' : '#ffffff'}
                    borderRadius={24}
                    padding="$4"
                    borderWidth={1.5}
                    borderColor={error ? '#ef4444' : (isDark ? '#262626' : '#e5e5e5')}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDark ? 0.3 : 0.05,
                        shadowRadius: 12,
                        elevation: 4,
                    }}
                >
                    <XStack alignItems="center" gap="$3">
                        <TouchableOpacity
                            onPress={() => setShowCountryPicker(!showCountryPicker)}
                            style={styles.countrySelector}
                        >
                            <Text fontSize={24}>{selectedCountry.flag}</Text>
                            <Text
                                fontSize={17}
                                fontFamily="Nunito_700Bold"
                                color={isDark ? '#ffffff' : '#0a0a0a'}
                            >
                                {selectedCountry.code}
                            </Text>
                            <MaterialCommunityIcons name="chevron-down" size={20} color={isDark ? '#737373' : '#a3a3a3'} />
                        </TouchableOpacity>

                        <YStack height={24} width={1.5} backgroundColor={isDark ? '#262626' : '#e5e5e5'} />

                        <Input
                            flex={1}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder="Phone Number"
                            placeholderTextColor={isDark ? '#525252' : '#a3a3a3'}
                            keyboardType="phone-pad"
                            fontSize={18}
                            fontFamily="Nunito_700Bold"
                            color={isDark ? '#ffffff' : '#0a0a0a'}
                            borderWidth={0}
                            backgroundColor="transparent"
                            maxLength={10}
                            onSubmitEditing={onSubmit}
                            returnKeyType="done"
                            letterSpacing={0.5}
                        />
                    </XStack>
                </YStack>

                {error && (
                    <XStack gap="$2" alignItems="center" justifyContent="center" marginTop="$-2">
                        <MaterialCommunityIcons name="alert-circle" size={16} color="#ef4444" />
                        <Text
                            fontSize={13}
                            fontFamily="Nunito_600SemiBold"
                            color="#ef4444"
                        >
                            {error}
                        </Text>
                    </XStack>
                )}

                <Button
                    size="$5"
                    backgroundColor={isValid ? (isDark ? '#ffffff' : '#0a0a0a') : (isDark ? '#1a1a1a' : '#f3f4f6')}
                    color={isValid ? (isDark ? '#0a0a0a' : '#ffffff') : (isDark ? '#525252' : '#a3a3a3')}
                    fontSize={17}
                    fontFamily="Nunito_800ExtraBold"
                    borderRadius={24}
                    height={56}
                    pressStyle={{
                        backgroundColor: isValid ? (isDark ? '#e5e5e5' : '#262626') : undefined,
                        scale: 0.98
                    }}
                    disabled={!isValid || loading}
                    onPress={onSubmit}
                    icon={loading ? undefined : <MaterialCommunityIcons name="arrow-right" size={20} color={isValid ? (isDark ? '#0a0a0a' : '#ffffff') : (isDark ? '#525252' : '#a3a3a3')} />}
                >
                    {loading ? 'Sending Code...' : 'Continue'}
                </Button>
            </YStack>
        </YStack>
    );
}

const styles = StyleSheet.create({
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countryOption: {
        borderRadius: 12,
    },
});
