import { YStack, XStack, Text, Circle } from 'tamagui'
import { useState, useRef } from 'react'
import { Pressable, ScrollView, Dimensions } from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'
import * as Haptics from 'expo-haptics'
import Ionicons from '@expo/vector-icons/Ionicons'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type StreakData = {
  [date: string]: number // date format: 'YYYY-MM-DD', value: number of activities (0-5+)
}

type StreakCalendarProps = {
  streakData?: StreakData
  currentStreak?: number
  longestStreak?: number
}

export default function StreakCalendar({ 
  streakData = {}, 
  currentStreak = 7,
  longestStreak = 14 
}: StreakCalendarProps) {
  const isDark = useColorScheme() === 'dark'
  const [expanded, setExpanded] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const scrollViewRef = useRef<ScrollView>(null)

  // Generate sample streak data if none provided
  const generateSampleData = (): StreakData => {
    const data: StreakData = {}
    const today = new Date()
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Random activity level (0-5)
      if (i < 7) {
        data[dateStr] = Math.random() > 0.1 ? Math.floor(Math.random() * 5) + 1 : 0
      } else {
        data[dateStr] = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0
      }
    }
    return data
  }

  const data = Object.keys(streakData).length > 0 ? streakData : generateSampleData()

  // Get intensity color based on activity count
  const getIntensityColor = (count: number) => {
    if (count === 0) return isDark ? '#1e293b' : '#f1f5f9'
    if (count === 1) return isDark ? '#134e4a' : '#ccfbf1'
    if (count === 2) return isDark ? '#0f766e' : '#5eead4'
    if (count === 3) return isDark ? '#0d9488' : '#2dd4bf'
    if (count >= 4) return isDark ? '#14b8a6' : '#14b8a6'
    return isDark ? '#1e293b' : '#f1f5f9'
  }

  // Get last 7 days for compact view
  const getLast7Days = () => {
    const days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      days.push({
        date: dateStr,
        day: date.getDate(),
        dayName: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()],
        count: data[dateStr] || 0
      })
    }
    return days
  }

  // Get calendar grid for a month
  const getMonthGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay() // 0 = Sunday
    const daysInMonth = lastDay.getDate()
    
    const weeks: Array<Array<{ date: string; day: number; count: number } | null>> = []
    let currentWeek: Array<{ date: string; day: number; count: number } | null> = []
    
    // Fill initial empty days
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null)
    }
    
    // Fill days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      
      currentWeek.push({
        date: dateStr,
        day,
        count: data[dateStr] || 0
      })
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    
    // Fill remaining empty days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      weeks.push(currentWeek)
    }
    
    return weeks
  }

  const toggleExpanded = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setExpanded(!expanded)
  }

  const changeMonth = async (direction: 'prev' | 'next') => {
    await Haptics.selectionAsync()
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const weeks = getMonthGrid(currentMonth.getFullYear(), currentMonth.getMonth())
  const last7Days = getLast7Days()

  if (!expanded) {
    // Compact Week View
    return (
      <Pressable onPress={toggleExpanded}>
        <YStack
          bg={isDark ? '$gray2' : '#fff'}
          br={20}
          p="$4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
          }}
        >
          <XStack ai="center" jc="space-between" mb="$3">
            <YStack>
              <Text fontSize={16} fontWeight="800">🔥 Streak</Text>
              <Text fontSize={12} color="$gray10">Tap to view full calendar</Text>
            </YStack>
            <YStack ai="flex-end">
              <XStack ai="center" gap="$1">
                <Text fontSize={24} fontWeight="900" color="$orange9">{currentStreak}</Text>
                <Text fontSize={12} color="$gray10">days</Text>
              </XStack>
              <Text fontSize={11} color="$gray9">Best: {longestStreak}</Text>
            </YStack>
          </XStack>

          {/* Last 7 Days */}
          <XStack jc="space-between" mb="$2">
            {last7Days.map((day, idx) => (
              <YStack key={idx} ai="center" gap="$1">
                <Text fontSize={10} color="$gray10" fontWeight="600">
                  {day.dayName}
                </Text>
                <YStack
                  w={36}
                  h={36}
                  br={10}
                  ai="center"
                  jc="center"
                  bg={getIntensityColor(day.count)}
                  style={day.count > 0 ? {
                    shadowColor: '#14b8a6',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  } : {}}
                >
                  {day.count > 0 && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </YStack>
                <Text fontSize={10} color="$gray9">{day.day}</Text>
              </YStack>
            ))}
          </XStack>

          {/* Legend */}
          <XStack ai="center" jc="space-between" mt="$2" pt="$2" borderTopWidth={1} borderTopColor="$gray4">
            <Text fontSize={11} color="$gray10">Less</Text>
            <XStack gap="$1">
              {[0, 1, 2, 3, 4].map(level => (
                <YStack key={level} w={16} h={16} br={4} bg={getIntensityColor(level)} />
              ))}
            </XStack>
            <Text fontSize={11} color="$gray10">More</Text>
          </XStack>
        </YStack>
      </Pressable>
    )
  }

  // Expanded Month View
  return (
    <Animated.View entering={FadeIn}>
      <YStack
        bg={isDark ? '$gray2' : '#fff'}
        br={20}
        p="$4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
        }}
      >
        {/* Header */}
        <XStack ai="center" jc="space-between" mb="$3">
          <YStack>
            <Text fontSize={18} fontWeight="800">🔥 Activity Streak</Text>
            <Text fontSize={12} color="$gray10">Your learning journey</Text>
          </YStack>
          <Pressable onPress={toggleExpanded}>
            <Circle size={32} bg="$gray4">
              <Ionicons name="close" size={18} color={isDark ? '#e5e7eb' : '#374151'} />
            </Circle>
          </Pressable>
        </XStack>

        {/* Stats */}
        <XStack gap="$3" mb="$4">
          <YStack f={1} bg="$orange3" p="$3" br={12}>
            <Text fontSize={11} color="$orange10" fontWeight="600">CURRENT</Text>
            <XStack ai="flex-end" gap="$1">
              <Text fontSize={28} fontWeight="900" color="$orange11">{currentStreak}</Text>
              <Text fontSize={12} color="$orange10" mb="$1">days</Text>
            </XStack>
          </YStack>
          <YStack f={1} bg="$purple3" p="$3" br={12}>
            <Text fontSize={11} color="$purple10" fontWeight="600">LONGEST</Text>
            <XStack ai="flex-end" gap="$1">
              <Text fontSize={28} fontWeight="900" color="$purple11">{longestStreak}</Text>
              <Text fontSize={12} color="$purple10" mb="$1">days</Text>
            </XStack>
          </YStack>
        </XStack>

        {/* Month Navigation */}
        <XStack ai="center" jc="space-between" mb="$3">
          <Pressable onPress={() => changeMonth('prev')}>
            <Circle size={36} bg="$gray4">
              <Ionicons name="chevron-back" size={18} color={isDark ? '#e5e7eb' : '#374151'} />
            </Circle>
          </Pressable>
          <Text fontSize={16} fontWeight="700">{monthName}</Text>
          <Pressable onPress={() => changeMonth('next')}>
            <Circle size={36} bg="$gray4">
              <Ionicons name="chevron-forward" size={18} color={isDark ? '#e5e7eb' : '#374151'} />
            </Circle>
          </Pressable>
        </XStack>

        {/* Day Labels */}
        <XStack jc="space-around" mb="$2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <YStack key={idx} w={36} ai="center">
              <Text fontSize={11} fontWeight="600" color="$gray10">{day}</Text>
            </YStack>
          ))}
        </XStack>

        {/* Calendar Grid */}
        <YStack gap="$1.5">
          {weeks.map((week, weekIdx) => (
            <XStack key={weekIdx} jc="space-around">
              {week.map((day, dayIdx) => (
                <YStack key={dayIdx} w={36} h={36} ai="center" jc="center">
                  {day ? (
                    <Pressable
                      onPress={async () => {
                        await Haptics.selectionAsync()
                      }}
                    >
                      <YStack
                        w={32}
                        h={32}
                        br={8}
                        ai="center"
                        jc="center"
                        bg={getIntensityColor(day.count)}
                        style={day.count > 0 ? {
                          shadowColor: '#14b8a6',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.3,
                          shadowRadius: 3,
                        } : {}}
                      >
                        <Text 
                          fontSize={11} 
                          fontWeight="600"
                          color={day.count > 0 ? '#fff' : '$gray9'}
                        >
                          {day.day}
                        </Text>
                      </YStack>
                    </Pressable>
                  ) : (
                    <YStack w={32} h={32} />
                  )}
                </YStack>
              ))}
            </XStack>
          ))}
        </YStack>

        {/* Legend */}
        <XStack ai="center" jc="space-between" mt="$3" pt="$3" borderTopWidth={1} borderTopColor="$gray4">
          <Text fontSize={11} color="$gray10">Less active</Text>
          <XStack gap="$1.5">
            {[0, 1, 2, 3, 4].map(level => (
              <YStack key={level} w={20} h={20} br={5} bg={getIntensityColor(level)} />
            ))}
          </XStack>
          <Text fontSize={11} color="$gray10">More active</Text>
        </XStack>

        {/* Activity Summary */}
        <YStack mt="$3" pt="$3" borderTopWidth={1} borderTopColor="$gray4">
          <Text fontSize={13} fontWeight="700" mb="$2">This Month</Text>
          <XStack jc="space-between">
            <YStack ai="center">
              <Text fontSize={20} fontWeight="800" color="$green9">
                {Object.values(data).filter(v => v > 0).length}
              </Text>
              <Text fontSize={11} color="$gray10">Active days</Text>
            </YStack>
            <YStack ai="center">
              <Text fontSize={20} fontWeight="800" color="$blue9">
                {Object.values(data).reduce((a, b) => a + b, 0)}
              </Text>
              <Text fontSize={11} color="$gray10">Total activities</Text>
            </YStack>
            <YStack ai="center">
              <Text fontSize={20} fontWeight="800" color="$purple9">
                {Math.round((Object.values(data).filter(v => v > 0).length / 30) * 100)}%
              </Text>
              <Text fontSize={11} color="$gray10">Consistency</Text>
            </YStack>
          </XStack>
        </YStack>
      </YStack>
    </Animated.View>
  )
}
