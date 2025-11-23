import { YStack, XStack, Text, Circle, Sheet } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import { ScrollView, Pressable, Dimensions, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useRef } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { 
  FadeInDown, 
  FadeIn,
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSpring,
  Easing,
  interpolate
} from 'react-native-reanimated'
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg'
import GlassCard from '@/components/ui/GlassCard'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type Skill = { 
  id: string
  title: string
  icon: any
  color: string
  progress: number
  totalLessons: number
  completedLessons: number
  crown: number // 0-5 crown level
  locked?: boolean 
}

type Unit = { 
  id: string
  title: string
  description: string
  skills: Skill[]
  color: string
  gradient: [string, string]
}

type CourseLevel = {
  id: string
  title: string
  subtitle: string
  icon: string
  exams: string[]
  color: string
  gradient: [string, string]
}

export default function LearnScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const [hearts] = useState(5)
  const [gems] = useState(340)
  const [xp] = useState(1240)
  const [showLevelSheet, setShowLevelSheet] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<string>('degree')

  // Course Levels
  const courseLevels: CourseLevel[] = [
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

  const currentLevelData = courseLevels.find(l => l.id === selectedLevel)!

  // Units based on selected level
  const getUnitsForLevel = (levelId: string): Unit[] => {
    const baseUnits: Unit[] = [
      {
        id: 'u1',
        title: 'Current Affairs & GK',
        description: 'Stay updated with latest events',
        color: '#3b82f6',
        gradient: ['#3b82f6', '#1d4ed8'],
        skills: [
          { id: 'ca-1', title: 'National News', icon: 'newspaper', color: '#3b82f6', progress: 100, totalLessons: 5, completedLessons: 5, crown: 3 },
          { id: 'ca-2', title: 'Kerala Updates', icon: 'location', color: '#22c55e', progress: 60, totalLessons: 5, completedLessons: 3, crown: 1 },
          { id: 'ca-3', title: 'International', icon: 'globe', color: '#8b5cf6', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'ca-4', title: 'Sports & Awards', icon: 'trophy', color: '#f59e0b', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
        ],
      },
      {
        id: 'u2',
        title: 'Indian Polity',
        description: 'Master the Constitution',
        color: '#22c55e',
        gradient: ['#22c55e', '#16a34a'],
        skills: [
          { id: 'pol-1', title: 'Constitution', icon: 'book', color: '#22c55e', progress: 0, totalLessons: 6, completedLessons: 0, crown: 0 },
          { id: 'pol-2', title: 'Fundamental Rights', icon: 'shield-checkmark', color: '#f59e0b', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'pol-3', title: 'Parliament', icon: 'business', color: '#3b82f6', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'pol-4', title: 'Judiciary', icon: 'hammer', color: '#ec4899', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
          { id: 'pol-5', title: 'State Govt', icon: 'flag', color: '#8b5cf6', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
        ],
      },
      {
        id: 'u3',
        title: 'Indian Economy',
        description: 'Economic concepts simplified',
        color: '#f59e0b',
        gradient: ['#f59e0b', '#d97706'],
        skills: [
          { id: 'eco-1', title: 'Basic Concepts', icon: 'trending-up', color: '#f59e0b', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'eco-2', title: 'Banking & RBI', icon: 'card', color: '#3b82f6', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'eco-3', title: 'Budget & Tax', icon: 'cash', color: '#22c55e', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
          { id: 'eco-4', title: 'Schemes', icon: 'people', color: '#ec4899', progress: 0, totalLessons: 6, completedLessons: 0, crown: 0 },
        ],
      },
      {
        id: 'u4',
        title: 'Geography',
        description: 'Explore India and the World',
        color: '#06b6d4',
        gradient: ['#06b6d4', '#0891b2'],
        skills: [
          { id: 'geo-1', title: 'Physical India', icon: 'earth', color: '#06b6d4', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'geo-2', title: 'Rivers & Lakes', icon: 'water', color: '#3b82f6', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
          { id: 'geo-3', title: 'Climate', icon: 'cloudy', color: '#f59e0b', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
          { id: 'geo-4', title: 'Kerala Geography', icon: 'map', color: '#22c55e', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
        ],
      },
      {
        id: 'u5',
        title: 'History',
        description: 'Journey through time',
        color: '#ec4899',
        gradient: ['#ec4899', '#db2777'],
        skills: [
          { id: 'his-1', title: 'Ancient India', icon: 'time', color: '#ec4899', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'his-2', title: 'Medieval India', icon: 'library', color: '#f59e0b', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'his-3', title: 'Modern India', icon: 'flag', color: '#22c55e', progress: 0, totalLessons: 6, completedLessons: 0, crown: 0 },
          { id: 'his-4', title: 'Kerala History', icon: 'boat', color: '#8b5cf6', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
        ],
      },
      {
        id: 'u6',
        title: 'General Science',
        description: 'Science made simple',
        color: '#8b5cf6',
        gradient: ['#8b5cf6', '#7c3aed'],
        skills: [
          { id: 'sci-1', title: 'Physics', icon: 'flash', color: '#f59e0b', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'sci-2', title: 'Chemistry', icon: 'flask', color: '#ec4899', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'sci-3', title: 'Biology', icon: 'leaf', color: '#22c55e', progress: 0, totalLessons: 5, completedLessons: 0, crown: 0 },
          { id: 'sci-4', title: 'Technology', icon: 'hardware-chip', color: '#3b82f6', progress: 0, totalLessons: 4, completedLessons: 0, crown: 0 },
        ],
      },
    ]

    // Apply unlock logic
    return baseUnits.map((unit, ui) => {
      const prevUnitComplete = ui === 0 ? true : baseUnits[ui - 1].skills.every(s => s.progress >= 60)
      return {
        ...unit,
        skills: unit.skills.map((s, si) => {
          const prevSkillProgress = si === 0 ? 100 : unit.skills[si - 1].progress
          const skillUnlocked = (ui === 0 || prevUnitComplete) && (si === 0 || prevSkillProgress >= 60)
          return { ...s, locked: !skillUnlocked }
        })
      }
    })
  }

  const units = getUnitsForLevel(selectedLevel)

  const onSkillPress = async (skill: Skill) => {
    if (skill.locked) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      Alert.alert(
        '🔒 Locked',
        'Complete previous lessons to unlock this skill!',
        [{ text: 'OK', style: 'default' }]
      )
      return
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    
    // Show coming soon notification
    Alert.alert(
      '🚀 Coming Soon!',
      `"${skill.title}" lessons are being prepared. We're working hard to bring you quality content!\n\nStay tuned for updates! 📚`,
      [{ text: 'Got it!', style: 'default' }]
    )
  }

  const onLevelSelect = async (levelId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedLevel(levelId)
    setShowLevelSheet(false)
  }

  // Crown colors based on level
  const getCrownColor = (crown: number) => {
    if (crown === 0) return '#9ca3af'
    if (crown <= 2) return '#a78bfa'
    if (crown <= 4) return '#fbbf24'
    return '#22d3ee'
  }

  // Curved Path Component
  const CurvedPath = ({ fromX, toX, color }: { fromX: number; toX: number; color: string }) => {
    const centerX = SCREEN_WIDTH / 2
    const startX = centerX + fromX
    const endX = centerX + toX
    const height = 50
    const controlPointOffset = 30

    // Create smooth S-curve
    const path = `M ${startX} 0 
                  C ${startX} ${controlPointOffset}, 
                    ${endX} ${height - controlPointOffset}, 
                    ${endX} ${height}`

    return (
      <Svg height={height} width={SCREEN_WIDTH} style={{ position: 'absolute', top: 0, left: -centerX }}>
        <Defs>
          <SvgGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.3" />
            <Stop offset="1" stopColor={color} stopOpacity="0.6" />
          </SvgGradient>
        </Defs>
        <Path
          d={path}
          stroke="url(#pathGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    )
  }

  // Skill Node Component
  const SkillNode = ({ skill, index, isLast, nextSkill }: { skill: Skill; index: number; isLast: boolean; nextSkill?: Skill }) => {
    const nodeSize = 72
    const isActive = !skill.locked && skill.progress < 100
    const isComplete = skill.progress === 100

    // Better zigzag pattern: more pronounced
    const positions = [0, -60, 60, -60, 60, 0] // center, left, right, left, right, center
    const offsetX = positions[index % positions.length]
    const nextOffsetX = !isLast && nextSkill ? positions[(index + 1) % positions.length] : 0

    return (
      <YStack ai="center" style={{ marginLeft: offsetX, position: 'relative' }}>
        <Animated.View entering={FadeInDown.delay(100 + index * 80).springify()}>
          <Pressable onPress={() => onSkillPress(skill)}>
            <YStack ai="center" gap="$2">
              {/* Progress Ring */}
              <YStack w={nodeSize + 12} h={nodeSize + 12} ai="center" jc="center">
                {/* Background ring */}
                <YStack
                  position="absolute"
                  w={nodeSize + 12}
                  h={nodeSize + 12}
                  br={999}
                  style={{
                    borderWidth: 4,
                    borderColor: skill.locked ? 'rgba(156,163,175,0.2)' : `${skill.color}30`
                  }}
                />
                
                {/* Progress ring - simplified */}
                {!skill.locked && skill.progress > 0 && (
                  <YStack
                    position="absolute"
                    w={nodeSize + 12}
                    h={nodeSize + 12}
                    br={999}
                    style={{
                      borderWidth: 4,
                      borderColor: skill.color,
                      opacity: skill.progress / 100
                    }}
                  />
                )}

                {/* Main Node */}
                <YStack
                  w={nodeSize}
                  h={nodeSize}
                  br={999}
                  ai="center"
                  jc="center"
                  overflow="hidden"
                  style={{
                    shadowColor: skill.locked ? 'transparent' : skill.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isActive ? 0.5 : 0.3,
                    shadowRadius: isActive ? 12 : 8,
                  }}
                >
                  {skill.locked ? (
                    <YStack w="100%" h="100%" bg="$gray4" ai="center" jc="center">
                      <Ionicons name="lock-closed" size={28} color="#9ca3af" />
                    </YStack>
                  ) : (
                    <>
                      <LinearGradient
                        colors={[skill.color, `${skill.color}dd`]}
                        style={{ position: 'absolute', width: '100%', height: '100%' }}
                      />
                      <Ionicons name={skill.icon} size={32} color="#fff" />
                    </>
                  )}
                </YStack>

                {/* Crown badge */}
                {!skill.locked && skill.crown > 0 && (
                  <YStack
                    position="absolute"
                    top={-4}
                    right={-4}
                    w={28}
                    h={28}
                    br={999}
                    ai="center"
                    jc="center"
                    bg={isDark ? '$gray1' : '#fff'}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                  >
                    <Text fontSize={14}>👑</Text>
                    <YStack position="absolute" bottom={-2}>
                      <Text fontSize={8} fontWeight="800" color={getCrownColor(skill.crown)}>
                        {skill.crown}
                      </Text>
                    </YStack>
                  </YStack>
                )}

                {/* Active indicator */}
                {isActive && (
                  <YStack
                    position="absolute"
                    bottom={-6}
                    bg={skill.color}
                    px="$2"
                    py={2}
                    br={8}
                  >
                    <Text fontSize={10} fontWeight="700" color="#fff">START</Text>
                  </YStack>
                )}
              </YStack>

              {/* Title */}
              <Text
                fontSize={13}
                fontWeight="600"
                color={skill.locked ? '$gray9' : '$gray12'}
                textAlign="center"
                numberOfLines={2}
                style={{ width: 90 }}
              >
                {skill.title}
              </Text>

              {/* Lessons count */}
              {!skill.locked && (
                <Text fontSize={11} color="$gray10">
                  {skill.completedLessons}/{skill.totalLessons} lessons
                </Text>
              )}
            </YStack>
          </Pressable>
        </Animated.View>

        {/* Curved Connector */}
        {!isLast && nextSkill && (
          <YStack h={50} w="100%" style={{ position: 'relative' }}>
            <CurvedPath 
              fromX={offsetX} 
              toX={nextOffsetX} 
              color={nextSkill.locked ? (isDark ? '#4b5563' : '#d1d5db') : nextSkill.color}
            />
          </YStack>
        )}
      </YStack>
    )
  }

  // Unit Header Component
  const UnitHeader = ({ unit, index }: { unit: Unit; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <YStack mb="$4" overflow="hidden" br={20}>
        <LinearGradient
          colors={unit.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 20 }}
        >
          <XStack ai="center" jc="space-between">
            <YStack f={1} gap="$1">
              <Text fontSize={12} fontWeight="600" color="rgba(255,255,255,0.8)">
                UNIT {index + 1}
              </Text>
              <Text fontSize={20} fontWeight="800" color="#fff">
                {unit.title}
              </Text>
              <Text fontSize={13} color="rgba(255,255,255,0.8)">
                {unit.description}
              </Text>
            </YStack>
            <YStack
              w={50}
              h={50}
              br={16}
              ai="center"
              jc="center"
              bg="rgba(255,255,255,0.2)"
            >
              <Ionicons name="book" size={24} color="#fff" />
            </YStack>
          </XStack>

          {/* Unit progress */}
          <YStack mt="$3" gap="$2">
            <XStack jc="space-between">
              <Text fontSize={12} color="rgba(255,255,255,0.8)">Progress</Text>
              <Text fontSize={12} fontWeight="700" color="#fff">
                {Math.round(unit.skills.filter(s => !s.locked).reduce((a, s) => a + s.progress, 0) / unit.skills.length)}%
              </Text>
            </XStack>
            <YStack h={6} br={3} bg="rgba(255,255,255,0.3)" overflow="hidden">
              <YStack
                h="100%"
                br={3}
                bg="#fff"
                w={`${unit.skills.filter(s => !s.locked).reduce((a, s) => a + s.progress, 0) / unit.skills.length}%`}
              />
            </YStack>
          </YStack>
        </LinearGradient>
      </YStack>
    </Animated.View>
  )

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <YStack
        pt={insets.top}
        pb="$3"
        px="$4"
        bg="$background"
        borderBottomWidth={1}
        borderBottomColor="$gray4"
      >
        <XStack ai="center" jc="space-between">
          {/* Level Selector */}
          <Pressable onPress={() => setShowLevelSheet(true)}>
            <XStack
              ai="center"
              gap="$2"
              bg="$gray3"
              px="$3"
              py="$2"
              br={12}
            >
              <LinearGradient
                colors={currentLevelData.gradient}
                style={{ width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name={currentLevelData.icon as any} size={16} color="#fff" />
              </LinearGradient>
              <YStack>
                <Text fontSize={14} fontWeight="700">{currentLevelData.title}</Text>
                <Text fontSize={10} color="$gray10">{currentLevelData.subtitle}</Text>
              </YStack>
              <Ionicons name="chevron-down" size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
            </XStack>
          </Pressable>

          {/* Stats */}
          <XStack ai="center" gap="$3">
            <XStack ai="center" gap="$1">
              <Text fontSize={16}>❤️</Text>
              <Text fontWeight="700" color="$red9">{hearts}</Text>
            </XStack>
            <XStack ai="center" gap="$1">
              <Text fontSize={16}>💎</Text>
              <Text fontWeight="700" color="$blue9">{gems}</Text>
            </XStack>
            <XStack ai="center" gap="$1">
              <Ionicons name="flame" size={18} color="#f59e0b" />
              <Text fontWeight="700" color="$orange9">{xp}</Text>
            </XStack>
          </XStack>
        </XStack>
      </YStack>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack p="$4" gap="$6">
          {units.map((unit, unitIndex) => (
            <YStack key={unit.id}>
              <UnitHeader unit={unit} index={unitIndex} />
              
              {/* Skills Path */}
              <YStack ai="center" gap="$1">
                {unit.skills.map((skill, skillIndex) => (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    index={skillIndex}
                    isLast={skillIndex === unit.skills.length - 1}
                    nextSkill={unit.skills[skillIndex + 1]}
                  />
                ))}
              </YStack>
            </YStack>
          ))}

          {/* Development Indicator */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <YStack
              ai="center"
              gap="$3"
              p="$5"
              br={20}
              bg={isDark ? '$gray2' : '#fff'}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 10,
                borderWidth: isDark ? 0 : 1,
                borderColor: isDark ? 'transparent' : '#e5e7eb',
              }}
            >
              <YStack
                w={64}
                h={64}
                br={32}
                ai="center"
                jc="center"
                overflow="hidden"
              >
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  style={{ position: 'absolute', width: '100%', height: '100%' }}
                />
                <Text fontSize={32}>🚧</Text>
              </YStack>
              
              <YStack ai="center" gap="$2">
                <Text fontSize={18} fontWeight="800" textAlign="center">
                  More Lessons Coming Soon!
                </Text>
                <Text fontSize={14} color="$gray10" textAlign="center" lineHeight={20}>
                  We're actively developing new content for you.{' \n'}
                  More subjects and lessons will be added regularly!
                </Text>
              </YStack>

              <YStack w="100%" gap="$2" mt="$2">
                <XStack ai="center" gap="$2" jc="center">
                  <YStack w={8} h={8} br={4} bg="$green9" />
                  <Text fontSize={13} color="$gray11">Content in Development</Text>
                </XStack>
                <XStack ai="center" gap="$2" jc="center">
                  <Ionicons name="notifications" size={16} color="#8b5cf6" />
                  <Text fontSize={13} color="$gray11">You'll be notified on updates</Text>
                </XStack>
              </YStack>

              {/* Progress Dots */}
              <XStack gap="$2" mt="$2">
                {[1, 2, 3].map((dot) => (
                  <YStack
                    key={dot}
                    w={8}
                    h={8}
                    br={4}
                    bg={dot === 1 ? '$purple9' : '$gray4'}
                  />
                ))}
              </XStack>
            </YStack>
          </Animated.View>

          {/* Feedback Card */}
          <Animated.View entering={FadeInDown.delay(500)}>
            <Pressable onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              Alert.alert(
                '💬 Feedback',
                'Thank you for testing! Your feedback helps us improve.\n\nWhat would you like to see next?',
                [
                  { text: 'More Subjects', style: 'default' },
                  { text: 'Practice Tests', style: 'default' },
                  { text: 'Cancel', style: 'cancel' }
                ]
              )
            }}>
              <YStack
                p="$4"
                br={16}
                bg="$purple3"
                borderWidth={2}
                borderColor="$purple9"
                style={{ borderStyle: 'dashed' }}
              >
                <XStack ai="center" jc="center" gap="$2">
                  <Ionicons name="chatbubbles" size={20} color="#8b5cf6" />
                  <Text fontSize={14} fontWeight="700" color="$purple11">
                    Help us improve! Share your feedback
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#8b5cf6" />
                </XStack>
              </YStack>
            </Pressable>
          </Animated.View>
        </YStack>
      </ScrollView>

      {/* Level Selector Sheet */}
      <Sheet
        modal
        open={showLevelSheet}
        onOpenChange={setShowLevelSheet}
        snapPoints={[55]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame bg="$background" p="$4" pt="$2">
          <Sheet.Handle />
          
          <YStack gap="$4" mt="$4">
            <Text fontSize={20} fontWeight="800" textAlign="center">
              Choose Your Level
            </Text>
            <Text fontSize={14} color="$gray10" textAlign="center">
              Select based on your educational qualification
            </Text>

            <YStack gap="$3" mt="$2">
              {courseLevels.map((level, index) => (
                <Animated.View key={level.id} entering={FadeInDown.delay(index * 80)}>
                  <Pressable onPress={() => onLevelSelect(level.id)}>
                    <YStack
                      p="$4"
                      br={16}
                      bg={selectedLevel === level.id ? `${level.color}15` : '$gray2'}
                      borderWidth={2}
                      borderColor={selectedLevel === level.id ? level.color : 'transparent'}
                    >
                      <XStack ai="center" gap="$3">
                        <LinearGradient
                          colors={level.gradient}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Ionicons name={level.icon as any} size={24} color="#fff" />
                        </LinearGradient>
                        
                        <YStack f={1}>
                          <Text fontSize={17} fontWeight="700">{level.title}</Text>
                          <Text fontSize={13} color="$gray10">{level.subtitle}</Text>
                          <XStack flexWrap="wrap" gap="$1" mt="$2">
                            {level.exams.slice(0, 3).map((exam) => (
                              <YStack key={exam} bg="$gray4" px="$2" py={2} br={6}>
                                <Text fontSize={10} color="$gray11">{exam}</Text>
                              </YStack>
                            ))}
                            {level.exams.length > 3 && (
                              <YStack bg="$gray4" px="$2" py={2} br={6}>
                                <Text fontSize={10} color="$gray11">+{level.exams.length - 3}</Text>
                              </YStack>
                            )}
                          </XStack>
                        </YStack>

                        {selectedLevel === level.id && (
                          <Circle size={24} bg={level.color}>
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