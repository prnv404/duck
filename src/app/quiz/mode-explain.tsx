import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share, ActivityIndicator, Pressable, Animated } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Mode = 'adaptive' | 'balanced' | 'weak_area' | 'hard_core' | 'subject_focus';

const MODE_DETAILS: Record<Mode, { label: string; color: string; icon: string; description: string }> = {
  adaptive: {
    label: 'Adaptive',
    color: '#10b981',
    icon: 'brain',
    description: 'Questions adapt to your level',
  },
  balanced: {
    label: 'Balanced',
    color: '#8B5CF6',
    icon: 'scale-balance',
    description: 'Mixed difficulty for well-rounded practice',
  },
  weak_area: {
    label: 'Weak Spots',
    color: '#F59E0B',
    icon: 'target',
    description: 'Focus on topics you struggle with',
  },
  hard_core: {
    label: 'Hardcore',
    color: '#EF4444',
    icon: 'fire',
    description: 'Only the toughest questions',
  },
  subject_focus: {
    label: 'Subject Focus',
    color: '#06B6D4',
    icon: 'bookmark-multiple',
    description: 'Deep dive into a single topic',
  },
};

export default function ModeExplainScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const rawMode = typeof params.mode === 'string' ? (params.mode as Mode) : 'balanced';
  const subjectName = typeof params.subjectName === 'string' ? params.subjectName : undefined;
  const mode = rawMode as Mode;

  const baseDetails = MODE_DETAILS[mode];
  const details = {
    ...baseDetails,
    description: subjectName ? `Deep dive into ${subjectName}` : baseDetails.description
  };

  const [isProcessingAd, setIsProcessingAd] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [referralsCount, setReferralsCount] = useState(0);

  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Theme colors
  const bgColor = isDark ? '#181818ff' : '#ffffff';
  const cardBg = isDark ? '#18181b' : '#f8fafc';
  const textColor = isDark ? '#f9fafb' : '#0f172a';
  const textSecondary = isDark ? '#9ca3af' : '#64748b';
  const borderColor = isDark ? '#4e4e51ff' : '#e2e8f0';

  const handleWatchAd = async () => {
    await Haptics.selectionAsync();
    setIsProcessingAd(true);
    setTimeout(async () => {
      setIsProcessingAd(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push(`/quiz?mode=${mode}` as any);
    }, 3000);
  };

  const handleShare = async () => {
    try {
      await Haptics.selectionAsync();
      setIsSharing(true);
      const message = 'Join on DUCK bro! Download now and level up your psc exams! Its completely free';

      await Share.share({ message, title: 'Join on DUCK' });
      setTimeout(async () => {
        const newCount = Math.min(referralsCount + 1, 3);
        setReferralsCount(newCount);
        setIsSharing(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (newCount === 3) {
          setTimeout(() => router.push(`/quiz?mode=${mode}` as any), 800);
        }
      }, 800);
    } catch (e) {
      setIsSharing(false);
      console.error('Share failed', e);
    }
  };

  const handleStartQuiz = async () => {
    await Haptics.selectionAsync();
    router.push(`/quiz?mode=${mode}` as any);
  };

  const isReferralComplete = referralsCount >= 3;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <YStack px="$5" pt="$3" pb="$2">
        <XStack ai="center" jc="space-between">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ([
              {
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: pressed ? (isDark ? '#27272a' : '#f1f5f9') : (isDark ? '#18181b' : '#f8fafc'),
                borderWidth: 1,
                borderColor: borderColor,
              }
            ])}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color={textColor} />
          </Pressable>

          <XStack width={40} />
        </XStack>
      </YStack>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <YStack f={1} px="$5" jc="space-between" pb="$5">

          {/* Content - Centered */}
          <YStack f={1} jc="center" gap="$4">

            {/* Icon */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
              <YStack
                w={110}
                h={110}
                br={28}
                ai="center"
                jc="center"
                bg={details.color}
                shadowColor={isDark ? '#000' : details.color}
                shadowOffset={{ width: 0, height: 10 }}
                shadowOpacity={isDark ? 0.5 : 0.25}
                shadowRadius={16}
                elevation={10}
              >
                <MaterialCommunityIcons name={details.icon as any} size={58} color="white" />
              </YStack>
            </Animated.View>

            {/* Mode Info */}
            <YStack gap="$3.5" ai="center" px="$4">
              <Text
                fontFamily="Nunito_900Black"
                fontSize={38}
                color={textColor}
                ta="center"
                lineHeight={42}
              >
                {details.label}
              </Text>

              {subjectName && mode === 'subject_focus' && (
                <YStack px="$4" py="$2" br={12} bg={details.color + '15'}>
                  <Text
                    fontFamily="Nunito_700Bold"
                    fontSize={15}
                    color={details.color}
                  >
                    {subjectName}
                  </Text>
                </YStack>
              )}

              <Text
                fontFamily="Nunito_500Medium"
                fontSize={16}
                color={textSecondary}
                ta="center"
                maxWidth={300}
                lineHeight={24}
              >
                {details.description}
              </Text>
            </YStack>

          </YStack>

          {/* Actions - Bottom */}
          <YStack gap="$3.5">

            {/* Refer Section */}
            <YStack gap="$3">
              {/* Info Text */}
              <YStack gap="$1.5" ai="center">
                <Text
                  fontFamily="Nunito_700Bold"
                  fontSize={15}
                  color={textColor}
                  ta="center"
                >
                  {isReferralComplete
                    ? 'sharing is caring'
                    : 'sharing is caring'
                  }
                </Text>
                <Text
                  fontFamily="Nunito_500Medium"
                  fontSize={13}
                  color={textSecondary}
                  ta="center"
                >
                  {isReferralComplete
                    ? 'share this amazing app with your friends let them be smart like you 😉'
                    : 'share this amazing app with your friends let them be smart like you 😉'
                  }
                </Text>
              </YStack>

              {/* Refer Button */}
              <Button
                size="$8"
                h={56}
                br={16}
                bg={isReferralComplete ? '#1bb910ff' : '#1c9f3dff'}
                color="white"
                fontFamily="Nunito_800ExtraBold"
                fontSize={17}
                fontWeight="bold"
                onPress={handleShare}
                disabled={isSharing || isReferralComplete}
                pressStyle={{ scale: 0.97, opacity: 0.9 }}
                opacity={isReferralComplete ? 0.8 : 1}
                icon={
                  isSharing ? undefined :
                    isReferralComplete ? <MaterialCommunityIcons name="check-circle" size={22} color="white" /> :
                      <MaterialCommunityIcons name="share-variant" size={22} color="white" />
                }
                // shadowColor={isReferralComplete ? '#10b981' : '#0ee9a4ff'}
                shadowOffset={{ width: 0, height: 6 }}
                shadowOpacity={0.3}
                shadowRadius={12}
                elevation={6}
              >
                {isSharing ? (
                  <XStack ai="center" gap="$2">
                    <ActivityIndicator color="white" size="small" />
                    <Text fontFamily="Nunito_700Bold" color="white" fontSize={16}>Sharing...</Text>
                  </XStack>
                ) : (
                  `Share with friends`
                )}
              </Button>

              {/* Progress Dots */}
              <XStack gap="$2.5" jc="center">
                {[0, 1, 2].map((step) => (
                  <YStack
                    key={step}
                    w={referralsCount > step ? 44 : 36}
                    h={6}
                    br={3}
                    bg={referralsCount > step ? (isReferralComplete ? '#10b981' : '#0ea5e9') : (isDark ? '#27272a' : '#e2e8f0')}
                  />
                ))}
              </XStack>
            </YStack>

            {/* Divider */}
            <XStack ai="center" gap="$3" my="$1">
              <YStack f={1} h={1} bg={borderColor} />
              <Text fontFamily="Nunito_600SemiBold" fontSize={12} color={textSecondary} letterSpacing={0.8}>
                &
              </Text>
              <YStack f={1} h={1} bg={borderColor} />
            </XStack>

            {/* Continue with Ads / Start Button */}
            {isReferralComplete ? (
              <Button
                size="$5"
                h={56}
                br={16}
                bg={details.color}
                color="white"
                fontFamily="Nunito_800ExtraBold"
                fontSize={17}
                onPress={handleStartQuiz}
                pressStyle={{ scale: 0.97, opacity: 0.9 }}
                icon={<MaterialCommunityIcons name="play" size={22} color="white" />}
                shadowColor={details.color}
                shadowOffset={{ width: 0, height: 6 }}
                shadowOpacity={0.3}
                shadowRadius={12}
                elevation={6}
              >
                Start Quiz
              </Button>
            ) : (
              <Pressable
                onPress={handleWatchAd}
                disabled={isProcessingAd}
                style={({ pressed }) => ([
                  {
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: isDark ? '#eef1f3ff' : '#0c0d0eff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    shadowColor: isDark ? '#fafafaff' : '#050606ff',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 4,
                    opacity: pressed || isProcessingAd ? 0.8 : 1,
                  }
                ])}
              >
                {isProcessingAd ? (
                  <XStack ai="center" gap="$2.5">
                    <ActivityIndicator color={isDark ? '#080808ff' : '#eef5f5ff'} />
                    <Text fontFamily="Nunito_600SemiBold" color={isDark ? '#111212ff' : '#d9e1e4ff'} fontSize={16}>
                      Loading ad...
                    </Text>
                  </XStack>
                ) : (
                  <XStack ai="center" gap="$2.5">
                    <MaterialCommunityIcons name="play-circle" size={26} color={isDark ? '#101111ff' : '#dce1e2ff'} />
                    <Text fontFamily="Nunito_800ExtraBold" color={isDark ? '#141616ff' : '#cbd6daff'} fontSize={17}>
                      Start Quiz
                    </Text>
                  </XStack>
                )}
              </Pressable>
            )}

          </YStack>
        </YStack>
      </Animated.View>
    </SafeAreaView>
  );
}