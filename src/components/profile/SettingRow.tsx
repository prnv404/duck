import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Pressable, Switch } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

interface SettingRowProps {
    icon: string;
    iconColor: string;
    title: string;
    subtitle?: string;
    hasToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
    isDark: boolean;
}

export default function SettingRow({
    icon,
    iconColor,
    title,
    subtitle,
    hasToggle,
    toggleValue,
    onToggle,
    onPress,
    isDark
}: SettingRowProps) {
    return (
        <Pressable onPress={onPress} disabled={hasToggle}>
            <XStack ai="center" jc="space-between" py="$3">
                <XStack ai="center" gap="$3" f={1}>
                    <YStack
                        w={40}
                        h={40}
                        br={10}
                        ai="center"
                        jc="center"
                        bg={`${iconColor}20`}
                    >
                        <Ionicons name={icon as any} size={20} color={iconColor} />
                    </YStack>
                    <YStack f={1}>
                        <Text
                            fontSize={15}
                            fontWeight="600"
                            color={isDark ? '#e5e7eb' : '#0f172a'}
                        >
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                fontSize={12}
                                color={isDark ? '#9ca3af' : '#6b7280'}
                            >
                                {subtitle}
                            </Text>
                        )}
                    </YStack>
                </XStack>
                {hasToggle ? (
                    <Switch
                        value={toggleValue}
                        onValueChange={(val) => { onToggle?.(val); Haptics.selectionAsync() }}
                        trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#8b5cf6' }}
                        thumbColor="#fff"
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
                )}
            </XStack>
        </Pressable>
    );
}
