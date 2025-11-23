import { YStack, XStack, Text } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import { Pressable, Dimensions, Alert } from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export type Skill = { 
  id: string
  title: string
  icon: any
  color: string
  progress: number
  totalLessons: number
  completedLessons: number
  crown: number
  locked?: boolean 
}

export type Unit = { 
  id: string
  title: string
  description: string
  skills: Skill[]
  color: string
  gradient: [string, string]
}

type LearningPathProps = {
  units: Unit[]
  onSkillPress: (skill: Skill) => void
}

// Curved Path Component
const CurvedPath = ({ fromX, toX, color }: { fromX: number; toX: number; color: string }) => {
  const centerX = SCREEN_WIDTH / 2
  const startX = centerX + fromX
  const endX = centerX + toX
  const height = 50
  const controlPointOffset = 30

  const path = `M ${startX} 0 
                C ${startX} ${controlPointOffset}, 
                  ${endX} ${height - controlPointOffset}, 
                  ${endX} ${height}`

  return (
    <Svg height={height} width={SCREEN_WIDTH} style={{ position: 'absolute', top: 0, left: -centerX }}>
      <Defs>
        <SvgGradient id={`pathGradient-${fromX}-${toX}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.3" />
          <Stop offset="1" stopColor={color} stopOpacity="0.6" />
        </SvgGradient>
      </Defs>
      <Path
        d={path}
        stroke={`url(#pathGradient-${fromX}-${toX})`}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  )
}

// Crown colors
const getCrownColor = (crown: number) => {
  if (crown === 0) return '#9ca3af'
  if (crown <= 2) return '#a78bfa'
  if (crown <= 4) return '#fbbf24'
  return '#22d3ee'
}

// Skill Node Component
const SkillNode = ({ 
  skill, 
  index, 
  isLast, 
  nextSkill,
  onPress 
}: { 
  skill: Skill
  index: number
  isLast: boolean
  nextSkill?: Skill
  onPress: (skill: Skill) => void
}) => {
  const isDark = useColorScheme() === 'dark'
  const nodeSize = 72
  const isActive = !skill.locked && skill.progress < 100

  const positions = [0, -60, 60, -60, 60, 0]
  const offsetX = positions[index % positions.length]
  const nextOffsetX = !isLast && nextSkill ? positions[(index + 1) % positions.length] : 0

  return (
    <YStack ai="center" style={{ marginLeft: offsetX, position: 'relative' }}>
      <Animated.View entering={FadeInDown.delay(100 + index * 80).springify()}>
        <Pressable onPress={() => onPress(skill)}>
          <YStack ai="center" gap="$2">
            <YStack w={nodeSize + 12} h={nodeSize + 12} ai="center" jc="center">
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

            {!skill.locked && (
              <Text fontSize={11} color="$gray10">
                {skill.completedLessons}/{skill.totalLessons} lessons
              </Text>
            )}
          </YStack>
        </Pressable>
      </Animated.View>

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

export default function LearningPath({ units, onSkillPress }: LearningPathProps) {
  return (
    <YStack gap="$6">
      {units.map((unit, unitIndex) => (
        <YStack key={unit.id}>
          <UnitHeader unit={unit} index={unitIndex} />
          
          <YStack ai="center" gap="$1">
            {unit.skills.map((skill, skillIndex) => (
              <SkillNode
                key={skill.id}
                skill={skill}
                index={skillIndex}
                isLast={skillIndex === unit.skills.length - 1}
                nextSkill={unit.skills[skillIndex + 1]}
                onPress={onSkillPress}
              />
            ))}
          </YStack>
        </YStack>
      ))}
    </YStack>
  )
}
