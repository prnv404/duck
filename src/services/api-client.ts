import { authClient } from '@/lib/auth';

// Base URL for the REST API
// const API_BASE_URL = 'https://delia-unsigneted-marcela.ngrok-free.dev'
const API_BASE_URL = 'https://duck-server-production.up.railway.app'// console.log(process.env.NODE_ENV)
/**
 * API Client for making authenticated requests
 * Uses Better Auth session for authentication
 * Requirements: 5.4 - WHEN making API requests THEN the System SHALL include 
 * the session token in request headers
 * Requirements: 6.2, 7.2 - Session refresh handling on 401
 */
class ApiClient {
    // Track if we're currently attempting a refresh to prevent infinite loops
    private isRefreshing = false;

    /**
     * Get the current session cookies from Better Auth
     * Returns cookies as a string ready to be sent in Cookie header
     */
    private getSessionCookies(): string {
        try {
            const cookies = authClient.getCookie();
            if (cookies) {
                console.log('[API Client] Got session cookies');
            } else {
                console.log('[API Client] No session cookies found');
            }
            return cookies || '';
        } catch (error) {
            console.error('Failed to get session cookies:', error);
            return '';
        }
    }

    /**
     * Attempt to refresh the session
     * Better Auth client handles refresh automatically
     * Requirements: 6.2 - WHEN a session token is near expiration THEN the Auth_Client 
     * SHALL automatically attempt to refresh the session
     * Requirements: 7.2 - WHEN an API request returns 401 Unauthorized THEN the System 
     * SHALL attempt to refresh the session before redirecting to login
     * @returns true if session was successfully refreshed, false otherwise
     */
    private async attemptSessionRefresh(): Promise<boolean> {
        if (this.isRefreshing) {
            return false;
        }

        this.isRefreshing = true;
        try {
            // Try to get fresh session data
            // Better Auth will automatically refresh if needed
            const session = await authClient.getSession();
            const isValid = !!session?.data?.session;
            return isValid;
        } catch (error) {
            console.error('Session refresh failed:', error);
            return false;
        } finally {
            this.isRefreshing = false;
        }
    }

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
     * Core request method with session token injection and error handling
     * Requirements: 5.4 - Include session token in request headers
     * Requirements: 5.5 - Handle session invalidation during use
     * Requirements: 6.2, 7.2 - Attempt session refresh on 401 before redirecting
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        isRetry = false
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const cookies = this.getSessionCookies();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        // For Expo apps, Better Auth requires cookies to be sent in the Cookie header
        // per the Better Auth Expo integration documentation
        if (cookies) {
            headers['Cookie'] = cookies;
            console.log('[API Client] Sending request to:', endpoint, 'with cookies');
        } else {
            console.log('[API Client] Sending request to:', endpoint, 'WITHOUT cookies');
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                // 'include' can interfere with the cookies we just set manually in the headers
                credentials: 'omit',
            });

            console.log('[API Client] Response status:', response.status);

            // Handle 401 Unauthorized - session invalid or expired
            // Requirements: 7.2 - WHEN an API request returns 401 Unauthorized 
            // THEN the System SHALL attempt to refresh the session before redirecting to login
            if (response.status === 401) {
                // Only attempt refresh if this is not already a retry
                if (!isRetry) {
                    const refreshed = await this.attemptSessionRefresh();
                    if (refreshed) {
                        // Retry the request with the new token
                        return this.request<T>(endpoint, options, true);
                    }
                }
                // Refresh failed - just throw error, let the app handle navigation
                throw new Error('Unauthorized');
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
                // If response is not JSON, return empty object
                return {} as T;
            }
        } catch (error) {
            if (error instanceof Error) {
                // If it's a network error, show a specific message
                if (error.message.includes('Network request failed')) {
                    throw new Error('Network error. Please check your internet connection.');
                }
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }


}

export const apiClient = new ApiClient();
