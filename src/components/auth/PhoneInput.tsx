import React, { useState } from 'react';
import { YStack, XStack, Text, Input, Button } from 'tamagui';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
        <YStack gap="$4" width="100%">
            <YStack gap="$2" alignItems="center">
                <Text
                    fontSize={32}
                    fontFamily="Nunito_900Black"
                    color={isDark ? '#ffffff' : '#0a0a0a'}
                    textAlign="center"
                    letterSpacing={-0.5}
                >
                    Welcome Back
                </Text>
                <Text
                    fontSize={15}
                    fontFamily="Nunito_600SemiBold"
                    color={isDark ? '#737373' : '#737373'}
                    textAlign="center"
                >
                    Enter your phone number to continue
                </Text>
            </YStack>

            <YStack
                backgroundColor={isDark ? '#0f0f0f' : '#fafafa'}
                borderRadius={20}
                padding="$4"
                gap="$3"
                borderWidth={1}
                borderColor={error ? '#ef4444' : (isDark ? '#1a1a1a' : '#f0f0f0')}
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.1,
                    shadowRadius: 8,
                }}
            >
                <XStack alignItems="center" gap="$3">
                    <TouchableOpacity
                        onPress={() => setShowCountryPicker(!showCountryPicker)}
                        style={styles.countrySelector}
                    >
                        <Text fontSize={24}>{selectedCountry.flag}</Text>
                        <Text
                            fontSize={16}
                            fontFamily="Nunito_700Bold"
                            color={isDark ? '#ffffff' : '#0a0a0a'}
                        >
                            {selectedCountry.code}
                        </Text>
                    </TouchableOpacity>

                    <YStack height={30} width={1} backgroundColor={isDark ? '#262626' : '#e5e5e5'} />

                    <Input
                        flex={1}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder="Phone Number"
                        placeholderTextColor={isDark ? '#525252' : '#a3a3a3'}
                        keyboardType="phone-pad"
                        fontSize={16}
                        fontFamily="Nunito_600SemiBold"
                        color={isDark ? '#ffffff' : '#0a0a0a'}
                        borderWidth={0}
                        backgroundColor="transparent"
                        maxLength={10}
                        onSubmitEditing={onSubmit}
                        returnKeyType="done"
                    />
                </XStack>
            </YStack>

            {error && (
                <Text
                    fontSize={13}
                    fontFamily="Nunito_600SemiBold"
                    color="#ef4444"
                    marginTop="$-2"
                >
                    {error}
                </Text>
            )}

            {showCountryPicker && (
                <YStack
                    backgroundColor={isDark ? '#0f0f0f' : '#fafafa'}
                    borderRadius={16}
                    padding="$2"
                    gap="$1"
                    borderWidth={1}
                    borderColor={isDark ? '#1a1a1a' : '#f0f0f0'}
                >
                    {COUNTRY_CODES.map((country) => (
                        <TouchableOpacity
                            key={country.code}
                            onPress={() => {
                                setSelectedCountry(country);
                                setShowCountryPicker(false);
                            }}
                            style={styles.countryOption}
                        >
                            <XStack gap="$3" alignItems="center" padding="$3">
                                <Text fontSize={24}>{country.flag}</Text>
                                <Text
                                    fontSize={15}
                                    fontFamily="Nunito_700Bold"
                                    color={isDark ? '#ffffff' : '#0a0a0a'}
                                >
                                    {country.code}
                                </Text>
                                <Text
                                    fontSize={13}
                                    fontFamily="Nunito_600SemiBold"
                                    color={isDark ? '#737373' : '#737373'}
                                >
                                    {country.country}
                                </Text>
                            </XStack>
                        </TouchableOpacity>
                    ))}
                </YStack>
            )}

            <Button
                size="$5"
                marginTop="$2"
                backgroundColor={isValid ? (isDark ? '#ffffff' : '#0a0a0a') : (isDark ? '#1a1a1a' : '#f5f5f5')}
                color={isValid ? (isDark ? '#0a0a0a' : '#ffffff') : (isDark ? '#525252' : '#a3a3a3')}
                fontSize={16}
                fontFamily="Nunito_800ExtraBold"
                borderRadius={16}
                height={52}
                pressStyle={{
                    backgroundColor: isValid ? (isDark ? '#f5f5f5' : '#1a1a1a') : undefined,
                    scale: 0.98
                }}
                disabled={!isValid || loading}
                onPress={onSubmit}
            >
                {loading ? 'Sending OTP...' : 'Continue'}
            </Button>
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
