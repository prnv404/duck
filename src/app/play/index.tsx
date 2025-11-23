import { YStack, XStack, H2, Paragraph, Text, Circle, Input } from 'tamagui'
import * as Haptics from 'expo-haptics'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useState } from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import GameButton from '@/components/ui/GameButton'
import GlassCard from '@/components/ui/GlassCard'

export default function PlayScreen() {
  const insets = useSafeAreaInsets()
  const [roomCode, setRoomCode] = useState('')
  const [createdCode, setCreatedCode] = useState<string | null>(null)

  const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()

  const onCreate = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    const code = genCode()
    setCreatedCode(code)
  }

  const onJoin = async () => {
    await Haptics.selectionAsync()
    // TODO: connect to backend, join by code
  }

  const onQuickMatch = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    // TODO: matchmaking stub
  }

  

  return (
    <YStack f={1} bg="$background">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
        <YStack f={1} p="$5" pt={insets.top + 20} gap="$5">
          <YStack gap="$2">
            <H2 size="$10" fontWeight="800">Play</H2>
            <Paragraph size="$5" theme="alt2" opacity={0.8}>Invite friends or find opponents for a multiplayer quiz.</Paragraph>
          </YStack>

          <Animated.View entering={FadeInDown.delay(60)}>
            <GlassCard p="$5">
              <YStack gap="$3">
                <XStack ai="center" gap="$3">
                  <Circle size={44} backgroundColor="$orange9">
                    <Ionicons name="sparkles" size={20} color="#fff" />
                  </Circle>
                  <YStack>
                    <Text fontSize={16} fontWeight="800">Create Room</Text>
                    <Text fontSize={13} opacity={0.7}>Generate a code and share</Text>
                  </YStack>
                </XStack>
                <GameButton bg="$orange9" onPress={onCreate}>
                  <XStack ai="center" gap="$2">
                    <Ionicons name="add" size={18} color="#fff" />
                    <Text color="#fff" fontSize={16} fontWeight="700">Create</Text>
                  </XStack>
                </GameButton>
                {createdCode && (
                  <XStack ai="center" gap="$2">
                    <Text fontSize={14} opacity={0.7}>Room Code:</Text>
                    <Text fontSize={18} fontWeight="800">{createdCode}</Text>
                  </XStack>
                )}
              </YStack>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120)}>
            <GlassCard p="$5">
              <YStack gap="$3">
                <XStack ai="center" gap="$3">
                  <Circle size={44} backgroundColor="$blue9">
                    <Ionicons name="link" size={20} color="#fff" />
                  </Circle>
                  <YStack>
                    <Text fontSize={16} fontWeight="800">Join Room</Text>
                    <Text fontSize={13} opacity={0.7}>Enter a code to join</Text>
                  </YStack>
                </XStack>
                <Input value={roomCode} onChangeText={setRoomCode as any} placeholder="Enter code" autoCapitalize="characters" maxLength={6} />
                <GameButton bg="$blue9" onPress={onJoin} disabled={roomCode.length < 4}>
                  <XStack ai="center" gap="$2">
                    <Ionicons name="log-in" size={18} color="#fff" />
                    <Text color="#fff" fontSize={16} fontWeight="700">Join</Text>
                  </XStack>
                </GameButton>
              </YStack>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180)}>
            <GlassCard p="$5">
              <YStack gap="$3">
                <XStack ai="center" gap="$3">
                  <Circle size={44} backgroundColor="$green9">
                    <Ionicons name="flash" size={20} color="#fff" />
                  </Circle>
                  <YStack>
                    <Text fontSize={16} fontWeight="800">Quick Match</Text>
                    <Text fontSize={13} opacity={0.7}>Find an opponent automatically</Text>
                  </YStack>
                </XStack>
                <GameButton bg="$green9" onPress={onQuickMatch}>
                  <XStack ai="center" gap="$2">
                    <Ionicons name="play" size={18} color="#fff" />
                    <Text color="#fff" fontSize={16} fontWeight="700">Start Matchmaking</Text>
                  </XStack>
                </GameButton>
              </YStack>
            </GlassCard>
          </Animated.View>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
