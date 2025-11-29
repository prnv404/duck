import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Base URL for the REST API
const API_BASE_URL = 'https://delia-unsigneted-marcela.ngrok-free.dev/api/v1';

// Storage keys (matching those in auth.api.ts)
export const STORAGE_KEYS = {
    ACCESS_TOKEN: '@auth/access_token',
    REFRESH_TOKEN: '@auth/refresh_token',
    USER: '@auth/user',
};

interface ApiError {
    message: string;
    statusCode?: number;
    error?: string;
}

class ApiClient {
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    /**
     * Make a GET request
     */
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const queryString = params
            ? '?' + new URLSearchParams(params).toString()
            : '';
        return this.request<T>(endpoint + queryString, { method: 'GET' });
    }

    /**
     * Make a POST request
     */
    async post<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * Make a PATCH request
     */
    async patch<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * Make a DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    /**
     * Core request method with interceptors
     */
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle 401 Unauthorized (Token Expired)
            if (response.status === 401) {
                // If this was a refresh attempt that failed, throw error
                if (endpoint === '/auth/refresh') {
                    throw new Error('Session expired');
                }

                return this.handleUnauthorized<T>(endpoint, options);
            }

            // Handle other errors
            if (!response.ok) {
                let errorMessage = 'An unexpected error occurred';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = response.statusText;
                }
                throw new Error(errorMessage);
            }

            // Parse response
            // Some endpoints might return empty body (e.g. 204 No Content)
            if (response.status === 204) {
                return {} as T;
            }

            try {
                return await response.json();
            } catch (e) {
                // If response is not JSON, return text or empty object
                return {} as T;
            }
        } catch (error) {
            if (error instanceof Error) {
                // If it's a network error, we might want to retry or show a specific message
                if (error.message.includes('Network request failed')) {
                    throw new Error('Network error. Please check your internet connection.');
                }
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Handle 401 errors by refreshing token
     */
    private async handleUnauthorized<T>(endpoint: string, options: RequestInit): Promise<T> {
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.refreshSubscribers.push(async (token) => {
                    try {
                        // Retry original request with new token
                        const headers = { ...options.headers } as Record<string, string>;
                        headers['Authorization'] = `Bearer ${token}`;

                        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                            ...options,
                            headers,
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Request failed after refresh');
                        }

                        resolve(await response.json());
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }

        this.isRefreshing = true;

        try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            // Call refresh endpoint
            // We use fetch directly to avoid circular dependency and infinite loops
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!refreshResponse.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await refreshResponse.json();
            const { accessToken, refreshToken: newRefreshToken } = data;

            // Store new tokens
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
                [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
            ]);

            // Notify subscribers
            this.refreshSubscribers.forEach((cb) => cb(accessToken));
            this.refreshSubscribers = [];

            // Retry original request
            const headers = { ...options.headers } as Record<string, string>;
            headers['Authorization'] = `Bearer ${accessToken}`;

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed after refresh');
            }

            return await response.json();

        } catch (error) {
            // Logout if refresh fails
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.ACCESS_TOKEN,
                STORAGE_KEYS.REFRESH_TOKEN,
                STORAGE_KEYS.USER,
            ]);
            router.replace('/login');
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }
}

export const apiClient = new ApiClient();
