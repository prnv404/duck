import * as Haptics from 'expo-haptics';
import { Modal, Pressable, ScrollView } from 'react-native';
import { Text, YStack, XStack } from 'tamagui';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Course {
    id: string;
    name: string;
    icon: string;
    progress?: number;
    color: string;
}

interface CourseSelectorModalProps {
    visible: boolean;
    courses: Course[];
    selectedCourseId: string;
    onCourseSelect: (courseId: string) => void;
    onClose: () => void;
    isDark: boolean;
}

export default function CourseSelectorModal({
    visible,
    courses,
    selectedCourseId,
    onCourseSelect,
    onClose,
    isDark
}: CourseSelectorModalProps) {
    const handleCourseSelect = (courseId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onCourseSelect(courseId);
        setTimeout(onClose, 200);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Backdrop */}
            <Pressable
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                onPress={onClose}
            >
                {/* Modal Content - Slides from Top */}
                <Animated.View
                    entering={SlideInUp.duration(300).springify()}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        maxHeight: '50%',
                        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                        borderBottomLeftRadius: 24,
                        borderBottomRightRadius: 24,
                        paddingTop: 48,
                        paddingBottom: 24,
                    }}
                >
                    {/* Header */}
                    <YStack px="$4" pb="$3">
                        <XStack jc="space-between" ai="center">
                            <Text fontSize={24} fontFamily="Nunito_900Black" color={isDark ? '#ffffff' : '#0a0a0a'}>
                                Select Course
                            </Text>
                            <Pressable onPress={onClose}>
                                <MaterialCommunityIcons
                                    name="close"
                                    size={24}
                                    color={isDark ? '#a3a3a3' : '#737373'}
                                />
                            </Pressable>
                        </XStack>
                        <Text fontSize={13} color={isDark ? '#a3a3a3' : '#737373'} fontFamily="Nunito_600SemiBold" mt="$1">
                            Choose your exam preparation path
                        </Text>
                    </YStack>

                    {/* Course Grid - Horizontal Scrollable */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            gap: 16,
                            alignItems: 'flex-start',
                            paddingVertical: 8,
                        }}
                    >
                        {courses.map((course, index) => {
                            const isSelected = selectedCourseId === course.id;

                            return (
                                <Animated.View key={course.id} entering={FadeIn.delay(50 + index * 50)}>
                                    <Pressable onPress={() => handleCourseSelect(course.id)}>
                                        <YStack
                                            ai="center"
                                            gap="$2.5"
                                            w={90}
                                        >
                                            {/* Large Square Icon Container */}
                                            <YStack
                                                w={80}
                                                h={80}
                                                br={20}
                                                ai="center"
                                                jc="center"
                                                overflow="hidden"
                                                style={{
                                                    borderWidth: isSelected ? 4 : 0,
                                                    borderColor: isSelected ? course.color : 'transparent',
                                                    backgroundColor: course.color,
                                                }}
                                            >
                                                <LinearGradient
                                                    colors={[course.color, `${course.color}dd`]}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Text fontSize={40}>{course.icon}</Text>
                                                </LinearGradient>
                                            </YStack>

                                            {/* Course Name */}
                                            <Text
                                                fontSize={15}
                                                fontFamily="Nunito_800ExtraBold"
                                                color={isDark ? '#ffffff' : '#0a0a0a'}
                                                textAlign="center"
                                                numberOfLines={1}
                                            >
                                                {course.name}
                                            </Text>
                                        </YStack>
                                    </Pressable>
                                </Animated.View>
                            );
                        })}
                    </ScrollView>
                </Animated.View>
            </Pressable>
        </Modal>
    );
}
