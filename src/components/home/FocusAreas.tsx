import StreakCalendar from '@/components/StreakCalendar';
import * as Haptics from 'expo-haptics';
import { Pressable, Alert } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SubjectData {
    subjectId: string;
    subjectName: string;
    accuracy: number;
    performance: 'weak' | 'average' | 'strong';
}

interface StreakDataResponse {
    currentStreak: number;
    longestStreak: number;
    calendar: {
        activityDate: string;
        quizzesCompleted: number;
        questionsAnswered: number;
        xpEarned: number;
    }[];
}

interface FocusAreasProps {
    currentStreak: number;
    isDark: boolean;
    subjectData?: SubjectData[];
    streakData?: StreakDataResponse | null;
    onSubjectSelect?: (subject: SubjectData) => void;
}

export default function FocusAreas({ currentStreak, isDark, subjectData = [], streakData, onSubjectSelect }: FocusAreasProps) {

    const handleSubjectPress = (subject: SubjectData) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (onSubjectSelect) {
            onSubjectSelect(subject);
        } else {
            Alert.alert("Session Started", `Initializing practice module for ${subject.subjectName}...`);
        }
    };

    const textMain = isDark ? '#ffffff' : '#0f172a';
    const textSub = isDark ? '#a3a3a3' : '#64748b';
    const cardBg = isDark ? '#171717' : '#ffffff';
    const borderColor = isDark ? '#262626' : '#f1f5f9';

    // Transform API subject data to UI format
    const formattedSubjects = subjectData.map(subject => {
        let color = '#f59e0b'; // Default Average
        let icon = 'book-open-variant';

        if (subject.performance === 'weak') {
            color = '#ef4444';
            icon = 'alert-circle-outline';
        } else if (subject.performance === 'strong') {
            color = '#10b981';
            icon = 'check-circle-outline';
        }

        // Map specific icons based on subject name if needed
        const nameLower = subject.subjectName.toLowerCase();
        if (nameLower.includes('polity')) icon = 'bank';
        else if (nameLower.includes('geography')) icon = 'earth';
        else if (nameLower.includes('science')) icon = 'flask';
        else if (nameLower.includes('history')) icon = 'history';
        else if (nameLower.includes('economy')) icon = 'chart-line';

        return {
            ...subject,
            color,
            icon
        };
    }).sort((a, b) => a.accuracy - b.accuracy); // Sort Weakest first

    // Transform API streak data for calendar
    const calendarData: { [date: string]: number } = {};
    if (streakData?.calendar) {
        streakData.calendar.forEach(day => {
            const dateStr = new Date(day.activityDate).toISOString().split('T')[0];
            // Use quizzes completed or questions answered as activity metric
            // Cap at 5 for intensity color mapping
            const activityLevel = Math.min(day.quizzesCompleted > 0 ? day.quizzesCompleted : (day.questionsAnswered > 0 ? 1 : 0), 5);
            calendarData[dateStr] = activityLevel;
        });
    }

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
                {formattedSubjects.length > 0 ? formattedSubjects.map((item, index) => (
                    <Animated.View
                        key={item.subjectName}
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
                                            {item.subjectName}
                                        </Text>
                                        <Text fontSize={12} fontFamily="Nunito_700Bold" color={item.color}>
                                            {typeof item.accuracy === 'number' ? item.accuracy.toFixed(1) : item.accuracy}%
                                        </Text>
                                    </XStack>

                                    {/* Mini Progress Bar */}
                                    <XStack h={5} bg={isDark ? '#333' : '#f1f5f9'} br={10} w="90%" overflow="hidden">
                                        <YStack
                                            h="100%"
                                            bg={item.color}
                                            br={10}
                                            w={`${Math.min(item.accuracy, 100)}%`}
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
                )) : (
                    <Text color={textSub} fontSize={14} textAlign="center" py="$4">
                        Complete quizzes to see your focus areas.
                    </Text>
                )}
            </YStack>

        </YStack>
    );
}