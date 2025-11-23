import { YStack, XStack, Card, Text, Circle, Progress } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import { ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut, useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'
import { useWindowDimensions } from 'react-native'
import GameButton from '@/components/ui/GameButton'
import GlassCard from '@/components/ui/GlassCard'
import { LinearGradient } from 'expo-linear-gradient'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function ModalScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const params = useLocalSearchParams()
  const isDark = useColorScheme() === 'dark'
  const countParam = Array.isArray(params.count) ? params.count[0] : (params.count as string | undefined)
  const count = Math.min(15, Math.max(10, Number(countParam) || 10))

  const questionPool = useMemo(
    () => [
      { q: 'Union Budget is presented by which ministry?', options: ['Finance', 'Home', 'External Affairs', 'Defence'], a: 0 },
      { q: 'Largest state by area in India?', options: ['Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh'], a: 0 },
      { q: 'Current RBI Governor (sample)?', options: ['Raghuram Rajan', 'Shaktikanta Das', 'Urjit Patel', 'D. Subbarao'], a: 1 },
      { q: 'Lok Sabha members term?', options: ['4 years', '5 years', '6 years', '7 years'], a: 1 },
      { q: 'Article 370 pertained to?', options: ['Goa', 'Nagaland', 'Jammu & Kashmir', 'Sikkim'], a: 2 },
      { q: 'Planning Commission successor?', options: ['NITI Aayog', 'CAG', 'ECI', 'SEBI'], a: 0 },
      { q: 'G20 presidency year for India (sample)?', options: ['2020', '2021', '2022', '2023'], a: 3 },
      { q: 'ISI unit of force?', options: ['Joule', 'Newton', 'Pascal', 'Watt'], a: 1 },
      { q: 'Kharif crop example?', options: ['Wheat', 'Mustard', 'Rice', 'Gram'], a: 2 },
      { q: 'GDP stands for?', options: ['Gross Domestic Product', 'General Domestic Product', 'Global Domestic Product', 'Gross Demand Product'], a: 0 },
      { q: 'Capital of Telangana?', options: ['Amaravati', 'Hyderabad', 'Vijayawada', 'Warangal'], a: 1 },
      { q: 'Repo rate decided by?', options: ['SEBI', 'RBI', 'NABARD', 'IRDAI'], a: 1 },
      { q: 'Largest river in India by volume?', options: ['Yamuna', 'Ganga', 'Brahmaputra', 'Godavari'], a: 2 },
      { q: 'National Science Day in India?', options: ['28 Feb', '15 Aug', '26 Jan', '5 Jun'], a: 0 },
      { q: 'Headquarters of ISRO?', options: ['Hyderabad', 'Bengaluru', 'Chennai', 'Thiruvananthapuram'], a: 1 },
    ],
    []
  )

  const questions = questionPool.slice(0, count)
  const totalTime = 300
  const [timeLeft, setTimeLeft] = useState(totalTime)
  const [hearts, setHearts] = useState(3)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (finished) return
    if (timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [timeLeft, finished])

  const q = questions[index]
  const progress = Math.round(((index) / questions.length) * 100)
  const timePct = Math.round((timeLeft / totalTime) * 100)

  const onCheck = async () => {
    if (selected === null || checked) return
    const isCorrect = selected === q.a
    setChecked(true)
    setCorrect(isCorrect)
    await Haptics.impactAsync(isCorrect ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light)
    if (isCorrect) setScore((s) => s + 1)
    else {
      setHearts((h) => {
        const next = Math.max(0, h - 1)
        if (next === 0) setFinished(true)
        return next
      })
    }
  }

  const onNext = async () => {
    if (!checked) return
    await Haptics.selectionAsync()
    if (index < questions.length - 1) {
      setIndex((i) => i + 1)
      setSelected(null)
      setChecked(false)
      setCorrect(null)
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setFinished(true)
    }
  }

  const onClose = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  function ConfettiPiece({ x, endY, color, delay = 0 }: { x: number; endY: number; color: string; delay?: number }) {
    const y = useSharedValue(0)
    const r = useSharedValue(0)
    useEffect(() => {
      const timer = setTimeout(() => {
        y.value = withTiming(endY, { duration: 1400, easing: Easing.out(Easing.quad) })
        r.value = withTiming(360, { duration: 1400 })
      }, delay)
      return () => clearTimeout(timer)
    }, [delay])
    const style = useAnimatedStyle(() => ({
      position: 'absolute', left: x, transform: [{ translateY: y.value }, { rotate: `${r.value}deg` }], opacity: y.value < 60 ? 0 : 1,
    }))
    return <Animated.View style={style}><YStack w={6} h={10} br={2} backgroundColor={color} /></Animated.View>
  }

  function ConfettiBurst() {
    const { width, height } = useWindowDimensions()
    const pieces = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
      x: Math.random() * width,
      delay: Math.round(Math.random() * 250),
      color: ['#34d399', '#22c55e', '#f59e0b', '#60a5fa', '#f43f5e'][i % 5],
    })), [width])
    return (
      <Animated.View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {pieces.map((p, i) => (
          <ConfettiPiece key={i} x={p.x} endY={height * 1.05} color={p.color} delay={p.delay} />
        ))}
      </Animated.View>
    )
  }

  return (
    <YStack f={1} bg="$background">
      <LinearGradient
        colors={[isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220 }}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack f={1} p="$5" pt={insets.top + 20} gap="$5">
          <XStack ai="center" jc="space-between">
            <XStack ai="center" gap="$2">
              <Circle size={36} backgroundColor="$blue9">
                <Ionicons name="newspaper" size={18} color="#fff" />
              </Circle>
              <Text fontSize={17} fontWeight="800">Daily Challenge</Text>
            </XStack>
            <XStack ai="center" gap="$3">
              <XStack ai="center" gap="$1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Text key={i} fontSize={18}>{i < hearts ? '❤️' : '🤍'}</Text>
                ))}
              </XStack>
              <XStack ai="center" gap="$2">
                <Ionicons name="time-outline" size={16} color="#94a3b8" />
                <Text fontWeight="700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
              </XStack>
            </XStack>
          </XStack>

          {!finished && (
            <YStack gap="$2">
              <Progress value={progress} max={100} h={8} br="$4">
                <Progress.Indicator animation="bouncy" bc="$green9" />
              </Progress>
              <Progress value={timePct} max={100} h={6} br="$4">
                <Progress.Indicator animation="bouncy" bc="$blue9" />
              </Progress>
            </YStack>
          )}

          {!finished ? (
            <GlassCard p="$5">
              <YStack gap="$4">
                <Text fontSize={16} opacity={0.8}>Question {index + 1} of {questions.length}</Text>
                <Text fontSize={18} fontWeight="800">{q.q}</Text>

                <YStack gap="$3">
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i
                    const isRight = checked && i === q.a
                    const isWrong = checked && isSelected && i !== q.a
                    const borderColor = isRight ? '$green9' : isWrong ? '$red9' : isSelected ? '$green8' : '$borderColor'
                    const bg = isRight ? '$green3' : isWrong ? '$red3' : '$background'
                    return (
                      <Card
                        key={i}
                        bordered
                        p="$4"
                        br="$7"
                        backgroundColor={bg}
                        borderColor={borderColor}
                        pressStyle={{ scale: 0.98 }}
                        animation="bouncy"
                        onPress={checked ? undefined : async () => { setSelected(i); await Haptics.selectionAsync() }}
                      >
                        <XStack ai="center" jc="space-between">
                          <Text fontSize={15} fontWeight={isSelected ? '700' : '600'}>{opt}</Text>
                          {isRight && <Ionicons name="checkmark-circle" size={22} color="#10b981" />}
                          {isWrong && <Ionicons name="close-circle" size={22} color="#ef4444" />}
                        </XStack>
                      </Card>
                    )
                  })}
                </YStack>

                {!checked ? (
                  <GameButton size="$5" disabled={selected === null} opacity={selected === null ? 0.6 : 1} bg="$blue9" onPress={onCheck}>
                    <Text color="white" fontSize={16} fontWeight="700">Check</Text>
                  </GameButton>
                ) : (
                  <GameButton size="$5" bg={correct ? '$green9' : '$blue9'} onPress={onNext}>
                    <XStack ai="center" gap="$2">
                      <Ionicons name={correct ? 'checkmark' : 'arrow-forward'} size={18} color="#fff" />
                      <Text color="white" fontSize={16} fontWeight="700">{correct ? 'Great! Next' : 'Continue'}</Text>
                    </XStack>
                  </GameButton>
                )}
              </YStack>
            </GlassCard>
          ) : (
            <GlassCard p="$5">
              <YStack ai="center" gap="$4">
                <Text fontSize={22} fontWeight="800">Completed</Text>
                <XStack ai="center" gap="$3">
                  <Text fontSize={16}>Score</Text>
                  <Text fontSize={18} fontWeight="800">{score}/{questions.length}</Text>
                </XStack>
                <GameButton size="$5" bg="$green9" onPress={onClose}>
                  <Text color="white" fontSize={16} fontWeight="700">Close</Text>
                </GameButton>
              </YStack>
            </GlassCard>
          )}

          {finished && (
            <>
              <ConfettiBurst />
              <Animated.View entering={FadeIn} exiting={FadeOut} style={StyleSheet.absoluteFillObject} pointerEvents="none">
                <YStack f={1} ai="center" jc="center">
                  <Animated.View entering={ZoomIn.duration(450)} exiting={ZoomOut} style={{ alignItems: 'center' }}>
                    <Text fontSize={44}>🎉</Text>
                  </Animated.View>
                </YStack>
              </Animated.View>
            </>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  )
}
