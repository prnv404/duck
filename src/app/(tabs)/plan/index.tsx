import { YStack, XStack, Text, Circle, Separator } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import { ScrollView, Pressable, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type PlanType = 'super' | 'max'
type BillingCycle = 'monthly' | 'yearly'

export default function PlanScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly')
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('max')

  // Animations
  const shimmer = useSharedValue(0)
  const pulse = useSharedValue(1)

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    )
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    )
  }, [])

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + shimmer.value * 0.4
  }))

  const plans = {
    super: {
      name: 'Super',
      icon: 'rocket',
      color: '#3b82f6',
      gradient: ['#60a5fa', '#2563eb'] as [string, string],
      monthlyPrice: 299,
      yearlyPrice: 2499,
      yearlyMonthly: 208,
      savePercent: 30,
      popular: false,
      features: [
        { text: 'Ad-free learning', included: true },
        { text: 'Unlimited hearts', included: true },
        { text: 'Streak repair (1/month)', included: true },
        { text: 'Progress insights', included: true },
        { text: 'Offline mode', included: true },
        { text: 'Priority support', included: false },
        { text: 'Detailed explanations', included: false },
        { text: 'Mock test access', included: false },
      ]
    },
    max: {
      name: 'Max',
      icon: 'diamond',
      color: '#8b5cf6',
      gradient: ['#a78bfa', '#7c3aed'] as [string, string],
      monthlyPrice: 599,
      yearlyPrice: 4999,
      yearlyMonthly: 417,
      savePercent: 30,
      popular: true,
      features: [
        { text: 'Ad-free learning', included: true },
        { text: 'Unlimited hearts', included: true },
        { text: 'Unlimited streak repair', included: true },
        { text: 'Progress insights', included: true },
        { text: 'Offline mode', included: true },
        { text: 'Priority support', included: true },
        { text: 'Detailed explanations', included: true },
        { text: 'Full mock test access', included: true },
      ]
    }
  }

  const currentPlan = plans[selectedPlan]
  const price = billingCycle === 'monthly' ? currentPlan.monthlyPrice : currentPlan.yearlyPrice
  const monthlyEquivalent = billingCycle === 'yearly' ? currentPlan.yearlyMonthly : currentPlan.monthlyPrice

  const onSubscribe = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  const PlanTab = ({ plan, isSelected }: { plan: PlanType; isSelected: boolean }) => {
    const p = plans[plan]
    return (
      <Pressable 
        onPress={() => { setSelectedPlan(plan); Haptics.selectionAsync() }}
        style={{ flex: 1 }}
      >
        <YStack
          p="$3"
          br={16}
          ai="center"
          gap="$1"
          bg={isSelected ? (isDark ? '$gray2' : '#fff') : 'transparent'}
          style={isSelected ? {
            borderWidth: 2,
            borderColor: p.color,
            shadowColor: p.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
          } : { borderWidth: 2, borderColor: 'transparent' }}
        >
          {p.popular && isSelected && (
            <YStack position="absolute" top={-10} bg={p.color} px="$2" py={2} br={6}>
              <Text fontSize={9} fontWeight="800" color="#fff">BEST VALUE</Text>
            </YStack>
          )}
          <YStack
            w={40}
            h={40}
            br={12}
            ai="center"
            jc="center"
            overflow="hidden"
          >
            <LinearGradient
              colors={isSelected ? p.gradient : [isDark ? '#374151' : '#d1d5db', isDark ? '#1f2937' : '#9ca3af']}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            />
            <Ionicons name={p.icon as any} size={20} color="#fff" />
          </YStack>
          <Text fontSize={15} fontWeight="800" color={isSelected ? p.color : '$gray10'}>
            {p.name}
          </Text>
        </YStack>
      </Pressable>
    )
  }

  return (
    <YStack f={1} bg="$background">
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Header */}
        <YStack pt={insets.top + 16} px="$4">
          <Animated.View entering={FadeIn.delay(50)}>
            <YStack ai="center" gap="$2" mb="$5">
              <YStack
                w={72}
                h={72}
                br={24}
                ai="center"
                jc="center"
                overflow="hidden"
                mb="$2"
              >
                <LinearGradient
                  colors={currentPlan.gradient}
                  style={{ position: 'absolute', width: '100%', height: '100%' }}
                />
                <Ionicons name={currentPlan.icon as any} size={36} color="#fff" />
              </YStack>
              <Text fontSize={28} fontWeight="900" textAlign="center">
                Upgrade to Premium
              </Text>
              <Text fontSize={15} color="$gray10" textAlign="center" px="$4">
                Unlock all features and ace your PSC exams
              </Text>
            </YStack>
          </Animated.View>

          {/* Plan Selector */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <XStack gap="$3" mb="$4">
              <PlanTab plan="super" isSelected={selectedPlan === 'super'} />
              <PlanTab plan="max" isSelected={selectedPlan === 'max'} />
            </XStack>
          </Animated.View>

          {/* Billing Toggle */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <XStack
              bg="$gray3"
              p="$1"
              br={14}
              mb="$4"
            >
              <Pressable 
                onPress={() => { setBillingCycle('monthly'); Haptics.selectionAsync() }}
                style={{ flex: 1 }}
              >
                <YStack
                  py="$2"
                  br={10}
                  ai="center"
                  bg={billingCycle === 'monthly' ? (isDark ? '$gray1' : '#fff') : 'transparent'}
                >
                  <Text
                    fontSize={14}
                    fontWeight={billingCycle === 'monthly' ? '700' : '500'}
                    color={billingCycle === 'monthly' ? '$gray12' : '$gray10'}
                  >
                    Monthly
                  </Text>
                </YStack>
              </Pressable>
              <Pressable 
                onPress={() => { setBillingCycle('yearly'); Haptics.selectionAsync() }}
                style={{ flex: 1 }}
              >
                <YStack
                  py="$2"
                  br={10}
                  ai="center"
                  bg={billingCycle === 'yearly' ? (isDark ? '$gray1' : '#fff') : 'transparent'}
                >
                  <XStack ai="center" gap="$2">
                    <Text
                      fontSize={14}
                      fontWeight={billingCycle === 'yearly' ? '700' : '500'}
                      color={billingCycle === 'yearly' ? '$gray12' : '$gray10'}
                    >
                      Yearly
                    </Text>
                    <YStack bg="$green9" px="$1" py={1} br={4}>
                      <Text fontSize={9} fontWeight="800" color="#fff">-{currentPlan.savePercent}%</Text>
                    </YStack>
                  </XStack>
                </YStack>
              </Pressable>
            </XStack>
          </Animated.View>

          {/* Price Card */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <YStack
              br={24}
              overflow="hidden"
              mb="$4"
              style={{
                borderWidth: 2,
                borderColor: currentPlan.color,
                shadowColor: currentPlan.color,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
              }}
            >
              <LinearGradient
                colors={[`${currentPlan.color}15`, isDark ? '#111' : '#fff']}
                style={{ padding: 24 }}
              >
                <YStack ai="center" gap="$3">
                  <XStack ai="flex-end" gap="$1">
                    <Text fontSize={20} fontWeight="700" color="$gray10">₹</Text>
                    <Text fontSize={56} fontWeight="900" lineHeight={56}>
                      {monthlyEquivalent}
                    </Text>
                    <Text fontSize={16} color="$gray10" mb="$2">/month</Text>
                  </XStack>

                  {billingCycle === 'yearly' && (
                    <YStack ai="center" gap="$2">
                      <XStack ai="center" gap="$2">
                        <Text fontSize={14} color="$gray10" textDecorationLine="line-through">
                          ₹{currentPlan.monthlyPrice * 12}
                        </Text>
                        <Text fontSize={16} fontWeight="700">
                          ₹{price}/year
                        </Text>
                      </XStack>
                      <YStack bg="$green9" px="$3" py="$1" br={8}>
                        <Text fontSize={12} fontWeight="800" color="#fff">
                          You save ₹{(currentPlan.monthlyPrice * 12) - price}/year
                        </Text>
                      </YStack>
                    </YStack>
                  )}
                </YStack>
              </LinearGradient>
            </YStack>
          </Animated.View>

          {/* Features List */}
          <Animated.View entering={FadeInDown.delay(250)}>
            <YStack
              bg={isDark ? '$gray2' : '#fff'}
              br={20}
              p="$4"
              mb="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
              }}
            >
              <Text fontSize={16} fontWeight="800" mb="$3">What's included</Text>
              <YStack gap="$3">
                {currentPlan.features.map((feature, idx) => (
                  <XStack key={idx} ai="center" gap="$3">
                    <Circle
                      size={28}
                      bg={feature.included ? `${currentPlan.color}20` : '$gray4'}
                    >
                      <Ionicons
                        name={feature.included ? 'checkmark' : 'close'}
                        size={16}
                        color={feature.included ? currentPlan.color : isDark ? '#6b7280' : '#9ca3af'}
                      />
                    </Circle>
                    <Text
                      fontSize={14}
                      fontWeight="500"
                      color={feature.included ? '$gray12' : '$gray9'}
                      style={!feature.included ? { textDecorationLine: 'line-through' } : {}}
                    >
                      {feature.text}
                    </Text>
                  </XStack>
                ))}
              </YStack>

              {/* Subscribe Button */}
              <Pressable onPress={onSubscribe} style={{ marginTop: 20 }}>
                <YStack
                  h={56}
                  br={16}
                  ai="center"
                  jc="center"
                  overflow="hidden"
                  style={{
                    shadowColor: currentPlan.color,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                  }}
                >
                  <LinearGradient
                    colors={currentPlan.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                  />
                  <XStack ai="center" gap="$2">
                    <Ionicons name={currentPlan.icon as any} size={20} color="#fff" />
                    <Text fontSize={17} fontWeight="800" color="#fff">
                      Start 7-Day Free Trial
                    </Text>
                  </XStack>
                </YStack>
              </Pressable>
              <Text fontSize={11} color="$gray9" textAlign="center" mt="$2">
                Then ₹{price}/{billingCycle === 'monthly' ? 'month' : 'year'} • Cancel anytime
              </Text>
            </YStack>
          </Animated.View>

          {/* Trust Badges */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <YStack gap="$3" mb="$4">
              <Text fontSize={13} fontWeight="700" color="$gray10" textAlign="center">
                TRUSTED BY 50,000+ ASPIRANTS
              </Text>

              <XStack jc="space-around">
                {[
                  { icon: 'shield-checkmark', label: 'Secure\nPayment' },
                  { icon: 'refresh', label: 'Cancel\nAnytime' },
                  { icon: 'lock-closed', label: '256-bit\nEncryption' },
                ].map((badge, idx) => (
                  <YStack key={idx} ai="center" gap="$2">
                    <YStack
                      w={48}
                      h={48}
                      br={14}
                      ai="center"
                      jc="center"
                      bg="$gray3"
                    >
                      <Ionicons name={badge.icon as any} size={22} color="#22c55e" />
                    </YStack>
                    <Text fontSize={10} fontWeight="600" color="$gray10" textAlign="center">
                      {badge.label}
                    </Text>
                  </YStack>
                ))}
              </XStack>

              {/* Payment Methods */}
              <XStack jc="center" ai="center" gap="$3" mt="$2">
                <YStack bg="$gray3" px="$3" py="$2" br={8}>
                  <Text fontSize={11} fontWeight="700">UPI</Text>
                </YStack>
                <YStack bg="$gray3" px="$3" py="$2" br={8}>
                  <Text fontSize={11} fontWeight="700">Cards</Text>
                </YStack>
                <YStack bg="$gray3" px="$3" py="$2" br={8}>
                  <Text fontSize={11} fontWeight="700">Net Banking</Text>
                </YStack>
                <YStack bg="$gray3" px="$3" py="$2" br={8}>
                  <Text fontSize={11} fontWeight="700">Wallets</Text>
                </YStack>
              </XStack>
            </YStack>
          </Animated.View>

          {/* Testimonial */}
          <Animated.View entering={FadeInDown.delay(350)}>
            <YStack
              bg={isDark ? '$gray2' : '#fff'}
              br={20}
              p="$4"
              mb="$4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
              }}
            >
              <XStack gap="$3">
                <YStack
                  w={48}
                  h={48}
                  br={24}
                  ai="center"
                  jc="center"
                  bg="$purple3"
                >
                  <Text fontSize={24}>👩‍🎓</Text>
                </YStack>
                <YStack f={1} gap="$1">
                  <XStack ai="center" gap="$1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Ionicons key={i} name="star" size={12} color="#fbbf24" />
                    ))}
                  </XStack>
                  <Text fontSize={13} color="$gray11" fontStyle="italic">
                    "Max helped me crack Kerala PSC LDC exam. The mock tests and explanations were exactly what I needed!"
                  </Text>
                  <Text fontSize={12} fontWeight="700" color="$gray10">
                    — Anjali, LDC 2024
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Animated.View>

          {/* Money Back Guarantee */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <XStack
              ai="center"
              gap="$3"
              bg="$green3"
              p="$3"
              br={16}
              mb="$4"
              style={{ borderWidth: 1, borderColor: isDark ? '#166534' : '#86efac' }}
            >
              <Circle size={44} bg="$green9">
                <Ionicons name="ribbon" size={22} color="#fff" />
              </Circle>
              <YStack f={1}>
                <Text fontSize={14} fontWeight="800" color="$green11">
                  7-Day Money Back Guarantee
                </Text>
                <Text fontSize={12} color="$green10">
                  Not satisfied? Get a full refund, no questions asked.
                </Text>
              </YStack>
            </XStack>
          </Animated.View>

          {/* FAQ Preview */}
          <Animated.View entering={FadeInDown.delay(450)}>
            <YStack
              bg={isDark ? '$gray2' : '#fff'}
              br={20}
              p="$4"
              mb="$6"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
              }}
            >
              <Text fontSize={16} fontWeight="800" mb="$3">Common Questions</Text>
              
              {[
                { q: 'Can I cancel anytime?', a: 'Yes! Cancel with one tap. No hidden fees.' },
                { q: 'Will I lose my progress?', a: 'Never. Your progress is always saved.' },
                { q: 'How do refunds work?', a: 'Full refund within 7 days, automatically processed.' },
              ].map((faq, idx) => (
                <YStack key={idx}>
                  {idx > 0 && <Separator bg="$gray4" my="$3" />}
                  <YStack gap="$1">
                    <Text fontSize={14} fontWeight="700">{faq.q}</Text>
                    <Text fontSize={13} color="$gray10">{faq.a}</Text>
                  </YStack>
                </YStack>
              ))}
            </YStack>
          </Animated.View>
        </YStack>
      </ScrollView>
    </YStack>
  )
}