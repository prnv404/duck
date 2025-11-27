import { Image, Text, XStack, YStack } from 'tamagui';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';

interface ProfileHeaderProps {
    name: string;
    email: string;
    avatar: string;
    level: number;
    currentXP: number;
    nextLevelXP: number;
    xpProgress: number;
    isDark: boolean;
}

export default function ProfileHeader({
    name,
    email,
    avatar,
    level,
    currentXP,
    nextLevelXP,
    xpProgress,
    isDark
}: ProfileHeaderProps) {
    // Gamified colors: Energetic and vibrant
    const primaryBg = isDark ? '#0f0f23' : '#f8fafc';
    const accentColor = '#6366f1'; // Indigo for learning vibe
    const levelColor = '#eab308'; // Amber for achievement
    const textPrimary = isDark ? '#f8fafc' : '#0f172a';
    const textSecondary = isDark ? '#cbd5e1' : '#475569';
    const progressBg = isDark ? '#1e293b' : '#e2e8f0';
    const shadowProps = isDark 
        ? { shadowOpacity: 0.4, shadowRadius: 16, shadowColor: '#000' } 
        : { shadowOpacity: 0.15, shadowRadius: 12, shadowColor: '#000' };

    // Animation for avatar hover/scale effect
    const avatarScale = useSharedValue(1);

    const avatarAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: avatarScale.value }],
    }));

    const handleAvatarPress = () => {
        avatarScale.value = withSpring(1.05, { damping: 10, stiffness: 100 });
        setTimeout(() => {
            avatarScale.value = withSpring(1);
        }, 200);
    };

    return (
        <Animated.View entering={FadeInDown.delay(100)}>
            <YStack mx="$3" mb="$5">
                <YStack
                    br={24}
                    overflow="hidden"
                    style={shadowProps}
                >
                    <YStack
                        bg={primaryBg}
                        p="$5"
                    >
                        {/* Gamified Header Row */}
                        <XStack ai="center" gap="$4" mb="$4">
                            {/* Central Avatar with Level Badge */}
                            <Pressable onPress={handleAvatarPress}>
                                <Animated.View style={avatarAnimatedStyle}>
                                    <YStack position="relative">
                                        <YStack
                                            w={84}
                                            h={84}
                                            br={42}
                                            overflow="hidden"
                                            ai="center"
                                            jc="center"
                                            style={{
                                                borderWidth: 3,
                                                borderColor: isDark ? '#1e40af' : '#3b82f6',
                                            }}
                                        >
                                            {avatar && avatar.startsWith('http') ? (
                                                <Image
                                                    source={{ uri: avatar }}
                                                    width={84}
                                                    height={84}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <YStack
                                                    bg={accentColor}
                                                    ai="center"
                                                    jc="center"
                                                    style={{ width: 84, height: 84, borderRadius: 42 }}
                                                >
                                                    <Text fontSize={42} color="#fff" fontFamily="Nunito_900Black">
                                                        {avatar || '👤'}
                                                    </Text>
                                                </YStack>
                                            )}
                                        </YStack>
                                        {/* Prominent Level Badge */}
                                        <YStack
                                            position="absolute"
                                            bottom={-6}
                                            right={-6}
                                            w={40}
                                            h={40}
                                            br={20}
                                            ai="center"
                                            jc="center"
                                            bg={levelColor}
                                            style={{
                                                borderWidth: 3,
                                                borderColor: primaryBg,
                                                shadowColor: levelColor,
                                                shadowOpacity: 0.6,
                                                shadowRadius: 8,
                                                elevation: 6,
                                            }}
                                        >
                                            <Text fontSize={14} fontFamily="Nunito_900Black" color="#fff" letterSpacing={0.5}>
                                                L{level}
                                            </Text>
                                        </YStack>
                                    </YStack>
                                </Animated.View>
                            </Pressable>

                            {/* Profile Info */}
                            <YStack f={1} gap="$1">
                                <Text fontSize={24} fontFamily="Nunito_900Black" color={textPrimary} letterSpacing={-0.5}>
                                    {name}
                                </Text>
                                <Text fontSize={14} fontFamily="Nunito_600SemiBold" color={textSecondary}>
                                    {email}
                                </Text>
                                {/* Gamified Level Indicator */}
                                <XStack ai="center" gap="$1.5">
                                    <YStack
                                        w={8} h={8}
                                        br="$1"
                                        bg={accentColor}
                                    />
                                    <Text fontSize={12} fontFamily="Nunito_700Bold" color={accentColor}>
                                        Level {level} Scholar
                                    </Text>
                                </XStack>
                            </YStack>

                            {/* XP Sparkle Icon */}
                            <YStack ai="center" jc="center" opacity={0.7}>
                                <Text fontSize={24}>✨</Text>
                            </YStack>
                        </XStack>

                        {/* Gamified XP Progress Bar */}
                        <Animated.View entering={FadeIn.delay(300)}>
                            <YStack gap="$2">
                                <XStack jc="space-between" ai="center">
                                    <Text fontSize={13} fontFamily="Nunito_700Bold" color={textSecondary}>
                                        XP to Next Level
                                    </Text>
                                    <Text fontSize={13} fontFamily="Nunito_700Bold" color={accentColor}>
                                        {Math.round(xpProgress)}% Complete
                                    </Text>
                                </XStack>
                                <YStack
                                    h={12}
                                    bg={progressBg}
                                    br={6}
                                    overflow="hidden"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: isDark ? '#334155' : '#cbd5e1',
                                    }}
                                >
                                    <YStack
                                        w={`${xpProgress}%`}
                                        h="100%"
                                        bg={accentColor}
                                        style={{
                                            shadowColor: accentColor,
                                            shadowOpacity: 0.4,
                                            shadowRadius: 4,
                                            elevation: 4,
                                        }}
                                    >
                                        {/* Subtle shine effect via pseudo-element like overlay */}
                                        <YStack
                                            w="100%"
                                            h="100%"
                                            bg={['transparent', `${accentColor}20`, 'transparent']as any}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                borderRadius: 6,
                                            }}
                                        />
                                    </YStack>
                                </YStack>
                                <XStack jc="space-between">
                                    <Text fontSize={11} fontFamily="Nunito_600SemiBold" color={textSecondary}>
                                        {currentXP} XP
                                    </Text>
                                    <Text fontSize={11} fontFamily="Nunito_600SemiBold" color={textSecondary}>
                                        {nextLevelXP} XP
                                    </Text>
                                </XStack>
                            </YStack>
                        </Animated.View>
                    </YStack>
                </YStack>
            </YStack>
        </Animated.View>
    );
}