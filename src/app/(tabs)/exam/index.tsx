import { YStack, XStack, Text, Sheet, Circle } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import { ScrollView, Pressable, Dimensions, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown } from 'react-native-reanimated'
import LearningPath, { Unit, Skill } from '@/components/LearningPath'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type ExamCategory = {
  id: string
  title: string
  subtitle: string
  icon: string
  exams: string[]
  color: string
  gradient: [string, string]
}

export default function ExamScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const [hearts] = useState(5)
  const [gems] = useState(340)
  const [showCategorySheet, setShowCategorySheet] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('10th')
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  type Exam = {
    id: string
    title: string
    fullName: string
    category: string
    icon: string
    color: string
    gradient: [string, string]
    vacancies: number
    salary: string
  }

  const examCategories: ExamCategory[] = [
    {
      id: '10th',
      title: '10th Level',
      subtitle: 'Foundation',
      icon: 'school-outline',
      exams: ['LDC', 'LGS', 'Lab Assistant', 'Office Attendant'],
      color: '#22c55e',
      gradient: ['#22c55e', '#16a34a']
    },
    {
      id: '12th',
      title: '+2 Level',
      subtitle: 'Intermediate',
      icon: 'library-outline',
      exams: ['LD Clerk', 'DEO', 'Junior Assistant', 'Clerk Typist'],
      color: '#3b82f6',
      gradient: ['#3b82f6', '#2563eb']
    },
    {
      id: 'degree',
      title: 'Degree Level',
      subtitle: 'Advanced',
      icon: 'school',
      exams: ['Village Field Asst', 'Secretariat Asst', 'SI of Police', 'Excise Inspector'],
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed']
    }
  ]

  const currentCategoryData = examCategories.find(c => c.id === selectedCategory)!

  const getExamsForCategory = (categoryId: string): Exam[] => {
    const examsMap: Record<string, Exam[]> = {
      '10th': [
        { id: 'ldc', title: 'LDC', fullName: 'Lower Division Clerk', category: 'Clerical', icon: 'document-text', color: '#3b82f6', gradient: ['#3b82f6', '#2563eb'], vacancies: 1200, salary: '₹19,500 - ₹62,000' },
        { id: 'lgs', title: 'LGS', fullName: 'Last Grade Servant', category: 'Non-Technical', icon: 'people', color: '#22c55e', gradient: ['#22c55e', '#16a34a'], vacancies: 800, salary: '₹18,000 - ₹56,900' },
        { id: 'lab-assistant', title: 'Lab Assistant', fullName: 'Laboratory Assistant', category: 'Technical', icon: 'flask', color: '#14b8a6', gradient: ['#14b8a6', '#0d9488'], vacancies: 450, salary: '₹19,000 - ₹60,000' },
        { id: 'office-attendant', title: 'Office Attendant', fullName: 'Office Attendant', category: 'Support Staff', icon: 'home', color: '#64748b', gradient: ['#64748b', '#475569'], vacancies: 900, salary: '₹18,500 - ₹58,000' },
      ],
      '12th': [
        { id: 'ld-clerk', title: 'LD Clerk', fullName: 'Lower Division Clerk', category: 'Clerical', icon: 'briefcase', color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'], vacancies: 950, salary: '₹20,000 - ₹65,000' },
        { id: 'deo', title: 'DEO', fullName: 'Data Entry Operator', category: 'Technical', icon: 'laptop', color: '#06b6d4', gradient: ['#06b6d4', '#0891b2'], vacancies: 600, salary: '₹21,000 - ₹66,000' },
        { id: 'junior-assistant', title: 'Junior Assistant', fullName: 'Junior Assistant', category: 'Administrative', icon: 'clipboard', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], vacancies: 700, salary: '₹22,000 - ₹68,000' },
        { id: 'clerk-typist', title: 'Clerk Typist', fullName: 'Clerk Typist', category: 'Clerical', icon: 'create', color: '#a855f7', gradient: ['#a855f7', '#9333ea'], vacancies: 550, salary: '₹21,500 - ₹67,000' },
      ],
      'degree': [
        { id: 'vfa', title: 'VFA', fullName: 'Village Field Assistant', category: 'Field Work', icon: 'map', color: '#ec4899', gradient: ['#ec4899', '#db2777'], vacancies: 500, salary: '₹25,000 - ₹75,000' },
        { id: 'secretariat-assistant', title: 'Secretariat Assistant', fullName: 'Secretariat Assistant', category: 'Administrative', icon: 'business', color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'], vacancies: 400, salary: '₹28,000 - ₹82,000' },
        { id: 'si-police', title: 'SI of Police', fullName: 'Sub Inspector of Police', category: 'Police', icon: 'shield-checkmark', color: '#ef4444', gradient: ['#ef4444', '#dc2626'], vacancies: 300, salary: '₹35,000 - ₹1,12,000' },
        { id: 'excise-inspector', title: 'Excise Inspector', fullName: 'Excise Inspector', category: 'Enforcement', icon: 'alert-circle', color: '#f97316', gradient: ['#f97316', '#ea580c'], vacancies: 250, salary: '₹32,000 - ₹95,000' },
      ],
    }
    return examsMap[categoryId] || []
  }

  const exams = getExamsForCategory(selectedCategory)
  const selectedExamData = exams.find(e => e.id === selectedExam)

  const getUnitsForCategory = (categoryId: string): Unit[] => {
    const baseUnits: Unit[] = [
      {
        id: 'u1',
        title: 'General Knowledge',
        description: 'Current Affairs & GK',
        color: '#3b82f6',
        gradient: ['#3b82f6', '#1d4ed8'],
        skills: [
          { id: 'gk-1', title: 'National News', icon: 'newspaper', color: '#3b82f6', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'gk-2', title: 'Kerala Updates', icon: 'location', color: '#22c55e', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'gk-3', title: 'International', icon: 'globe', color: '#8b5cf6', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
        ],
      },
      {
        id: 'u2',
        title: 'Reasoning',
        description: 'Logical & Analytical',
        color: '#f59e0b',
        gradient: ['#f59e0b', '#d97706'],
        skills: [
          { id: 'rea-1', title: 'Verbal Reasoning', icon: 'chatbubbles', color: '#f59e0b', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
          { id: 'rea-2', title: 'Non-Verbal', icon: 'shapes', color: '#06b6d4', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
          { id: 'rea-3', title: 'Puzzles', icon: 'extension-puzzle', color: '#ec4899', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
        ],
      },
      {
        id: 'u3',
        title: 'Mathematics',
        description: 'Quantitative Aptitude',
        color: '#22c55e',
        gradient: ['#22c55e', '#16a34a'],
        skills: [
          { id: 'math-1', title: 'Arithmetic', icon: 'calculator', color: '#22c55e', progress: 0, totalLessons: 6, completedLessons: 0, crown: 0 },
          { id: 'math-2', title: 'Algebra', icon: 'analytics', color: '#3b82f6', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'math-3', title: 'Geometry', icon: 'triangle', color: '#f59e0b', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
        ],
      },
    ]

    return baseUnits.map((unit, ui) => ({
      ...unit,
      skills: unit.skills.map((s, si) => ({ ...s, locked: false }))
    }))
  }

  const units = getUnitsForCategory(selectedCategory)

  const onSkillPress = async (skill: Skill) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert(
      '🚀 Coming Soon!',
      `"${skill.title}" lessons are being prepared. We're working hard to bring you quality content!\n\nStay tuned for updates! 📚`,
      [{ text: 'Got it!', style: 'default' }]
    )
  }

  const onCategorySelect = async (categoryId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedCategory(categoryId)
    setSelectedExam(null) // Reset exam selection when category changes
    setShowCategorySheet(false)
  }

  const onExamPress = async (exam: Exam) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedExam(exam.id)
  }

  const onBackToExams = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedExam(null)
  }

  return (
    <YStack f={1} bg="$background">
     

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >

        <Text
            mt="$9"
  p="$4"
  pb="$2"
  fontSize={24}
  fontWeight="900"
  color="$color12"
  style={{
    letterSpacing: 0.5,
  }}
>
  Exams
</Text>


        {!selectedExam ? (
          // Exam Cards View
          <YStack p="$4" gap="$3">
            {exams.map((exam, index) => (
              <Animated.View key={exam.id} entering={FadeInDown.delay(100 + index * 50)}>
                <Pressable onPress={() => onExamPress(exam)}>
                  <YStack
                    bg={isDark ? '$gray2' : '#fff'}
                    br={20}
                    p="$4"
                    gap="$3"
                    style={{
                      shadowColor: exam.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 12,
                      borderWidth: isDark ? 0 : 1,
                      borderColor: isDark ? 'transparent' : '#e5e7eb',
                    }}
                  >
                    <XStack ai="center" gap="$3">
                      {/* Icon */}
                      <YStack
                        w={56}
                        h={56}
                        br={16}
                        ai="center"
                        jc="center"
                        overflow="hidden"
                      >
                        <LinearGradient
                          colors={exam.gradient}
                          style={{ position: 'absolute', width: '100%', height: '100%' }}
                        />
                        <Ionicons name={exam.icon as any} size={28} color="#fff" />
                      </YStack>

                      {/* Info */}
                      <YStack f={1} gap="$1">
                        <Text fontSize={18} fontWeight="800">{exam.title}</Text>
                        <Text fontSize={13} color="$gray10" numberOfLines={1}>
                          {exam.fullName}
                        </Text>
                        <Text fontSize={12} color="$gray11">{exam.category}</Text>
                      </YStack>
                    </XStack>

                    {/* Details */}
                    <XStack ai="center" jc="space-between">
                      <XStack ai="center" gap="$1.5">
                        <Ionicons name="people" size={14} color={exam.color} />
                        <Text fontSize={12} fontWeight="700" style={{ color: exam.color }}>
                          {exam.vacancies} vacancies
                        </Text>
                      </XStack>
                      <XStack ai="center" gap="$1.5">
                        <Ionicons name="cash" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                        <Text fontSize={12} color="$gray11">{exam.salary}</Text>
                      </XStack>
                    </XStack>

                    {/* Action */}
                    <YStack br={12} overflow="hidden" mt="$1">
                      <LinearGradient
                        colors={[`${exam.color}15`, `${exam.color}08`]}
                        style={{ padding: 12 }}
                      >
                        <XStack ai="center" jc="center" gap="$2">
                          <Ionicons name="book" size={16} color={exam.color} />
                          <Text fontSize={13} fontWeight="700" style={{ color: exam.color }}>
                            Start Preparation
                          </Text>
                          <Ionicons name="arrow-forward" size={14} color={exam.color} />
                        </XStack>
                      </LinearGradient>
                    </YStack>
                  </YStack>
                </Pressable>
              </Animated.View>
            ))}
          </YStack>
        ) : (
          // Learning Path View
          <YStack>
            {/* Back Button */}
            <Pressable onPress={onBackToExams}>
              <XStack ai="center" gap="$2" p="$4" pb="$2">
                <Ionicons name="arrow-back" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text fontSize={14} fontWeight="600" color="$gray11">Back to Exams</Text>
              </XStack>
            </Pressable>

            {/* Exam Header */}
            {selectedExamData && (
              <Animated.View entering={FadeInDown.delay(100)}>
                <YStack p="$4" pt="$2" gap="$2">
                  <XStack ai="center" gap="$3">
                    <YStack
                      w={48}
                      h={48}
                      br={14}
                      ai="center"
                      jc="center"
                      overflow="hidden"
                    >
                      <LinearGradient
                        colors={selectedExamData.gradient}
                        style={{ position: 'absolute', width: '100%', height: '100%' }}
                      />
                      <Ionicons name={selectedExamData.icon as any} size={24} color="#fff" />
                    </YStack>
                    <YStack f={1}>
                      <Text fontSize={20} fontWeight="900">{selectedExamData.fullName}</Text>
                      <Text fontSize={13} color="$gray10">{selectedExamData.category}</Text>
                    </YStack>
                  </XStack>
                </YStack>
              </Animated.View>
            )}

            <YStack p="$4" pt="$2">
              <LearningPath units={units} onSkillPress={onSkillPress} />
            </YStack>
          </YStack>
        )}
      </ScrollView>

      {/* Category Selector Sheet */}
      <Sheet
        modal
        open={showCategorySheet}
        onOpenChange={setShowCategorySheet}
        snapPoints={[55]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame bg="$background" p="$4" pt="$2">
          <Sheet.Handle />
          
          <YStack gap="$4" mt="$4">
            <Text fontSize={20} fontWeight="800" textAlign="center">
              Choose Exam Category
            </Text>
            <Text fontSize={14} color="$gray10" textAlign="center">
              Select based on your qualification
            </Text>

            <YStack gap="$3" mt="$2">
              {examCategories.map((category, index) => (
                <Animated.View key={category.id} entering={FadeInDown.delay(index * 80)}>
                  <Pressable onPress={() => onCategorySelect(category.id)}>
                    <YStack
                      p="$4"
                      br={16}
                      bg={selectedCategory === category.id ? `${category.color}15` : '$gray2'}
                      borderWidth={2}
                      borderColor={selectedCategory === category.id ? category.color : 'transparent'}
                    >
                      <XStack ai="center" gap="$3">
                        <LinearGradient
                          colors={category.gradient}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Ionicons name={category.icon as any} size={24} color="#fff" />
                        </LinearGradient>
                        
                        <YStack f={1}>
                          <Text fontSize={17} fontWeight="700">{category.title}</Text>
                          <Text fontSize={13} color="$gray10">{category.subtitle}</Text>
                          <XStack flexWrap="wrap" gap="$1" mt="$2">
                            {category.exams.slice(0, 3).map((exam) => (
                              <YStack key={exam} bg="$gray4" px="$2" py={2} br={6}>
                                <Text fontSize={10} color="$gray11">{exam}</Text>
                              </YStack>
                            ))}
                            {category.exams.length > 3 && (
                              <YStack bg="$gray4" px="$2" py={2} br={6}>
                                <Text fontSize={10} color="$gray11">+{category.exams.length - 3}</Text>
                              </YStack>
                            )}
                          </XStack>
                        </YStack>

                        {selectedCategory === category.id && (
                          <Circle size={24} bg={category.color}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          </Circle>
                        )}
                      </XStack>
                    </YStack>
                  </Pressable>
                </Animated.View>
              ))}
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
