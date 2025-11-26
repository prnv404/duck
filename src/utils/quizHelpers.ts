/**
 * Quiz helper utilities for color management and layout logic
 */

export interface QuizColorOptions {
    selectedOption: string | null;
    correctAnswer: string;
    hasAnswered: boolean;
    isDark: boolean;
}

/**
 * Determines the background color for an option button
 */
export const getOptionColor = (
    option: string,
    { selectedOption, correctAnswer, hasAnswered, isDark }: QuizColorOptions
): string => {
    if (!hasAnswered) {
        return selectedOption === option
            ? (isDark ? '#3b82f6' : '#2563eb')
            : (isDark ? '#1f2937' : '#ffffff');
    }

    if (option === correctAnswer) {
        return isDark ? '#22c55e' : '#4ade80';
    }

    if (selectedOption === option && option !== correctAnswer) {
        return isDark ? '#ef4444' : '#f87171';
    }

    return isDark ? '#1f2937' : '#ffffff';
};

/**
 * Determines the border color for an option button
 */
export const getOptionBorderColor = (
    option: string,
    { selectedOption, correctAnswer, hasAnswered, isDark }: QuizColorOptions
): string => {
    if (!hasAnswered) {
        return selectedOption === option
            ? (isDark ? '#60a5fa' : '#3b82f6')
            : (isDark ? '#e5e7eb' : '#e5e7eb');
    }

    if (option === correctAnswer) return 'transparent';
    if (selectedOption === option) return 'transparent';

    return isDark ? '#374151' : '#e5e7eb';
};

/**
 * Determines the text color for an option button
 */
export const getOptionTextColor = (
    option: string,
    { selectedOption, correctAnswer, hasAnswered, isDark }: QuizColorOptions
): string => {
    if (hasAnswered) {
        if (option === correctAnswer || selectedOption === option) {
            return '#ffffff';
        }
    }
    if (selectedOption === option) return '#ffffff';
    return isDark ? '#f3f4f6' : '#1f2937';
};

/**
 * Checks if any option is longer than the threshold for vertical layout
 */
export const hasLongOptions = (options: string[], threshold: number = 50): boolean => {
    return options.some(opt => opt.length > threshold);
};
