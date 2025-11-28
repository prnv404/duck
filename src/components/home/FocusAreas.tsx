import StreakCalendar from '@/components/StreakCalendar';
import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, Alert } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FocusAreasProps {
    currentStreak: number;
    isDark: boolean;
}

const subjectData = [
    { id: 'polity', name: 'Indian Polity', accuracy: 35, status: 'Weak', color: '#ef4444', icon: 'bank' },
    { id: 'history', name: 'History', accuracy: 42, status: 'Weak', color: '#f97316', icon: 'book-open-variant' },
    { id: 'geography', name: 'Geography', accuracy: 78, status: 'Strong', color: '#10b981', icon: 'earth' },
    { id: 'economy', name: 'Economy', accuracy: 55, status: 'Average', color: '#f59e0b', icon: 'chart-line' },
    { id: 'science', name: 'Science', accuracy: 85, status: 'Strong', color: '#06b6d4', icon: 'flask' },
].sort((a, b) => a.accuracy - b.accuracy); // Sort Weakest first (Action priority)

export default function FocusAreas({ currentStreak, isDark }: FocusAreasProps) {
    
    const handleSubjectPress = (subject: typeof subjectData[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("Session Started", `Initializing practice module for ${subject.name}...`);
    };

    const textMain = isDark ? '#ffffff' : '#0f172a';
    const textSub = isDark ? '#a3a3a3' : '#64748b';
    const cardBg = isDark ? '#171717' : '#ffffff';
    const borderColor = isDark ? '#262626' : '#f1f5f9';

    return (
        <YStack gap="$5" mt="$4">
            
            <Animated.View entering={FadeInDown.delay(1200)}>
                <XStack jc="space-between" ai="flex-end" mb="$2">
                    <YStack>
                        <Text fontSize={20} fontFamily="Nunito_900Black" color={textMain} letterSpacing={-0.5}>
                            Focus Areas
                        </Text>
                        <Text fontSize={13} color={textSub} fontFamily="Nunito_600SemiBold" mt="$1">
                            Prioritized by your weakest topics
                        </Text>
                    </YStack>
                </XStack>
            </Animated.View>

            {/* Vertical Action List */}
            <YStack gap="$3.5">
                {subjectData.map((item, index) => (
                    <Animated.View 
                        key={item.id} 
                        entering={FadeInDown.delay(1300 + index * 100)}
                        layout={Layout.springify()}
                    >
                        <XStack 
                            bg={cardBg}
                            p="$3.5"
                            br={20}
                            ai="center"
                            jc="space-between"
                            borderWidth={1}
                            borderColor={borderColor}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isDark ? 0 : 0.03,
                                shadowRadius: 8,
                                elevation: isDark ? 0 : 2,
                            }}
                        >
                            {/* LEFT SIDE: Subject Info & Analytics */}
                            <XStack gap="$3.5" ai="center" flex={1}>
                                {/* Icon Box */}
                                <YStack 
                                    w={44} h={44} br={14} 
                                    bg={`${item.color}15`} // Very subtle background tint
                                    ai="center" jc="center"
                                >
                                    <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
                                </YStack>

                                {/* Text & Progress Bar */}
                                <YStack flex={1} gap="$1.5">
                                    <XStack jc="space-between" ai="center" mr="$4">
                                        <Text fontSize={15} fontFamily="Nunito_800ExtraBold" color={textMain}>
                                            {item.name}
                                        </Text>
                                        <Text fontSize={12} fontFamily="Nunito_700Bold" color={item.color}>
                                            {item.accuracy}%
                                        </Text>
                                    </XStack>
                                    
                                    {/* Mini Progress Bar */}
                                    <XStack h={5} bg={isDark ? '#333' : '#f1f5f9'} br={10} w="90%" overflow="hidden">
                                        <YStack 
                                            h="100%" 
                                            bg={item.color} 
                                            br={10} 
                                            w={`${item.accuracy}%`} 
                                            opacity={0.8}
                                        />
                                    </XStack>
                                </YStack>
                            </XStack>

                            {/* RIGHT SIDE: Explicit Action Button */}
                            <Pressable 
                                onPress={() => handleSubjectPress(item)}
                                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                            >
                                <YStack 
                                    bg={isDark ? '#262626' : '#f8fafc'}
                                    px="$3" 
                                    py="$2.5" 
                                    br={12}
                                    borderWidth={1}
                                    borderColor={isDark ? '#404040' : '#e2e8f0'}
                                    ai="center"
                                    jc="center"
                                >
                                    <MaterialCommunityIcons 
                                        name="play" 
                                        size={20} 
                                        color={isDark ? '#ffffff' : '#0f172a'} 
                                    />
                                </YStack>
                            </Pressable>
                        </XStack>
                    </Animated.View>
                ))}
            </YStack>

            {/* Streak Section */}
            <Animated.View entering={FadeInDown.delay(1600)}>
                <YStack mt="$2">
                     <Text fontSize={19} fontFamily="Nunito_900Black" color={textMain} letterSpacing={-0.5} mb="$2">
                        Consistency
                    </Text>
                    <StreakCalendar currentStreak={currentStreak} />
                </YStack>
            </Animated.View>

        </YStack>
    );
}