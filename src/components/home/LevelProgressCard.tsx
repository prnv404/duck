import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { Text, XStack, YStack, Circle, Stack } from 'tamagui';
import Animated, { 
  FadeInDown, 
  ZoomIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface LevelProgressCardProps {
    level: number;
    xp: number;
    xpToNextLevel: number;
    xpProgress: number; // 0 to 100
    isDark: boolean;
}

export default function LevelProgressCard({ level, xp, xpToNextLevel, xpProgress, isDark }: LevelProgressCardProps) {
    // Shared value for progress animation
    const progressWidth = useSharedValue(0);

    // Trigger animation on mount or when props change
    useEffect(() => {
        progressWidth.value = withDelay(500, withSpring(xpProgress, { damping: 12, stiffness: 90 }));
    }, [xpProgress]);

    const progressAnimatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`,
        };
    });

    // Theme Colors (Gamified Palette)
    const cardBg = isDark ? ['#1a1a1a', '#0f0f0f'] : ['#ffffff', '#f5f5f5'];
    const accentGradient = ['#FFD700', '#FDB931']; // Gold gradient
    const barTrackColor = isDark ? '#333' : '#e0e0e0';
    const textColor = isDark ? '#fff' : '#1a1a1a';

    return (
        <Animated.View entering={FadeInDown.delay(100).springify()}>
            {/* Main Card Container with subtle border gradient effect */}
            <LinearGradient
                colors={isDark ? ['#333', '#111'] : ['#ddd', '#fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 28, padding: 1.5 }} // Create a border via padding
            >
                <LinearGradient
                    colors={cardBg as any}
                    style={{
                        padding: 16,
                        borderRadius: 27,
                        justifyContent: 'space-between',
                    }}
                >
                    <XStack ai="center" gap="$4">
                        
                        {/* THE BADGE: Looks like a physical coin/token */}
                        <Stack>
                            <Animated.View entering={ZoomIn.delay(300).springify()}>
                                <LinearGradient
                                    colors={accentGradient as any}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        shadowColor: '#FDB931',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 10,
                                        elevation: 8,
                                        borderWidth: 2,
                                        borderColor: '#fff',
                                    }}
                                >
                                    {/* Inner ring for detail */}
                                    <View style={{ 
                                        width: 70, height: 70, borderRadius: 35, 
                                        borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Text fontSize={10} color="#8a5e00" fontFamily="Nunito_800ExtraBold" letterSpacing={1}>
                                            LEVEL
                                        </Text>
                                        <Text fontSize={32} color="#4a3200" fontFamily="Nunito_900Black" lineHeight={34} mt={-2}>
                                            {level}
                                        </Text>
                                    </View>
                                </LinearGradient>
                                
                                {/* Absolute positioned star badge */}
                                <View style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: isDark ? '#1a1a1a' : '#fff', borderRadius: 12, padding: 2 }}>
                                   <Ionicons name="shield-checkmark" size={24} color="#FDB931" />
                                </View>
                            </Animated.View>
                        </Stack>

                        {/* INFO & PROGRESS */}
                        <YStack flex={1} gap="$2.5">
                            <XStack jc="space-between" ai="flex-end">
                                <YStack>
                                    <Text fontSize={18} fontFamily="Nunito_800ExtraBold" color={textColor}>
                                        Next Reward
                                    </Text>
                                    <Text fontSize={12} color={isDark ? '#888' : '#666'} fontFamily="Nunito_600SemiBold">
                                        Level {level + 1}
                                    </Text>
                                </YStack>
                                
                                <XStack ai="center" gap="$1.5" bg={isDark ? '#2a2a2a' : '#eee'} px="$2.5" py="$1" br={12}>
                                    <MaterialCommunityIcons name="lightning-bolt" size={16} color="#f59e0b" />
                                    <Text fontSize={13} fontFamily="Nunito_800ExtraBold" color={textColor}>
                                        {xp} <Text color="#888" fontSize={11}>XP</Text>
                                    </Text>
                                </XStack>
                            </XStack>

                            {/* PROGRESS BAR CONTAINER */}
                            <YStack gap="$1.5">
                                <View 
                                    style={{ 
                                        height: 14, 
                                        backgroundColor: barTrackColor, 
                                        borderRadius: 8, 
                                        overflow: 'hidden',
                                        borderWidth: 1,
                                        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Animated.View style={[{ height: '100%', borderRadius: 8 }, progressAnimatedStyle]}>
                                        <LinearGradient
                                            colors={['#f59e0b', '#fbbf24']} // Amber/Gold progress
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                        {/* Shine effect overlay */}
                                        <LinearGradient
                                            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                                        />
                                    </Animated.View>
                                </View>
                                
                                <XStack jc="space-between">
                                    <Text fontSize={11} color={isDark ? '#666' : '#999'} fontFamily="Nunito_700Bold">
                                        0 XP
                                    </Text>
                                    <Text fontSize={11} color={isDark ? '#f59e0b' : '#d97706'} fontFamily="Nunito_700Bold">
                                        {xpToNextLevel} needed
                                    </Text>
                                </XStack>
                            </YStack>
                        </YStack>
                    </XStack>
                </LinearGradient>
            </LinearGradient>
        </Animated.View>
    );
}