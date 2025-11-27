import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

interface EnhancedStatCardProps {
    icon: string;
    value: string | number;
    label: string;
    color: string;
    trend: string;
    isDark: boolean;
}

export default function EnhancedStatCard({ icon, value, label, color, trend, isDark }: EnhancedStatCardProps) {
    return (
        <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <YStack
                flex={1}
                bg={isDark ? '#0f0f0f' : '#fafafa'}
                p="$4"
                br={20}
                gap="$3"
                borderWidth={1}
                borderColor={isDark ? '#1a1a1a' : '#f0f0f0'}
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isDark ? 0.3 : 0.06,
                    shadowRadius: 12,
                    elevation: 6,
                    minHeight: 120,
                    transform: [{ scale: 1 }],
                }}
                pressStyle={{ transform: [{ scale: 0.98 }] }}
            >
                <XStack jc="space-between" ai="flex-start">
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${color}15`, alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
                    </View>
                    <XStack bg={`${color}15`} px="$2" py="$1" br={8} ai="center" gap="$1">
                        <MaterialCommunityIcons name="trending-up" size={12} color={color} />
                        <Text fontSize={11} fontFamily="Nunito_800ExtraBold" color={color}>
                            {trend}
                        </Text>
                    </XStack>
                </XStack>
                <YStack gap="$1">
                    <Text fontSize={28} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#0a0a0a'}>
                        {value}
                    </Text>
                    <Text fontSize={13} color={isDark ? '#737373' : '#a3a3a3'} fontFamily="Nunito_700Bold">
                        {label}
                    </Text>
                </YStack>
            </YStack>
        </Pressable>
    );
}
