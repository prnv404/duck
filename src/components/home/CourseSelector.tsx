import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, View } from 'react-native';
import { Text, YStack } from 'tamagui';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface Course {
    id: string;
    name: string;
    icon: string;
    progress?: number;
    color: string;
}

interface CourseSelectorProps {
    courses: Course[];
    selectedCourseId: string;
    onCourseSelect: (courseId: string) => void;
    isDark: boolean;
}

export default function CourseSelector({ courses, selectedCourseId, onCourseSelect, isDark }: CourseSelectorProps) {
    const handleCourseSelect = (courseId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onCourseSelect(courseId);
    };

    return (
        <YStack>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    gap: 12,
                    alignItems: 'center',
                }}
            >
                {courses.map((course, index) => {
                    const isSelected = selectedCourseId === course.id;

                    return (
                        <Animated.View key={course.id} entering={FadeIn.delay(50 + index * 50)}>
                            <Pressable onPress={() => handleCourseSelect(course.id)}>
                                <YStack
                                    ai="center"
                                    gap="$2"
                                    p="$3"
                                    br={20}
                                    w={100}
                                    style={{
                                        borderWidth: isSelected ? 3 : 1,
                                        borderColor: isSelected ? course.color : (isDark ? '#2a2a2a' : '#e5e5e5'),
                                        backgroundColor: isSelected
                                            ? (isDark ? `${course.color}20` : `${course.color}15`)
                                            : (isDark ? '#1a1a1a' : '#fafafa'),
                                        shadowColor: isSelected ? course.color : '#000',
                                        shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                                        shadowOpacity: isSelected ? 0.4 : (isDark ? 0.2 : 0.08),
                                        shadowRadius: isSelected ? 12 : 6,
                                        elevation: isSelected ? 8 : 3,
                                        transform: [{ scale: isSelected ? 1.05 : 1 }],
                                    }}
                                >
                                    {/* Icon/Flag Container */}
                                    <YStack
                                        w={48}
                                        h={48}
                                        br={24}
                                        ai="center"
                                        jc="center"
                                        overflow="hidden"
                                        style={{
                                            backgroundColor: isSelected
                                                ? course.color
                                                : (isDark ? '#2a2a2a' : '#f0f0f0'),
                                        }}
                                    >
                                        {isSelected ? (
                                            <LinearGradient
                                                colors={[course.color, `${course.color}dd`]}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text fontSize={28}>{course.icon}</Text>
                                            </LinearGradient>
                                        ) : (
                                            <Text fontSize={28} style={{ opacity: isDark ? 0.6 : 0.7 }}>
                                                {course.icon}
                                            </Text>
                                        )}
                                    </YStack>

                                    {/* Course Name */}
                                    <Text
                                        fontSize={12}
                                        fontFamily="Nunito_800ExtraBold"
                                        color={
                                            isSelected
                                                ? course.color
                                                : (isDark ? '#a3a3a3' : '#737373')
                                        }
                                        textAlign="center"
                                        numberOfLines={1}
                                    >
                                        {course.name}
                                    </Text>

                                    {/* Progress Bar */}
                                    {course.progress !== undefined && course.progress > 0 && (
                                        <YStack w="100%" mt="$1">
                                            <View
                                                style={{
                                                    height: 4,
                                                    backgroundColor: isDark ? '#2a2a2a' : '#e5e5e5',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: `${course.progress}%`,
                                                        height: '100%',
                                                        backgroundColor: isSelected ? course.color : (isDark ? '#525252' : '#a3a3a3'),
                                                        borderRadius: 2,
                                                    }}
                                                />
                                            </View>
                                        </YStack>
                                    )}
                                </YStack>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </ScrollView>
        </YStack>
    );
}
