import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

/**
 * Better Auth client configuration for React Native/Expo
 * Uses expo-secure-store for secure token storage
 */
export const authClient = createAuthClient({
    baseURL: "https://delia-unsigneted-marcela.ngrok-free.dev",
    plugins: [
        expoClient({
            scheme: 'duck', // CRITICAL: Must match app.json scheme for OAuth callbacks
            storagePrefix: 'duck-auth',
            storage: SecureStore,
        }),
    ],

});

// Export typed hooks and methods for use throughout the app
export const { signIn, signOut, useSession, getSession } = authClient;
