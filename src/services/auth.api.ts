import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { graphQLClient } from './graphql/client';
import {
    REQUEST_OTP_MUTATION,
    VERIFY_OTP_MUTATION,
    REFRESH_TOKENS_MUTATION,
    LOGOUT_MUTATION
} from './graphql/mutations/auth';
import { GET_CURRENT_USER_QUERY } from './graphql/queries/user';

interface AuthResponse {
    user: {
        id: string;
        username: string;
        phone: string;
        fullName?: string;
        avatarUrl?: string;
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
    userStats?: UserStats;
}

const STORAGE_KEYS = {
    ACCESS_TOKEN: '@auth/access_token',
    REFRESH_TOKEN: '@auth/refresh_token',
    USER: '@auth/user',
};

class AuthAPI {
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor() {
        this.configureClient();
    }

    private configureClient() {
        graphQLClient.configure(
            // Token Provider
            async () => await this.getAccessToken(),
            // Unauthorized Handler
            async (query, variables) => await this.handleUnauthorizedError(query, variables)
        );
    }

    private subscribeTokenRefresh(cb: (token: string) => void) {
        this.refreshSubscribers.push(cb);
    }

    private onTokenRefreshed(token: string) {
        this.refreshSubscribers.forEach((cb) => cb(token));
        this.refreshSubscribers = [];
    }

    private async handleUnauthorizedError(originalQuery: string, originalVariables?: any): Promise<any> {
        // If already refreshing, wait for it to complete
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.subscribeTokenRefresh(async (token) => {
                    try {
                        // Retry original request with new token
                        const data = await graphQLClient.request(originalQuery, originalVariables);
                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }

        this.isRefreshing = true;

        try {
            // Try to refresh the token
            const newTokens = await this.refreshTokens();
            this.isRefreshing = false;
            this.onTokenRefreshed(newTokens.accessToken);

            // Retry original request with new token
            return await graphQLClient.request(originalQuery, originalVariables);
        } catch (error) {
            this.isRefreshing = false;
            // Refresh failed, logout user
            await this.clearAuthData();
            router.replace('/login');
            throw new Error('Session expired. Please login again.');
        }
    }

    async requestOtp(phone: string): Promise<boolean> {
        const data = await graphQLClient.request(REQUEST_OTP_MUTATION, {
            input: { phone },
        }, true); // Skip auth for OTP request

        return data.requestOtp;
    }

    async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
        const data = await graphQLClient.request(VERIFY_OTP_MUTATION, {
            input: { phone, otp },
        }, true); // Skip auth for OTP verification

        const authResponse = data.verifyOtp;

        // Store tokens and user data
        await this.storeAuthData(authResponse);

        return authResponse;
    }

    async refreshTokens(): Promise<RefreshTokenResponse> {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // Use refresh token in header via custom headers
        const data = await graphQLClient.request(REFRESH_TOKENS_MUTATION, undefined, true, {
            'Authorization': `Bearer ${refreshToken}`
        });

        const tokens = data.refreshTokens;

        // Store new tokens
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken],
            [STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken],
        ]);

        return tokens;
    }

    async logout(): Promise<void> {
        try {
            // Call logout mutation
            await graphQLClient.request(LOGOUT_MUTATION);
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
            const data = await graphQLClient.request(GET_CURRENT_USER_QUERY);
            return data.me;
        } catch (error) {
            // Log detailed error information for debugging
            if (error instanceof Error) {
                console.error('Failed to fetch current user:', error.message);

                // Check if it's a network error
                if (error.message.includes('Network error') || error.message.includes('Unable to reach')) {
                    console.error('The server appears to be down or unreachable');
                }
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
