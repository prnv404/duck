import { YStack, XStack, Text, Circle, Sheet } from 'tamagui'
import * as Haptics from 'expo-haptics'
import { ScrollView, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing 
} from 'react-native-reanimated'
import StreakCalendar from '@/components/StreakCalendar'

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const isDark = useColorScheme() === 'dark'
  
  const [userName] = useState('Aspirant')
  const [level] = useState(12)
  const [xp] = useState(2450)
  const [xpToNext] = useState(3000)
  const [coins] = useState(340)
  const [currentStreak] = useState(7)
  const [longestStreak] = useState(14)
  
  const [selectedMode, setSelectedMode] = useState<'bullet' | 'blitz' | 'rapid'>('blitz')
  const [playType, setPlayType] = useState<'solo' | 'friends' | 'random'>('solo')
  const [customTopicEnabled, setCustomTopicEnabled] = useState(false)
  const [showTopicSheet, setShowTopicSheet] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  
  const fireScale = useSharedValue(1)

  useEffect(() => {
    fireScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )
  }, [])

  const fireAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }]
  }))

  const modes = [
    { 
      key: 'bullet' as const, 
      label: 'Bullet', 
      time: '30s', 
      icon: 'flash', 
      questions: 10,
      color: '#22c55e',
      gradient: ['#22c55e', '#22c55e'] as [string, string],
      desc: 'Lightning fast'
    },
    { 
      key: 'blitz' as const, 
      label: 'Blitz', 
      time: '2min', 
      icon: 'flame', 
      questions: 15,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#3b82f6'] as [string, string],
      desc: 'Think quick'
    },
    { 
      key: 'rapid' as const, 
      label: 'Rapid', 
      time: '5min', 
      icon: 'timer', 
      questions: 25,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#8b5cf6'] as [string, string],
      desc: 'Deep focus'
    }
  ]

  const dailyQuests = [
    { id: 1, title: 'Complete 3 Quizzes', progress: 1, total: 3, xp: 50, icon: 'document-text', color: '#3b82f6' },
    { id: 2, title: 'Score 80%+ in History', progress: 0, total: 1, xp: 100, icon: 'school', color: '#8b5cf6' },
    { id: 3, title: 'Win a Multiplayer Match', progress: 0, total: 1, xp: 75, icon: 'trophy', color: '#f59e0b' },
  ]

  const newsTopics = [
    { id: 1, title: 'Union Budget 2025', questions: 10, isNew: true, icon: 'cash' },
    { id: 2, title: 'Supreme Court Updates', questions: 8, isNew: true, icon: 'hammer' },
    { id: 3, title: 'International Affairs', questions: 12, isNew: false, icon: 'globe' },
  ]

  const quizTopics = [
    { id: 'history', title: 'Indian History', icon: 'time', color: '#f59e0b' },
    { id: 'geography', title: 'Geography', icon: 'earth', color: '#22c55e' },
    { id: 'polity', title: 'Polity & Governance', icon: 'shield', color: '#3b82f6' },
    { id: 'economy', title: 'Economy', icon: 'trending-up', color: '#8b5cf6' },
    { id: 'science', title: 'Science & Tech', icon: 'flask', color: '#06b6d4' },
    { id: 'current', title: 'Current Affairs', icon: 'newspaper', color: '#ec4899' },
    { id: 'kerala', title: 'Kerala Specific', icon: 'location', color: '#f97316' },
    { id: 'general', title: 'General Knowledge', icon: 'bulb', color: '#eab308' },
  ]

  const onModeSelect = async (mode: 'bullet' | 'blitz' | 'rapid') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedMode(mode)
  }

  const onPlayTypeSelect = async (type: 'solo' | 'friends' | 'random') => {
    await Haptics.selectionAsync()
    setPlayType(type)
  }

  const onToggleCustomTopic = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setCustomTopicEnabled(!customTopicEnabled)
    if (!customTopicEnabled) {
      setSelectedTopics([])
    }
  }

  const onSelectTopic = async (topicId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  const onStartQuiz = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (customTopicEnabled && selectedTopics.length === 0) {
      setShowTopicSheet(true)
      return
    }
    // Quiz start logic with selected topics
    console.log('Starting quiz with topics:', selectedTopics)
  }

  const onDailyNewsPress = async (topicId: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const selectedModeData = modes.find(m => m.key === selectedMode)!

  // Card wrapper component for consistent styling
  const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <YStack
      bg={isDark ? '$gray2' : '#fff'}
      br={20}
      p="$4"
      style={[{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 10,
        borderWidth: isDark ? 0 : 1,
        borderColor: isDark ? 'transparent' : '#e5e7eb',
      }, style]}
    >
      {children}
    </YStack>
  )

  return (
    <YStack f={1} bg={isDark ? '$background' : '#f9fafb'}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack p="$4" pt={insets.top + 16} gap="$4">
          
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(50).springify()}>
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap="$3">
                <YStack>
                  <YStack 
                    w={56} h={56} br={18} 
                    ai="center" jc="center" 
                    overflow="hidden"
                    style={{ borderWidth: 2, borderColor: '#3b82f6' }}
                  >
                    <LinearGradient
                      colors={['#06b6d4', '#3b82f6']}
                      style={{ position: 'absolute', width: '100%', height: '100%' }}
                    />
                    <Text fontSize={24} fontWeight="800" color="#fff">A</Text>
                  </YStack>
                  <YStack 
                    position="absolute" 
                    bottom={-4} right={-4}
                    bg="$orange9" 
                    px="$2" py={2} 
                    br={10}
                    style={{ borderWidth: 2, borderColor: isDark ? '#1e293b' : '#fff' }}
                  >
                    <Text fontSize={10} fontWeight="800" color="#fff">{level}</Text>
                  </YStack>
                </YStack>
                
                <YStack>
                  <Text fontSize={13} color="$gray10">Welcome back</Text>
                  <Text fontSize={20} fontWeight="800">{userName}!</Text>
                </YStack>
              </XStack>

              <XStack ai="center" gap="$2">
                <XStack ai="center" gap="$1" bg="$gray3" px="$3" py="$2" br={20}>
                  <Text fontSize={16}>🪙</Text>
                  <Text fontSize={14} fontWeight="700">{coins}</Text>
                </XStack>
                <YStack w={42} h={42} br={14} ai="center" jc="center" bg="$gray3">
                  <Ionicons name="notifications" size={20} color={isDark ? '#e5e7eb' : '#374151'} />
                  <Circle size={8} bg="$red9" position="absolute" top={8} right={8} />
                </YStack>
              </XStack>
            </XStack>
          </Animated.View>

          {/* Streak */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <StreakCalendar 
              currentStreak={currentStreak}
              longestStreak={longestStreak}
            />
          </Animated.View>

          {/* Play Quiz */}
          <YStack gap="$3">
            <Animated.View entering={FadeInDown.delay(300)}>
              <Text fontSize={18} fontWeight="800">⚔️ Play Quiz</Text>
            </Animated.View>

            {/* Mode Selector */}
            <Animated.View entering={FadeInDown.delay(320)}>
              <XStack gap="$3">
                {modes.map((mode) => (
                  <Pressable 
                    key={mode.key} 
                    onPress={() => onModeSelect(mode.key)}
                    style={{ flex: 1 }}
                  >
                    <YStack
                      p="$3"
                      br={16}
                      ai="center"
                      gap="$2"
                      bg={selectedMode === mode.key ? (isDark ? '$gray2' : '#fff') : '$gray3'}
                      style={selectedMode === mode.key ? {
                        borderWidth: 2,
                        borderColor: mode.color,
                        shadowColor: mode.color,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 12
                      } : { borderWidth: 2, borderColor: 'transparent' }}
                    >
                      <Circle size={44} bg={selectedMode === mode.key ? mode.color : '$gray5'}>
                        <Ionicons 
                          name={mode.icon as any} 
                          size={22} 
                          color={selectedMode === mode.key ? '#fff' : isDark ? '#9ca3af' : '#6b7280'} 
                        />
                      </Circle>
                      <Text fontSize={14} fontWeight="700">{mode.label}</Text>
                      <Text fontSize={11} color="$gray10">{mode.time}</Text>
                    </YStack>
                  </Pressable>
                ))}
              </XStack>
            </Animated.View>

            {/* Play Type Selector */}
            <Animated.View entering={FadeInDown.delay(360)}>
              <Card>
                <YStack gap="$3">
                  <Text fontSize={13} color="$gray10" fontWeight="600">Play with</Text>
                  <XStack gap="$2">
                    {[
                      { key: 'solo' as const, label: 'Solo', icon: 'person' },
                      { key: 'friends' as const, label: 'Friends', icon: 'people' },
                      { key: 'random' as const, label: 'Random', icon: 'shuffle' }
                    ].map((type) => (
                      <Pressable 
                        key={type.key} 
                        onPress={() => onPlayTypeSelect(type.key)}
                        style={{ flex: 1 }}
                      >
                        <XStack
                          ai="center" jc="center" gap="$2"
                          py="$3" br={12}
                          bg={playType === type.key ? selectedModeData.color : '$gray4'}
                        >
                          <Ionicons 
                            name={type.icon as any} 
                            size={16} 
                            color={playType === type.key ? '#fff' : isDark ? '#9ca3af' : '#6b7280'} 
                          />
                          <Text 
                            fontSize={13} 
                            fontWeight="600"
                            color={playType === type.key ? '#fff' : '$gray11'}
                          >
                            {type.label}
                          </Text>
                        </XStack>
                      </Pressable>
                    ))}
                  </XStack>
                  
                  <XStack ai="center" gap="$2" mt="$1">
                    <Ionicons name="information-circle" size={16} color={selectedModeData.color} />
                    <Text fontSize={13} color="$gray10">
                      {selectedModeData.questions} questions • {selectedModeData.desc}
                    </Text>
                  </XStack>
                </YStack>
              </Card>
            </Animated.View>

            {/* Custom Topic Toggle */}
            <Animated.View entering={FadeInDown.delay(380)}>
              <Pressable onPress={onToggleCustomTopic}>
                <XStack
                  ai="center"
                  jc="space-between"
                  p="$3.5"
                  br={16}
                  bg={isDark ? '$gray2' : '#fff'}
                  style={{
                    borderWidth: 2,
                    borderColor: customTopicEnabled ? selectedModeData.color : 'transparent',
                    shadowColor: customTopicEnabled ? selectedModeData.color : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: customTopicEnabled ? 0.25 : 0.1,
                    shadowRadius: 8,
                  }}
                >
                  <XStack ai="center" gap="$3" f={1}>
                    <YStack
                      w={40}
                      h={40}
                      br={10}
                      ai="center"
                      jc="center"
                      bg={customTopicEnabled ? `${selectedModeData.color}20` : '$gray4'}
                    >
                      <Ionicons 
                        name="list" 
                        size={20} 
                        color={customTopicEnabled ? selectedModeData.color : (isDark ? '#9ca3af' : '#6b7280')} 
                      />
                    </YStack>
                    <YStack f={1}>
                      <Text fontSize={15} fontWeight="700">Custom Topics</Text>
                      <Text fontSize={12} color="$gray10">
                        {customTopicEnabled 
                          ? selectedTopics.length > 0 
                            ? `${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''} selected`
                            : 'Tap to select topics'
                          : 'Random questions from all topics'
                        }
                      </Text>
                    </YStack>
                  </XStack>
                  <YStack
                    w={24}
                    h={24}
                    br={12}
                    ai="center"
                    jc="center"
                    bg={customTopicEnabled ? selectedModeData.color : '$gray5'}
                  >
                    <Ionicons 
                      name={customTopicEnabled ? 'checkmark' : 'close'} 
                      size={14} 
                      color="#fff" 
                    />
                  </YStack>
                </XStack>
              </Pressable>
            </Animated.View>

            {/* Topic Selection Button (when custom enabled) */}
            {customTopicEnabled && (
              <Animated.View entering={FadeInDown.delay(390)}>
                <Pressable onPress={() => setShowTopicSheet(true)}>
                  <YStack
                    p="$3"
                    br={14}
                    bg={`${selectedModeData.color}15`}
                    style={{ borderWidth: 1, borderColor: `${selectedModeData.color}40` }}
                  >
                    <XStack ai="center" jc="center" gap="$2">
                      <Ionicons name="add-circle" size={18} color={selectedModeData.color} />
                      <Text fontSize={14} fontWeight="700" style={{ color: selectedModeData.color }}>
                        {selectedTopics.length > 0 ? 'Change Topics' : 'Select Topics'}
                      </Text>
                    </XStack>
                  </YStack>
                </Pressable>
              </Animated.View>
            )}

            {/* Start Button */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <Pressable onPress={onStartQuiz}>
                <YStack 
                  h={56} br={16} 
                  ai="center" jc="center"
                  overflow="hidden"
                  style={{
                    shadowColor: selectedModeData.color,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16
                  }}
                >
                  <LinearGradient
                    colors={selectedModeData.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                  />
                  <XStack ai="center" gap="$2">
                    <Ionicons name="play" size={20} color="#fff" />
                    <Text fontSize={17} fontWeight="800" color="#fff">
                      Start {selectedModeData.label} Quiz
                    </Text>
                  </XStack>
                </YStack>
              </Pressable>
            </Animated.View>
          </YStack>

        </YStack>
      </ScrollView>

      {/* Topic Selection Sheet */}
      <Sheet
        modal
        open={showTopicSheet}
        onOpenChange={setShowTopicSheet}
        snapPoints={[85]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Frame bg={isDark ? '$gray1' : '#fff'} br={24}>
          <Sheet.Handle bg="$gray8" />
          <YStack p="$4" gap="$4">
            {/* Header */}
            <YStack gap="$2">
              <Text fontSize={24} fontWeight="900">Select Topics</Text>
              <Text fontSize={14} color="$gray10">
                Choose topics for your custom quiz
              </Text>
            </YStack>

            {/* Topics Grid */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack gap="$3" pb="$4">
                {quizTopics.map((topic, index) => {
                  const isSelected = selectedTopics.includes(topic.id)
                  return (
                    <Animated.View key={topic.id} entering={FadeInDown.delay(100 + index * 50)}>
                      <Pressable onPress={() => onSelectTopic(topic.id)}>
                        <XStack
                          ai="center"
                          gap="$3"
                          p="$3.5"
                          br={16}
                          bg={isSelected ? `${topic.color}15` : (isDark ? '$gray2' : '#f9fafb')}
                          style={{
                            borderWidth: 2,
                            borderColor: isSelected ? topic.color : 'transparent',
                          }}
                        >
                          <YStack
                            w={48}
                            h={48}
                            br={12}
                            ai="center"
                            jc="center"
                            bg={isSelected ? topic.color : '$gray4'}
                          >
                            <Ionicons name={topic.icon as any} size={24} color="#fff" />
                          </YStack>
                          <YStack f={1}>
                            <Text fontSize={16} fontWeight="700">{topic.title}</Text>
                          </YStack>
                          {isSelected && (
                            <YStack
                              w={28}
                              h={28}
                              br={14}
                              ai="center"
                              jc="center"
                              bg={topic.color}
                            >
                              <Ionicons name="checkmark" size={16} color="#fff" />
                            </YStack>
                          )}
                        </XStack>
                      </Pressable>
                    </Animated.View>
                  )
                })}
              </YStack>
            </ScrollView>

            {/* Action Buttons */}
            <XStack gap="$3">
              <Pressable onPress={() => setShowTopicSheet(false)} style={{ flex: 1 }}>
                <YStack
                  h={52}
                  br={14}
                  ai="center"
                  jc="center"
                  bg="$gray4"
                >
                  <Text fontSize={15} fontWeight="700" color="$gray11">Cancel</Text>
                </YStack>
              </Pressable>
              <Pressable 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                  setShowTopicSheet(false)
                }} 
                style={{ flex: 1 }}
              >
                <YStack
                  h={52}
                  br={14}
                  ai="center"
                  jc="center"
                  overflow="hidden"
                >
                  <LinearGradient
                    colors={selectedModeData.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                  />
                  <Text fontSize={15} fontWeight="800" color="#fff">
                    Done ({selectedTopics.length})
                  </Text>
                </YStack>
              </Pressable>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}