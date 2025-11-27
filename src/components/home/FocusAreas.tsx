import StreakCalendar from '@/components/StreakCalendar';
import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, Alert } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
];

export default function FocusAreas({ currentStreak, isDark }: FocusAreasProps) {
    const handleSubjectPress = (subject: typeof subjectData[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("Start Practice", `Start practicing ${subject.name}?`);
    };

    return (
        <YStack gap="$6" mt="$4">
            <Animated.View entering={FadeInDown.delay(1200)}>
                <XStack jc="space-between" ai="center">
                    <YStack>
                        <Text fontSize={20} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#0a0a0a'} letterSpacing={-0.5}>
                            Subject Mastery
                        </Text>
                        <Text fontSize={13} color={isDark ? '#a3a3a3' : '#737373'} fontFamily="Nunito_600SemiBold">
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
                    contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 10, gap: 12 }}
                >
                    {subjectData.map((item, index) => (
                        <Animated.View key={item.id} entering={FadeInDown.delay(1300 + index * 100)}>
                            <Pressable onPress={() => handleSubjectPress(item)}>
                                <YStack
                                    w={140}
                                    h={180}
                                    bg={isDark ? '#1a1a1a' : '#ffffff'}
                                    br={20}
                                    p="$3.5"
                                    jc="space-between"
                                    style={{
                                        shadowColor: item.color,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: isDark ? 0.2 : 0.1,
                                        shadowRadius: 12,
                                        elevation: 4,
                                        borderWidth: 1,
                                        borderColor: isDark ? '#262626' : '#f0f0f0'
                                    }}
                                >
                                    {/* Header: Icon & Status */}
                                    <XStack jc="space-between" ai="flex-start">
                                        <YStack
                                            w={36} h={36} br={12}
                                            bg={`${item.color}15`}
                                            ai="center" jc="center"
                                        >
                                            <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                                        </YStack>
                                        <YStack
                                            px="$2" py="$1" br={8}
                                            bg={item.status === 'Weak' ? '#ef444415' : item.status === 'Strong' ? '#10b98115' : '#f59e0b15'}
                                        >
                                            <Text
                                                fontSize={10}
                                                fontFamily="Nunito_800ExtraBold"
                                                color={item.status === 'Weak' ? '#ef4444' : item.status === 'Strong' ? '#10b981' : '#f59e0b'}
                                            >
                                                {item.status.toUpperCase()}
                                            </Text>
                                        </YStack>
                                    </XStack>

                                    {/* Middle: Subject Name & Score */}
                                    <YStack gap="$1">
                                        <Text fontSize={16} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#0a0a0a'} numberOfLines={2}>
                                            {item.name}
                                        </Text>
                                        <Text fontSize={28} fontFamily="Nunito_900Black" color={item.color}>
                                            {item.accuracy}%
                                        </Text>
                                    </YStack>

                                    {/* Bottom: Practice Button */}
                                    <XStack
                                        bg={isDark ? '#000000' : '#f8fafc'}
                                        py="$2"
                                        br={12}
                                        jc="center"
                                        ai="center"
                                        gap="$1.5"
                                        borderWidth={1}
                                        borderColor={isDark ? '#262626' : '#e2e8f0'}
                                    >
                                        <Text fontSize={12} fontFamily="Nunito_700Bold" color={isDark ? '#ffffff' : '#475569'}>
                                            Practice
                                        </Text>
                                        <MaterialCommunityIcons name="arrow-right" size={14} color={isDark ? '#ffffff' : '#475569'} />
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
                    <Text fontSize={20} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#0a0a0a'} letterSpacing={-0.5}>
                        Your Streak Journey
                    </Text>
                    <Text fontSize={14} color={isDark ? '#a3a3a3' : '#737373'} fontFamily="Nunito_700Bold">
                        View All
                    </Text>
                </XStack>
                <StreakCalendar currentStreak={currentStreak} />
            </Animated.View>
        </YStack>
    );
}
