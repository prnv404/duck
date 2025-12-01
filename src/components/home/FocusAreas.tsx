import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BarChart } from 'react-native-gifted-charts';
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
    const axisColor = isDark ? '#404040' : '#e2e8f0';
    const cardBg = isDark ? '#1a1a1a' : '#f8fafc';
    const barBg = isDark ? '#0a0a0a' : '#ffffff';

    // Transform API subject data to BarChart format
    const barData = subjectData.map(subject => {
        let color = '#f59e0b'; // Default Average (Yellow)

        if (subject.performance === 'weak') {
            color = '#ef4444'; // Red
        } else if (subject.performance === 'strong') {
            color = '#10b981'; // Green
        }

        return {
            value: subject.accuracy,
            frontColor: color,
            topLabelComponent: () => (
                <YStack ai="center" gap="$1" mb="$2">
                    <MaterialCommunityIcons
                        name="play-circle"
                        size={16}
                        color={color}
                        style={{ opacity: 0.9 }}
                    />
                    <Text fontSize={11} color={color} fontFamily="Nunito_800ExtraBold">
                        {Math.round(subject.accuracy)}%
                    </Text>
                </YStack>
            ),
            onPress: () => handleSubjectPress(subject),
        };
    });

    // Calculate dynamic width for scrollable chart
    const barWidth = 45;
    const spacing = 28;

    return (
        <YStack gap="$4" mt="$4">

            <Animated.View entering={FadeInDown.delay(1200)}>
                <YStack gap="$2">
                    <XStack jc="space-between" ai="center">
                        <Text fontSize={20} fontFamily="Nunito_900Black" color={textMain} letterSpacing={-0.5}>
                            Subject Performance
                        </Text>
                        <XStack ai="center" gap="$1.5" bg={cardBg} px="$2.5" py="$1.5" br={8}>
                            <MaterialCommunityIcons name="gesture-tap" size={14} color={textSub} />
                            <Text fontSize={11} color={textSub} fontFamily="Nunito_700Bold">
                                Tap to Practice
                            </Text>
                        </XStack>
                    </XStack>
                    <Text fontSize={13} color={textSub} fontFamily="Nunito_600SemiBold">
                        Track your accuracy across all subjects
                    </Text>
                </YStack>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(1300)}>
                {barData.length > 0 ? (
                    <YStack
                        bg={barBg}
                        p="$4"
                        br={16}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0 : 0.05,
                            shadowRadius: 12,
                            elevation: isDark ? 0 : 3,
                        }}
                    >
                        <BarChart
                            data={barData}
                            barWidth={barWidth}
                            noOfSections={4}
                            barBorderTopLeftRadius={8}
                            barBorderTopRightRadius={8}
                            frontColor="#f59e0b"
                            yAxisThickness={1}
                            yAxisColor={axisColor}
                            xAxisThickness={0}
                            yAxisTextStyle={{
                                color: textSub,
                                fontSize: 10,
                                fontFamily: 'Nunito_600SemiBold'
                            }}
                            xAxisLabelTexts={subjectData.map(s => s.subjectName)}
                            xAxisLabelTextStyle={{
                                color: textMain,
                                fontSize: 11,
                                fontFamily: 'Nunito_700Bold',
                                width: barWidth + spacing,
                                textAlign: 'center',
                            }}
                            initialSpacing={20}
                            spacing={spacing}
                            maxValue={100}
                            isAnimated
                            animationDuration={800}
                            scrollToEnd={false}
                            scrollAnimation={true}
                            hideRules
                            showGradient={false}
                            height={220}
                            yAxisLabelSuffix="%"
                            rotateLabel={false}
                            xAxisLabelsVerticalShift={5}
                        />
                    </YStack>
                ) : (
                    <YStack ai="center" py="$6" gap="$2">
                        <MaterialCommunityIcons
                            name="chart-bar"
                            size={48}
                            color={textSub}
                            style={{ opacity: 0.3 }}
                        />
                        <Text color={textSub} fontSize={14} textAlign="center" fontFamily="Nunito_600SemiBold">
                            Complete quizzes to see your subject performance
                        </Text>
                    </YStack>
                )}
            </Animated.View>

        </YStack>
    );
}