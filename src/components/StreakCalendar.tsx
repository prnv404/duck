import { useColorScheme } from '@/hooks/use-color-scheme'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import { useRef, useState } from 'react'
import { Dimensions, Pressable, ScrollView } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Circle, Text, XStack, YStack } from 'tamagui'

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

  const data = streakData || {}

  // Get intensity color based on activity count
  const getIntensityColor = (count: number) => {
    if (count === 0) return isDark ? '#27272A' : '#E4E4E7'
    if (count === 1) return isDark ? '#065f46' : '#a7f3d0'
    if (count === 2) return isDark ? '#047857' : '#6ee7b7'
    if (count === 3) return isDark ? '#059669' : '#34d399'
    if (count >= 4) return isDark ? '#10b981' : '#10b981'
    return isDark ? '#27272A' : '#E4E4E7'
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
          bg={isDark ? '#18181B' : '#FFFFFF'}
          br={16}
          p="$4"
          borderWidth={1}
          borderColor={isDark ? '#27272A' : '#E4E4E7'}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <XStack ai="center" jc="space-between" mb="$3">
            <YStack>
              <Text fontSize={16} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#0f172a'}>❤️‍🔥 Maintain streak bro</Text>
            </YStack>
            <YStack ai="flex-end">
              <XStack ai="center" gap="$1">
                <Text fontSize={22} fontFamily="Nunito_900Black" color="#10b981">{currentStreak}</Text>
                <Text fontSize={13} fontFamily="Nunito_600SemiBold" color={isDark ? '#a3a3a3' : '#64748b'}>days</Text>
              </XStack>
            </YStack>
          </XStack>

          {/* Last 7 Days */}
          <XStack jc="space-between">
            {last7Days.map((day, idx) => (
              <YStack key={idx} ai="center" gap="$1">
                <Text fontSize={11} color={isDark ? '#a3a3a3' : '#64748b'} fontFamily="Nunito_700Bold">
                  {day.dayName}
                </Text>
                <YStack
                  w={34}
                  h={34}
                  br={9}
                  ai="center"
                  jc="center"
                  bg={getIntensityColor(day.count)}
                  style={day.count > 0 ? {
                    shadowColor: '#10b981',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  } : {}}
                >
                  {day.count > 0 && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </YStack>
                <Text fontSize={10} fontFamily="Nunito_600SemiBold" color={isDark ? '#71717a' : '#a1a1aa'}>{day.day}</Text>
              </YStack>
            ))}
          </XStack>

          {/* Legend */}
          <XStack ai="center" jc="space-between" mt="$2" pt="$2" borderTopWidth={1} borderTopColor={isDark ? '#27272A' : '#E4E4E7'}>
            <Text fontSize={11} fontFamily="Nunito_600SemiBold" color={isDark ? '#a3a3a3' : '#64748b'}>Less</Text>
            <XStack gap="$1">
              {[0, 1, 2, 3, 4].map(level => (
                <YStack key={level} w={16} h={16} br={4} bg={getIntensityColor(level)} />
              ))}
            </XStack>
            <Text fontSize={11} fontFamily="Nunito_600SemiBold" color={isDark ? '#a3a3a3' : '#64748b'}>More</Text>
          </XStack>
        </YStack>
      </Pressable>
    )
  }

  // Expanded Month View
  return (
    <Animated.View entering={FadeIn}>
      <YStack
        bg={isDark ? '#18181B' : '#FFFFFF'}
        br={16}
        p="$4"
        borderWidth={1}
        borderColor={isDark ? '#27272A' : '#E4E4E7'}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {/* Header */}
        <XStack ai="center" jc="space-between" mb="$3">
          <YStack>
            <Text fontSize={18} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#0f172a'}>🔥 Activity Streak</Text>
          </YStack>
          <Pressable onPress={toggleExpanded}>
            <Circle size={30} bg={isDark ? '#27272A' : '#F4F4F5'}>
              <Ionicons name="close" size={18} color={isDark ? '#ffffff' : '#0f172a'} />
            </Circle>
          </Pressable>
        </XStack>

        {/* Stats */}
        <XStack gap="$3" mb="$4">
          <YStack f={1} bg={isDark ? '#065f4620' : '#d1fae5'} p="$3" br={12} borderWidth={1} borderColor={isDark ? '#065f46' : '#a7f3d0'}>
            <Text fontSize={11} color="#10b981" fontFamily="Nunito_700Bold">CURRENT</Text>
            <XStack ai="flex-end" gap="$1">
              <Text fontSize={26} fontFamily="Nunito_900Black" color="#10b981">{currentStreak}</Text>
              <Text fontSize={12} fontFamily="Nunito_600SemiBold" color="#10b981" mb="$1">days</Text>
            </XStack>
          </YStack>
          <YStack f={1} bg={isDark ? '#7c3aed20' : '#ede9fe'} p="$3" br={12} borderWidth={1} borderColor={isDark ? '#7c3aed' : '#c4b5fd'}>
            <Text fontSize={11} color="#8B5CF6" fontFamily="Nunito_700Bold">LONGEST</Text>
            <XStack ai="flex-end" gap="$1">
              <Text fontSize={26} fontFamily="Nunito_900Black" color="#8B5CF6">{longestStreak}</Text>
              <Text fontSize={12} fontFamily="Nunito_600SemiBold" color="#8B5CF6" mb="$1">days</Text>
            </XStack>
          </YStack>
        </XStack>

        {/* Month Navigation */}
        <XStack ai="center" jc="space-between" mb="$3">
          <Pressable onPress={() => changeMonth('prev')}>
            <Circle size={34} bg={isDark ? '#27272A' : '#F4F4F5'}>
              <Ionicons name="chevron-back" size={18} color={isDark ? '#ffffff' : '#0f172a'} />
            </Circle>
          </Pressable>
          <Text fontSize={16} fontFamily="Nunito_800ExtraBold" color={isDark ? '#ffffff' : '#0f172a'}>{monthName}</Text>
          <Pressable onPress={() => changeMonth('next')}>
            <Circle size={34} bg={isDark ? '#27272A' : '#F4F4F5'}>
              <Ionicons name="chevron-forward" size={18} color={isDark ? '#ffffff' : '#0f172a'} />
            </Circle>
          </Pressable>
        </XStack>

        {/* Day Labels */}
        <XStack jc="space-around" mb="$2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <YStack key={idx} w={34} ai="center">
              <Text fontSize={11} fontFamily="Nunito_700Bold" color={isDark ? '#a3a3a3' : '#64748b'}>{day}</Text>
            </YStack>
          ))}
        </XStack>

        {/* Calendar Grid */}
        <YStack gap="$1.5">
          {weeks.map((week, weekIdx) => (
            <XStack key={weekIdx} jc="space-around">
              {week.map((day, dayIdx) => (
                <YStack key={dayIdx} w={34} h={34} ai="center" jc="center">
                  {day ? (
                    <Pressable
                      onPress={async () => {
                        await Haptics.selectionAsync()
                      }}
                    >
                      <YStack
                        w={30}
                        h={30}
                        br={7}
                        ai="center"
                        jc="center"
                        bg={getIntensityColor(day.count)}
                        style={day.count > 0 ? {
                          shadowColor: '#10b981',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.3,
                          shadowRadius: 3,
                        } : {}}
                      >
                        <Text
                          fontSize={11}
                          fontFamily="Nunito_700Bold"
                          color={day.count > 0 ? '#fff' : (isDark ? '#71717a' : '#a1a1aa')}
                        >
                          {day.day}
                        </Text>
                      </YStack>
                    </Pressable>
                  ) : (
                    <YStack w={30} h={30} />
                  )}
                </YStack>
              ))}
            </XStack>
          ))}
        </YStack>

        {/* Legend */}
        <XStack ai="center" jc="space-between" mt="$3" pt="$3" borderTopWidth={1} borderTopColor={isDark ? '#27272A' : '#E4E4E7'}>
          <Text fontSize={11} fontFamily="Nunito_600SemiBold" color={isDark ? '#a3a3a3' : '#64748b'}>Less</Text>
          <XStack gap="$1.5">
            {[0, 1, 2, 3, 4].map(level => (
              <YStack key={level} w={18} h={18} br={5} bg={getIntensityColor(level)} />
            ))}
          </XStack>
          <Text fontSize={11} fontFamily="Nunito_600SemiBold" color={isDark ? '#a3a3a3' : '#64748b'}>More</Text>
        </XStack>
      </YStack>
    </Animated.View>
  )
}
