import { useColorScheme } from '@/hooks/use-color-scheme';
import { useQuizState } from '@/hooks/useQuizState';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';
import {
    FeedbackSection,
    OptionsGrid,
    QuestionCard,
    QuizFooter,
    QuizHeader,
    ResultMessage
} from '@/components/quiz';

// Mock Data for Quiz
const QUESTIONS = [
    {
        "id": 1,
        "question": "കേരളത്തിലെ വിദ്യാഭ്യാസ പുരോഗതിയിൽ 19-ാം നൂറ്റാണ്ടിൽ നിർണായക പങ്കുവഹിച്ച സാമൂഹ്യ പരിഷ്കർത്താവ് ആരായിരുന്നു?",
        "options": [
            "ശ്രീനാരായണ ഗുരു: ജാതിവ്യവസ്ഥയുടെ ചങ്ങലകൾ പൊളിച്ച് 'ഒരു ജാതി, ഒരു മതം, ഒരു ദൈവം മനുഷ്യനു' എന്ന സന്ദേശം പ്രചരിപ്പിച്ച് കേരളത്തിന്റെ സാമൂഹ്യ-വിദ്യാഭ്യാസ രംഗത്ത് വലിയ മാറ്റങ്ങൾക്ക് നേതൃത്വം നൽകിയ മഹാനായ ദാർശനികനും സാമൂഹ്യ നവോത്ഥാന നേതാവുമാണ്.",
            "ചട്ടമ്പി സ്വാമികൾ: സാമൂഹ്യ അനീതികളെ തുറന്നടിച്ച്, മലയാള ഭാഷാശാസ്ത്രത്തിൽ നിർണായക ഗ്രന്ഥങ്ങൾ രചിച്ച് കേരളത്തിലെ മത-തത്വചിന്താപരവും വിദ്യാഭ്യാസപരവുമായ പുതുവായു സൃഷ്ടിച്ച പ്രമുഖ വ്യക്തിത്വമാണ്.",
            "അയ്യങ്കാളി: ദളിത് സമൂഹത്തിന്റെ വിദ്യാഭ്യാസാവകാശത്തിന് വേണ്ടി പോരാടുകയും, അവർക്കായി ആദ്യത്തെ പള്ളിക്കൂടം സ്ഥാപിക്കുകയും ചെയ്ത പ്രധാന സാമൂഹിക വിപ്ലവകാരിയാണ്.",
            "വാക്കം മുഹമ്മദ് മാസ്തർ: കേരളത്തിലെ രാഷ്ട്രീയബോധവും മതപരിഷ്കാരങ്ങളും പ്രചോദിപ്പിച്ച, പരിഷ്കരണ ചിന്താഗതിയിലൂടെ വിദ്യാഭ്യാസ രംഗത്ത് മാറ്റങ്ങൾ കൊണ്ടുവന്ന പ്രഗത്ഭ നേതാവാണ്."
        ],
        "correctAnswer": "ശ്രീനാരായണ ഗുരു"
    },
    {
        id: 2,
        question: "തെക്കൻ ദ്രാവിഡ ഭാഷാകുടുംബത്തിൽ പെട്ടിട്ടില്ലാത്ത ഭാഷ ഏതാണ്?",
        options: ["തമിഴ്", "മലയാളം", "കന്നഡ", "ഹിന്ദി"],
        correctAnswer: "ഹിന്ദി",
    },
    {
        id: 3,
        question: "ഇന്ത്യയുടെ പരമോന്നത സിവിലിയൻ പുരസ്കാരം ഏതാണ്?",
        options: ["പദ്മശ്രീ", "പദ്മവിഭൂഷൺ", "ഭാരതരത്ന", "അശോകചക്ര"],
        correctAnswer: "ഭാരതരത്ന",
    },
    {
        id: 4,
        question: "കേരളത്തിലെ 'അരിപ്പൊട്ട' എന്നറിയപ്പെടുന്ന വന്യജീവി സങ്കേതം ഏത് ജില്ലയിലാണ്?",
        options: ["പാലക്കാട്", "വയനാട്", "ഇടുക്കി", "തിരുവന്തപുരം"],
        correctAnswer: "ഇടുക്കി",
    },
    {
        id: 5,
        question: "ഇന്ത്യയിലെ ഭരണഘടനയിൽ 'അടിസ്ഥാന കടമകൾ' ഉൾപ്പെടുത്തി നൽകിയ വർഷം ഏത്?",
        options: ["1950", "1976", "1962", "1984"],
        correctAnswer: "1976",
    },
    {
        id: 6,
        question: "'അമൂല്യഗ്രഹം' എന്നറിയപ്പെടുന്ന ലോഹം ഏത്?",
        options: ["പ്ലാറ്റിനം", "ചുവപ്പ് താമ്രം", "വെള്ളി", "തുതഞ്ഞം"],
        correctAnswer: "പ്ലാറ്റിനം",
    },
    {
        id: 7,
        question: "ഏത് നദിയെയാണ് കേരളത്തിന്റെ 'ജീവനാടി' എന്നു വിളിക്കുന്നത്?",
        options: ["പെരിയാർ", "ഭരതപ്പുഴ", "ചാലക്കാട്", "കല്ലട"],
        correctAnswer: "പെരിയാർ",
    },
    {
        id: 8,
        question: "'വയനാട് ഗൾഫ്ഗൾഫ് ഓഫ് മാന്നാർ' ഏത് കടലിലാണ് സ്ഥിതി ചെയ്യുന്നത്?",
        options: ["അറബിക്കടൽ", "ബംഗാൾ ഉൾക്കടൽ", "ഹിന്ദുമഹാസമുദ്രം", "ചെങ്കടൽ"],
        correctAnswer: "ബംഗാൾ ഉൾക്കടൽ",
    },
    {
        id: 9,
        question: "വിവരണാത്മക കണക്കിൽ 'മീൻ' എന്നത് എന്തിനെ സൂചിപ്പിക്കുന്നു?",
        options: ["ഏറ്റവും കൂടുതൽ വരുന്ന മൂല്യം", "മദ്ധ്യമൂല്യം", "ശരാശരി", "കുറഞ്ഞ മൂല്യം"],
        correctAnswer: "ശരാശരി",
    },
    {
        id: 10,
        question: "ഇന്ത്യയുടെ ആദ്യ ഉപരാഷ്ട്രപതി ആരായിരുന്നു?",
        options: ["സര്വ്പള്ളി രാധാകൃഷ്ണൻ", "രാജേന്ദ്ര പ്രസാദ്", "ലാൽ ബഹാദൂർ ശാസ്ത്രി", "സകരിയ ഹുസൈൻ"],
        correctAnswer: "സര്വ്പള്ളി രാധാകൃഷ്ണൻ",
    }
];

