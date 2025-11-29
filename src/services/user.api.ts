import { apiClient } from './api-client';

export interface UserResponseDto {
    id: string;
    username: string;
    phone: string;
    fullName?: string;
    avatarUrl?: string;
    targetExam?: string;
    fcmToken?: string;
    notificationEnabled?: boolean;
    createdAt?: string;
    lastActiveAt?: string;
}

export interface UpdateUserDto {
    fullName?: string;
    avatarUrl?: string;
    targetExam?: string;
    notificationEnabled?: boolean;
    fcmToken?: string;
}

export interface UserStatsResponseDto {
    id: string;
    userId: string;
    totalXp: number;
    level: number;
    energy: number;
    xpToNextLevel: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate?: string;
    totalQuizzesCompleted: number;
    totalQuestionsAttempted: number;
    totalCorrectAnswers: number;
    overallAccuracy: string;
    totalPracticeTimeMinutes: number;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserStatsDto {
    xpEarned?: number;
    questionsAnswered?: number;
    correctAnswers?: number;
    practiceTimeSeconds?: number;
    quizCompleted?: boolean;
}

export interface StreakCalendarResponseDto {
    id: string;
    userId: string;
    date: string;
    quizzesCompleted: number;
    questionsAnswered: number;
    xpEarned: number;
    streakDay: number;
}

class UserAPI {
    /**
     * Get current user profile
     */
    async getProfile(): Promise<UserResponseDto> {
        return await apiClient.get<UserResponseDto>('/users/me');
    }

    /**
     * Update current user profile
     */
    async updateProfile(data: UpdateUserDto): Promise<UserResponseDto> {
        return await apiClient.patch<UserResponseDto>('/users/me', data);
    }

    /**
     * Delete current user account
     */
    async deleteAccount(): Promise<boolean> {
        const response = await apiClient.delete<{ success: boolean; message: string }>('/users/me');
        return response.success;
    }

    /**
     * Get user statistics
     */
    async getStats(): Promise<UserStatsResponseDto> {
        return await apiClient.get<UserStatsResponseDto>('/users/me/stats');
    }

    /**
     * Update user statistics
     */
    async updateStats(data: UpdateUserStatsDto): Promise<UserStatsResponseDto> {
        return await apiClient.patch<UserStatsResponseDto>('/users/me/stats', data);
    }

    /**
     * Get streak calendar
     */
    async getStreakCalendar(): Promise<StreakCalendarResponseDto[]> {
        return await apiClient.get<StreakCalendarResponseDto[]>('/users/me/streak');
    }
}

export const userAPI = new UserAPI();
