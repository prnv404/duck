import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Text, XStack, YStack, Circle } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface HomeHeaderProps {
    userName?: string;
    userImage?: string | null;
    level?: number;
    xp?: number;
    isDark: boolean;
}

export default function HomeHeader({
    userName = 'User',
    userImage,
    level = 1,
    xp = 0,
    isDark,
}: HomeHeaderProps) {
    const textMain = isDark ? '#ffffff' : '#0f172a';
    const textSub = isDark ? '#a3a3a3' : '#64748b';

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Get first name only
    const firstName = userName.split(' ')[0];

    return (
        <Animated.View entering={FadeInDown.springify()}>
            <XStack ai="center" jc="space-between">
                {/* Left - User Info */}
                <XStack ai="center" gap="$3" f={1}>
                    {/* Avatar */}
                    <YStack>
                        {userImage ? (
                            <Image
                                source={{ uri: userImage }}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    borderWidth: 2,
                                    borderColor: '#10b981',
                                }}
                            />
                        ) : (
                            <Circle size={48} bg="#10b981">
                                <Text fontSize={20} fontFamily="Nunito_900Black" color="white">
                                    {firstName.charAt(0).toUpperCase()}
                                </Text>
                            </Circle>
                        )}
                    </YStack>

                    {/* Greeting */}
                    <YStack f={1} gap="$0.5">
                        <Text fontSize={13} fontFamily="Nunito_600SemiBold" color={textSub}>
                            {getGreeting()} 👋
                        </Text>
                        <Text
                            fontSize={18}
                            fontFamily="Nunito_900Black"
                            color={textMain}
                            numberOfLines={1}
                        >
                            {firstName}
                        </Text>
                    </YStack>
                </XStack>

                {/* Right - Level & XP */}
                <XStack ai="center" gap="$2">
                    {/* Level Badge */}
                    <XStack
                        ai="center"
                        gap="$1"
                        bg={isDark ? '#8B5CF620' : '#ede9fe'}
                        px="$2"
                        py="$1.5"
                        br={10}
                        borderWidth={1}
                        borderColor={isDark ? '#8B5CF6' : '#c4b5fd'}
                    >
                        <MaterialCommunityIcons name="star" size={14} color="#8B5CF6" />
                        <Text fontSize={13} fontFamily="Nunito_800ExtraBold" color="#8B5CF6">
                            {level}
                        </Text>
                    </XStack>

                    {/* XP Badge */}
                    <XStack
                        ai="center"
                        gap="$1"
                        bg={isDark ? '#f59e0b20' : '#fef3c7'}
                        px="$2"
                        py="$1.5"
                        br={10}
                        borderWidth={1}
                        borderColor={isDark ? '#f59e0b' : '#fde68a'}
                    >
                        <MaterialCommunityIcons name="lightning-bolt" size={14} color="#F59E0B" />
                        <Text fontSize={13} fontFamily="Nunito_800ExtraBold" color="#F59E0B">
                            {xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : xp}
                        </Text>
                    </XStack>
                </XStack>
            </XStack>
        </Animated.View>
    );
}