export default function QuizScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const quiz = useQuizState(QUESTIONS);

    const handleContinue = () => {
        const isLastQuestion = quiz.handleContinue();
        if (isLastQuestion) {
            router.back();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <QuizHeader
                currentQuestion={quiz.currentQuestionIndex}
                totalQuestions={quiz.totalQuestions}
                onClose={() => router.back()}
                isDark={isDark}
            />

            {/* Scrollable Content */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Question */}
                <QuestionCard
                    question={quiz.currentQuestion.question}
                    currentIndex={quiz.currentQuestionIndex}
                    totalQuestions={quiz.totalQuestions}
                    isDark={isDark}
                />

                {/* Character Animation Placeholder */}
                <YStack h={0} ai="center" jc="center" mb="$3">
                    {/* Reserved space for future character animation */}
                </YStack>

                {/* Options */}
                <OptionsGrid
                    options={quiz.currentQuestion.options}
                    selectedOption={quiz.selectedOption}
                    correctAnswer={quiz.currentQuestion.correctAnswer}
                    hasAnswered={quiz.hasAnswered}
                    onSelect={quiz.handleOptionPress}
                    isDark={isDark}
                />
            </ScrollView>

            {/* Footer */}
            <YStack
                p="$3.5"
                pb="$5"
                bg={quiz.hasAnswered ? (quiz.isCorrect ? (isDark ? '#052e16' : '#dcfce7') : (isDark ? '#450a0a' : '#fee2e2')) : 'transparent'}
            >
                {quiz.hasAnswered && (
                    <Animated.View entering={ZoomIn.duration(300)}>
                        {quiz.isCorrect ? (
                            <YStack gap="$2.5" mb="$3">
                                {/* Feedback Section */}
                                <FeedbackSection
                                    questionFeedback={quiz.questionFeedback}
                                    showFeedbackOptions={quiz.showFeedbackOptions}
                                    feedbackReason={quiz.feedbackReason}
                                    onFeedback={quiz.handleFeedback}
                                    onFeedbackReason={quiz.handleFeedbackReason}
                                    isDark={isDark}
                                />

                                {/* Result Message */}
                                <ResultMessage
                                    isCorrect={quiz.isCorrect}
                                    correctAnswer={quiz.currentQuestion.correctAnswer}
                                    isDark={isDark}
                                />
                            </YStack>
                        ) : (
                            <YStack gap="$2.5" mb="$3">
                                <ResultMessage
                                    isCorrect={quiz.isCorrect}
                                    correctAnswer={quiz.currentQuestion.correctAnswer}
                                    isDark={isDark}
                                />
                            </YStack>
                        )}
                    </Animated.View>
                )}

                <QuizFooter
                    hasAnswered={quiz.hasAnswered}
                    isCorrect={quiz.isCorrect}
                    selectedOption={quiz.selectedOption}
                    onCheck={quiz.handleCheck}
                    onContinue={handleContinue}
                    isDark={isDark}
                />
            </YStack>
        </SafeAreaView>
    );
}
