import { Text, XStack, YStack } from 'tamagui';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import EnhancedStatCard from './EnhancedStatCard';

interface ProgressStatsProps {
    streak: number;
    accuracy: string;
    quizzesCompleted: number;
    isDark: boolean;
}

export default function ProgressStats({ streak, accuracy, quizzesCompleted, isDark }: ProgressStatsProps) {
    return (
        <YStack gap="$3">
            <Animated.View entering={FadeInDown.delay(700)}>
                <Text fontSize={20} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#0a0a0a'} letterSpacing={-0.5}>
                    Your Progress
                </Text>
            </Animated.View>

            <XStack gap="$3">
                <Animated.View entering={ZoomIn.delay(800)} style={{ flex: 1 }}>
                    <EnhancedStatCard icon="fire" value={streak} label="Day Streak" color="#ef4444" trend="+2" isDark={isDark} />
                </Animated.View>
                <Animated.View entering={ZoomIn.delay(900)} style={{ flex: 1 }}>
                    <EnhancedStatCard icon="target" value={`${accuracy}%`} label="Accuracy" color="#10b981" trend="+5%" isDark={isDark} />
                </Animated.View>
            </XStack>

            <XStack gap="$3">
                <Animated.View entering={ZoomIn.delay(1000)} style={{ flex: 1 }}>
                    <EnhancedStatCard icon="trophy-outline" value={quizzesCompleted} label="Quizzes" color="#f59e0b" trend="+12" isDark={isDark} />
                </Animated.View>
                <Animated.View entering={ZoomIn.delay(1100)} style={{ flex: 1 }}>
                    <EnhancedStatCard icon="clock-outline" value="2.4h" label="Study Time" color="#06b6d4" trend="+30m" isDark={isDark} />
                </Animated.View>
            </XStack>
        </YStack>
    );
}
