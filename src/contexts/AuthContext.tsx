import React, { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import { useSession, signIn, signOut } from '@/lib/auth';

/**
 * User type from Better Auth session
 */
interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Session type from Better Auth
 */
interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Auth context value interface
 */
interface AuthContextValue {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    sessionError: Error | null;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider component that wraps the app and provides auth state
 * Uses Better Auth's useSession hook for session management
 * Requirements: 7.1 - WHEN the app starts THEN the System SHALL validate the current 
 * session before proceeding to any protected screen
 * Requirements: 7.5 - WHEN the user is on a protected screen and session expires 
 * THEN the System SHALL redirect to login without crashing
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: sessionData, isPending, error } = useSession();

    // Validate and refresh session on app startup
    // Requirements: 7.1 - Validate current session before proceeding to protected screens
    useEffect(() => {
        const validateSession = async () => {
            if (!isPending && sessionData?.session) {
                console.log('[Auth] Validating session on startup...');
                try {
                    // Force a session check to ensure it's still valid
                    // This will trigger Better Auth to refresh if needed
                    const freshSession = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'https://duck-server-production.up.railway.app'}/auth/get-session`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (!freshSession.ok) {
                        console.log('[Auth] Session validation failed, session may be expired');
                    } else {
                        console.log('[Auth] Session validated successfully');
                    }
                } catch (error) {
                    console.error('[Auth] Session validation error:', error);
                }
            }
        };

        validateSession();

        // Set up periodic session validation (every 6 hours when app is active)
        // This ensures the session stays fresh even if user doesn't make API calls
        const intervalId = setInterval(() => {
            if (sessionData?.session) {
                console.log('[Auth] Periodic session validation...');
                validateSession();
            }
        }, 6 * 60 * 60 * 1000); // 6 hours

        return () => clearInterval(intervalId);
    }, [isPending, sessionData?.session]);

    // Handle session errors (including expiration)
    // Requirements: 7.1, 7.5 - Session error handling
    useEffect(() => {
        if (error) {
            console.error('[Auth] Session error:', error);
            // Session is invalid, the navigation will handle redirect
            // based on isAuthenticated being false
        }
    }, [error]);

    const user = useMemo(() => {
        // Return null if there's a session error
        if (error) return null;
        return sessionData?.user ?? null;
    }, [sessionData?.user, error]);

    const session = useMemo(() => {
        // Return null if there's a session error
        if (error) return null;
        return sessionData?.session ?? null;
    }, [sessionData?.session, error]);

    // Requirements: 7.1, 7.5 - isAuthenticated returns false when session is invalid
    const isAuthenticated = useMemo(() => {
        // Return false if there's a session error
        if (error) return false;
        return !!sessionData?.session && !!sessionData?.user;
    }, [sessionData, error]);

    /**
     * Sign in with Google OAuth
     * Uses Better Auth's social sign-in method
     */
    const signInWithGoogle = useCallback(async () => {
        await signIn.social({
            provider: 'google',
            callbackURL: "/onboarding"
        });
    }, []);

    /**
     * Sign out the current user
     * Clears the session from Better Auth
     */
    const signOutUser = useCallback(async () => {
        await signOut();
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
        user: user as User | null,
        session: session as Session | null,
        isLoading: isPending,
        isAuthenticated,
        sessionError: error ?? null,
        signInWithGoogle,
        signOutUser,
    }), [user, session, isPending, isAuthenticated, error, signInWithGoogle, signOutUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access auth context
 * Must be used within an AuthProvider
 */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}


