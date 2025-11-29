import { apiClient } from './api-client';

export interface BadgeResponseDto {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    badgeType: string;
    unlockCriteria: Record<string, any>;
    xpReward: number;
    createdAt: string;
    unlockedAt?: string | null;
    progressPercentage?: number;
}

export interface StreakDataDto {
    currentStreak: number;
    longestStreak: number;
    calendar: {
        id: string;
        userId: string;
        activityDate: string;
        quizzesCompleted: number;
        questionsAnswered: number;
        xpEarned: number;
        createdAt: string;
    }[];
}

export interface LeaderboardEntryDto {
    userId: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
    xpEarned: number;
    quizzesCompleted: number;
    rank: number;
}

class GamificationAPI {
    /**
     * Get user's badges
     */
    async getMyBadges(): Promise<BadgeResponseDto[]> {
        return await apiClient.get<BadgeResponseDto[]>('/gamification/my-badges');
    }

    /**
     * Get all available badges (catalog)
     */
    async getAllBadges(): Promise<BadgeResponseDto[]> {
        return await apiClient.get<BadgeResponseDto[]>('/gamification/badges');
    }

    /**
     * Get user's streak calendar
     */
    async getMyStreak(): Promise<StreakDataDto> {
        return await apiClient.get<StreakDataDto>('/gamification/my-streak');
    }

    /**
     * Get leaderboard by period
     */
    async getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'weekly', limit = 50): Promise<LeaderboardEntryDto[]> {
        return await apiClient.get<LeaderboardEntryDto[]>('/gamification/leaderboard', { period, limit });
    }

    /**
     * Get user's rank in leaderboard
     */
    async getMyRank(period: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'weekly'): Promise<LeaderboardEntryDto | null> {
        return await apiClient.get<LeaderboardEntryDto | null>('/gamification/my-rank', { period });
    }
}

export const gamificationAPI = new GamificationAPI();
