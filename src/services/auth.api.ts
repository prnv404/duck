import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { apiClient, STORAGE_KEYS } from './api-client';

interface AuthResponse {
    user: {
        id: string;
        username: string;
        phone: string;
        fullName?: string;
        avatarUrl?: string;
        targetExam?: string;
        notificationEnabled?: boolean;
        createdAt?: string;
        lastActiveAt?: string;
    };
    accessToken: string;
    refreshToken: string;
}

interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

interface UserStats {
    id: string;
    userId: string;
    level: number;
    totalXp: number;
    currentStreak: number;
    lastActivityDate?: string;
    overallAccuracy: number;
    totalCorrectAnswers: number;
    totalPracticeTimeMinutes: number;
    totalQuestionsAttempted: number;
    totalQuizzesCompleted: number;
    updatedAt: string;
    xpToNextLevel: number;
}

interface UserData {
    id: string;
    username: string;
    fullName?: string;
    phone: string;
    createdAt: string;
    notificationEnabled: boolean;
    targetExam?: string;
    lastActiveAt?: string;
    avatarUrl?: string;
    // Stats are now fetched separately in REST API, but keeping structure for compatibility if needed
    userStats?: UserStats;
}

class AuthAPI {
    async requestOtp(phone: string): Promise<boolean> {
        const response = await apiClient.post<{ success: boolean; message: string }>('/auth/request-otp', { phone });
        return response.success;
    }

    async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
        const authResponse = await apiClient.post<AuthResponse>('/auth/verify-otp', { phone, otp });

        // Store tokens and user data
        await this.storeAuthData(authResponse);

        return authResponse;
    }

    async refreshTokens(): Promise<RefreshTokenResponse> {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const tokens = await apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });

        // Store new tokens
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken],
            [STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken],
        ]);

        return tokens;
    }

    async logout(): Promise<void> {
        try {
            // Call logout endpoint
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Even if the server call fails, clear local data
            console.error('Logout error:', error);
        } finally {
            // Always clear local auth data
            await this.clearAuthData();
        }
    }

    async storeAuthData(authData: AuthResponse): Promise<void> {
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken],
            [STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken],
            [STORAGE_KEYS.USER, JSON.stringify(authData.user)],
        ]);
    }

    async clearAuthData(): Promise<void> {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER,
        ]);
    }

    async getAccessToken(): Promise<string | null> {
        return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    async getUser() {
        const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        return userJson ? JSON.parse(userJson) : null;
    }

    async getCurrentUser(): Promise<UserData | null> {
        try {
            // In REST API, we might need two calls to get full user data + stats if needed
            // For now, just getting the profile
            const user = await apiClient.get<UserData>('/users/me');

            // Optionally fetch stats if the UI expects it nested
            // const stats = await apiClient.get<UserStats>('/users/me/stats');
            // user.userStats = stats;

            return user;
        } catch (error) {
            // Log detailed error information for debugging
            if (error instanceof Error) {
                console.error('Failed to fetch current user:', error.message);
            } else {
                console.error('Failed to fetch current user:', error);
            }
            return null;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getAccessToken();
        return !!token;
    }
}

export const authAPI = new AuthAPI();
export { STORAGE_KEYS };
