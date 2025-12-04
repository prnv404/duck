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

interface FocusAreasProps {
    currentStreak: number;
    isDark: boolean;
    subjectData?: SubjectData[];
    streakData?: any;
    onSubjectSelect?: (subject: SubjectData) => void;
}

export default function FocusAreas({
    isDark,
    subjectData = [],
    onSubjectSelect,
}: FocusAreasProps) {
    const handleSubjectPress = (subject: SubjectData) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (onSubjectSelect) {
            onSubjectSelect(subject);
        } else {
            Alert.alert(
                'Session Started',
                `Initializing practice module for ${subject.subjectName}...`
            );
        }
    };

    const textMain = isDark ? '#ffffff' : '#0f172a';
    const textSub = isDark ? '#a3a3a3' : '#64748b';
    const cardBg = isDark ? '#18181B' : '#FFFFFF';
    const border = isDark ? '#27272A' : '#E4E4E7';
    const axisColor = isDark ? '#404040' : '#e2e8f0';

    // Transform API subject data to BarChart format
    const barData = subjectData.map((subject) => {
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
                <YStack ai="center" gap="$0.5" mb="$1">
                    <MaterialCommunityIcons
                        name="play-circle"
                        size={18}
                        color={color}
                    />
                    <Text fontSize={11} color={color} fontFamily="Nunito_800ExtraBold">
                        {Math.round(subject.accuracy)}%
                    </Text>
                </YStack>
            ),
            onPress: () => handleSubjectPress(subject),
        };
    });

    const barWidth = 45;
    const spacing = 28;

    return (
        <YStack gap="$3" mt="$2">
            <Animated.View entering={FadeInDown.delay(200)}>
                <YStack gap="$1">
                    <Text
                        fontSize={18}
                        fontFamily="Nunito_800ExtraBold"
                        color={textMain}
                    >
                        📊 Subject Performance
                    </Text>
                    <Text fontSize={12} fontFamily="Nunito_600SemiBold" color={textSub}>
                        Your accuracy across subjects
                    </Text>
                </YStack>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)}>
                {barData.length > 0 ? (
                    <YStack
                        bg={cardBg}
                        p="$4"
                        br={16}
                        borderWidth={1}
                        borderColor={border}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0.3 : 0.05,
                            shadowRadius: 3,
                            elevation: 2,
                        }}
                    >
                        {/* Tap hint banner */}
                        <XStack
                            bg={isDark ? '#10b98120' : '#ecfdf5'}
                            px="$3"
                            py="$2"
                            br={10}
                            mb="$3"
                            ai="center"
                            jc="center"
                            gap="$2"
                            borderWidth={1}
                            borderColor={isDark ? '#10b98140' : '#d1fae5'}
                        >
                            <MaterialCommunityIcons
                                name="gesture-tap"
                                size={16}
                                color="#10b981"
                            />
                            <Text
                                fontSize={12}
                                fontFamily="Nunito_700Bold"
                                color="#10b981"
                            >
                                Tap any bar to start a subject quiz
                            </Text>
                        </XStack>

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
                                fontFamily: 'Nunito_600SemiBold',
                            }}
                            xAxisLabelTexts={subjectData.map((s) => s.subjectName)}
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
                            height={200}
                            yAxisLabelSuffix="%"
                            rotateLabel={false}
                            xAxisLabelsVerticalShift={5}
                        />
                    </YStack>
                ) : (
                    <YStack
                        bg={cardBg}
                        br={16}
                        p="$5"
                        borderWidth={1}
                        borderColor={border}
                        ai="center"
                        gap="$2"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0.3 : 0.05,
                            shadowRadius: 3,
                            elevation: 2,
                        }}
                    >
                        <MaterialCommunityIcons
                            name="chart-bar"
                            size={48}
                            color={textSub}
                            style={{ opacity: 0.3 }}
                        />
                        <Text
                            color={textSub}
                            fontSize={14}
                            textAlign="center"
                            fontFamily="Nunito_600SemiBold"
                        >
                            Complete quizzes to see your subject performance
                        </Text>
                    </YStack>
                )}
            </Animated.View>
        </YStack>
    );
}
