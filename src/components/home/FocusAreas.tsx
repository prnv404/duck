import StreakCalendar from '@/components/StreakCalendar';
import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, Alert } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
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
].sort(() => Math.random() - 0.5);

export default function FocusAreas({ currentStreak, isDark }: FocusAreasProps) {
    const handleSubjectPress = (subject: typeof subjectData[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("Start Practice", `Start practicing ${subject.name}?`);
    };

    // Simplified shadow for minimalism
    const cardShadow = isDark 
        ? { shadowOpacity: 0.2, shadowRadius: 8, shadowColor: '#000' } 
        : { shadowOpacity: 0.08, shadowRadius: 6, shadowColor: '#000' };

    return (
        <YStack gap="$5" mt="$4"> {/* Slightly reduced gap */}
            <Animated.View entering={FadeInDown.delay(1200)}>
                <XStack jc="space-between" ai="center">
                    <YStack>
                        <Text fontSize={19} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#0a0a0a'} letterSpacing={-0.5}>
                            Subject Mastery
                        </Text>
                        <Text fontSize={12} color={isDark ? '#a3a3a3' : '#737373'} fontFamily="Nunito_600SemiBold">
                            Tap a card to improve
                        </Text>
                    </YStack>
                </XStack>
            </Animated.View>

            {/* Horizontal Scrollable Mastery Cards */}
            <Animated.View entering={FadeIn.delay(1300)}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 8, gap: 12 }} // Reduced paddingBottom
                >
                    {subjectData.map((item, index) => (
                        <Animated.View key={item.id} entering={FadeInDown.delay(1300 + index * 100)}>
                            <Pressable onPress={() => handleSubjectPress(item)}>
                                <YStack
                                    w={130} // Slightly reduced width
                                    h={160} // Slightly reduced height
                                    bg={isDark ? '#1a1a1a' : '#ffffff'}
                                    br={16} // Slightly smaller radius
                                    p="$3"
                                    jc="space-between"
                                    style={{
                                        ...cardShadow,
                                        shadowOffset: { width: 0, height: 2 }, // Reduced offset
                                        elevation: 3, // Reduced elevation
                                        borderWidth: 1,
                                        borderColor: isDark ? '#262626' : '#f0f0f0'
                                    }}
                                >
                                    {/* Header: Icon & Status */}
                                    <XStack jc="space-between" ai="flex-start">
                                        <YStack
                                            w={32} h={32} br={10} // Smaller icon container
                                            bg={`${item.color}10`} // More subtle tint
                                            ai="center" jc="center"
                                        >
                                            <MaterialCommunityIcons name={item.icon as any} size={18} color={item.color} />
                                        </YStack>
                                        <YStack
                                            px="$1.5" py="$0.5" br={6} // Compact badge
                                            bg={item.status === 'Weak' ? '#ef444410' : item.status === 'Strong' ? '#10b98110' : '#f59e0b10'} // Subtler bg
                                        >
                                            <Text
                                                fontSize={9} // Smaller text
                                                fontFamily="Nunito_800ExtraBold"
                                                color={item.status === 'Weak' ? '#ef4444' : item.status === 'Strong' ? '#10b981' : '#f59e0b'}
                                            >
                                                {item.status.toUpperCase()}
                                            </Text>
                                        </YStack>
                                    </XStack>

                                    {/* Middle: Subject Name & Score */}
                                    <YStack gap="$1">
                                        <Text fontSize={15} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#0a0a0a'} numberOfLines={2}>
                                            {item.name}
                                        </Text>
                                        <Text fontSize={26} fontFamily="Nunito_900Black" color={item.color}> {/* Slightly reduced size */}
                                            {item.accuracy}%
                                        </Text>
                                    </YStack>

                                    {/* Bottom: Practice Button - Simplified */}
                                    <XStack
                                        bg={isDark ? '#262626' : '#f8fafc'} // Softer bg
                                        py="$1.5" // Reduced padding
                                        br={10}
                                        jc="center"
                                        ai="center"
                                        gap="$1"
                                        borderWidth={1}
                                        borderColor={isDark ? '#333333' : '#e2e8f0'}
                                    >
                                        <Text fontSize={11} fontFamily="Nunito_700Bold" color={isDark ? '#e0e0e0' : '#475569'}>
                                            Practice
                                        </Text>
                                        <MaterialCommunityIcons name="arrow-right" size={12} color={isDark ? '#e0e0e0' : '#475569'} />
                                    </XStack>
                                </YStack>
                            </Pressable>
                        </Animated.View>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Streak Calendar */}
            <Animated.View entering={FadeInDown.delay(1500)}>
                <XStack jc="space-between" ai="center">
                    <Text fontSize={19} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#0a0a0a'} letterSpacing={-0.5}>
                        Your Streak Journey
                    </Text>
                    <Text fontSize={13} color={isDark ? '#a3a3a3' : '#737373'} fontFamily="Nunito_700Bold">
                        View All
                    </Text>
                </XStack>
                <StreakCalendar currentStreak={currentStreak} />
            </Animated.View>
        </YStack>
    );
}