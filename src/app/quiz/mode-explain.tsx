import React, { useState } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share, Pressable, Linking } from 'react-native';
import { YStack, XStack, Text, Image } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

type Mode = 'adaptive' | 'balanced' | 'weak_area' | 'hard_core' | 'subject_focus';

const MODE_DETAILS: Record<
  Mode,
  { label: string; color: string; description: string; icon: any }
> = {
  adaptive: {
    label: 'Adaptive Mode',
    color: '#059669',
    description: 'Questions adapt to your skill level',
    icon: require('../../../assets/images/modes/brain.png'),
  },
  balanced: {
    label: 'Balanced Mode',
    color: '#7c3aed',
    description: 'Perfect mix of easy, medium, and hard questions',
    icon: require('../../../assets/images/modes/libra.png'),
  },
  weak_area: {
    label: 'Weak Spots',
    color: '#d97706',
    description: 'Focus on topics where you need improvement',
    icon: require('../../../assets/images/modes/weakness.png'),
  },
  hard_core: {
    label: 'Hardcore Mode',
    color: '#dc2626',
    description: 'Challenge yourself with the toughest questions',
    icon: require('../../../assets/images/modes/sign.png'),
  },
  subject_focus: {
    label: 'Subject Focus',
    color: '#0891b2',
    description: 'Master one subject at a time',
    icon: require('../../../assets/images/modes/brain.png'),
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
    description: subjectName ? `Deep dive into ${subjectName}` : baseDetails.description,
  };

  const [isSharing, setIsSharing] = useState(false);

  const bgColor = isDark ? '#0a0a0a' : '#f8fafc';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';

  const handleShare = async () => {
    try {
      await Haptics.selectionAsync();
      setIsSharing(true);
      const message =
        '🦆 Join me on DUCK - A completely FREE app to ace PSC exams! Smart practice made easy.';

      await Share.share({ message, title: 'Join DUCK' });
      setTimeout(async () => {
        setIsSharing(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 500);
    } catch (e) {
      setIsSharing(false);
    }
  };

  const handleInstagramPress = async () => {
    await Haptics.selectionAsync();
    const instagramUrl = 'https://www.instagram.com/i.pranvv/';
    try {
      await Linking.openURL(instagramUrl);
    } catch (error) {
      console.error('Failed to open Instagram:', error);
    }
  };

  const handleStartQuiz = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/quiz?mode=${mode}` as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)}>
        <YStack px="$4" pt="$3" pb="$4">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={textColor} />
          </Pressable>
        </YStack>
      </Animated.View>

      <YStack f={1} px="$5" pb="$5" jc="space-between">
        {/* Content */}
        <YStack f={1} jc="center" ai="center" gap="$4" mt={-60}>
          {/* Icon */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <YStack width={100} height={100} ai="center" jc="center">
              <Image
                source={details.icon}
                width={100}
                height={100}
                resizeMode="contain"
              />
            </YStack>
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <YStack ai="center" gap="$2">
              <Text
                fontFamily="Nunito_900Black"
                fontSize={32}
                color={textColor}
                textAlign="center"
                letterSpacing={-0.5}
              >
                {details.label}
              </Text>

              {subjectName && mode === 'subject_focus' && (
                <Text fontFamily="Nunito_800ExtraBold" fontSize={16} color={details.color}>
                  {subjectName}
                </Text>
              )}
            </YStack>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text
              fontFamily="Nunito_600SemiBold"
              fontSize={15}
              color={textSecondary}
              textAlign="center"
              lineHeight={22}
              maxWidth={300}
            >
              {details.description}
            </Text>
          </Animated.View>

          {/* Mission */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <Text
              fontFamily="Nunito_600SemiBold"
              fontSize={13}
              color={textSecondary}
              textAlign="center"
              lineHeight={20}
              maxWidth={280}
              opacity={0.7}
            >
              We’re here to make boring exam prep fun and enjoyable.            </Text>
          </Animated.View>
        </YStack>

        {/* Bottom Actions */}
        <YStack gap="$4" ai="center">
          {/* Start Button - Main CTA */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Pressable
              onPress={handleStartQuiz}
              style={({ pressed }) => ({
                width: 280,
                height: 58,
                borderRadius: 16,
                backgroundColor: details.color,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <MaterialCommunityIcons name="play-circle" size={24} color="white" />
              <Text fontFamily="Nunito_900Black" fontSize={18} color="white">
                Start Quiz
              </Text>
            </Pressable>
          </Animated.View>

          {/* Instagram - Aesthetic, minimal */}
          <Animated.View entering={FadeInDown.delay(350).springify()}>
            <Pressable
              onPress={handleInstagramPress}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 0.85,
              })}
            >
              <XStack ai="center" gap="$2.5">
                <YStack width={22} height={22} overflow="hidden">
                  <Image
                    source={require('../../../assets/images/instagram.png')}
                    width={22}
                    height={22}
                    style={{ opacity: 0.9 }}
                  />
                </YStack>
                <Text
                  fontFamily="Nunito_600SemiBold"
                  fontSize={13.5}
                  color={textSecondary}
                  style={{ opacity: 0.85 }}
                >
                  Got any feedback? connect me on Insta
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color={textSecondary} />
              </XStack>
            </Pressable>
          </Animated.View>

          {/* Share - Better attention */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Pressable
              onPress={handleShare}
              disabled={isSharing}
              style={({ pressed }) => ({
                opacity: pressed || isSharing ? 0.5 : 0.75,
                marginTop: -2,
              })}
            >
              <XStack ai="center" gap="$2">
                <MaterialCommunityIcons name="share-variant" size={16} color={textSecondary} />
                <Text fontFamily="Nunito_600SemiBold" fontSize={12.5} color={textSecondary}>
                  {isSharing ? 'Sharing...' : 'Share Duck with friends'}
                </Text>
              </XStack>
            </Pressable>
          </Animated.View>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
