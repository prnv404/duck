import { apiClient } from './api-client';

/**
 * User data interface matching Better Auth user model
 */
interface UserData {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Auth API service for user-related operations
 * Note: Authentication is now handled by Better Auth (@/lib/auth)
 * This service only provides user data fetching functionality
 */
class AuthAPI {
    /**
     * Get the current authenticated user's data
     * @returns User data or null if not authenticated
     */
    async getCurrentUser(): Promise<UserData | null> {
        try {
            const user = await apiClient.get<UserData>('/users/me');
            return user;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Failed to fetch current user:', error.message);
            } else {
                console.error('Failed to fetch current user:', error);
            }
            return null;
        }
    }
}

export const authAPI = new AuthAPI();
