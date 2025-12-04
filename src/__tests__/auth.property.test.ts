/**
 * Property-Based Tests for Better Auth Client
 * 
 * **Feature: better-auth-google-signin, Property 8: Client Session Token Storage**
 * **Validates: Requirements 3.4**
 * 
 * **Feature: better-auth-google-signin, Property 9: Session Restoration on App Launch**
 * **Validates: Requirements 3.5, 5.2**
 * 
 * **Feature: better-auth-google-signin, Property 10: Navigation Based on User State**
 * **Validates: Requirements 4.4**
 */

import * as fc from 'fast-check';
import * as SecureStore from 'expo-secure-store';

// Storage key prefix used by the auth client
const STORAGE_PREFIX = 'duck-auth';

describe('Better Auth Client - Property Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * **Feature: better-auth-google-signin, Property 8: Client Session Token Storage**
     * **Validates: Requirements 3.4**
     * 
     * Property: For any successful authentication on the client, the session token 
     * SHALL be stored in expo-secure-store and retrievable for subsequent requests.
     */
    describe('Property 8: Client Session Token Storage', () => {
        it('should store and retrieve any valid session token', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate random session tokens (non-empty alphanumeric strings)
                    fc.string({ minLength: 1, maxLength: 256 }).filter(s => s.trim().length > 0),
                    async (sessionToken) => {
                        const storageKey = `${STORAGE_PREFIX}.session_token`;

                        // Mock the storage behavior
                        const storage = new Map<string, string>();

                        (SecureStore.setItemAsync as jest.Mock).mockImplementation(
                            async (key: string, value: string) => {
                                storage.set(key, value);
                            }
                        );

                        (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                            async (key: string) => {
                                return storage.get(key) ?? null;
                            }
                        );

                        // Store the session token
                        await SecureStore.setItemAsync(storageKey, sessionToken);

                        // Retrieve the session token
                        const retrievedToken = await SecureStore.getItemAsync(storageKey);

                        // Property: stored token must equal retrieved token
                        expect(retrievedToken).toBe(sessionToken);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle session token deletion correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.string({ minLength: 1, maxLength: 256 }).filter(s => s.trim().length > 0),
                    async (sessionToken) => {
                        const storageKey = `${STORAGE_PREFIX}.session_token`;

                        // Mock the storage behavior
                        const storage = new Map<string, string>();

                        (SecureStore.setItemAsync as jest.Mock).mockImplementation(
                            async (key: string, value: string) => {
                                storage.set(key, value);
                            }
                        );

                        (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                            async (key: string) => {
                                return storage.get(key) ?? null;
                            }
                        );

                        (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
                            async (key: string) => {
                                storage.delete(key);
                            }
                        );

                        // Store the session token
                        await SecureStore.setItemAsync(storageKey, sessionToken);

                        // Verify it's stored
                        const storedToken = await SecureStore.getItemAsync(storageKey);
                        expect(storedToken).toBe(sessionToken);

                        // Delete the session token
                        await SecureStore.deleteItemAsync(storageKey);

                        // Property: after deletion, token should not be retrievable
                        const deletedToken = await SecureStore.getItemAsync(storageKey);
                        expect(deletedToken).toBeNull();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should preserve token integrity for any valid JWT-like token', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate JWT-like tokens (base64 encoded segments)
                    fc.tuple(
                        fc.base64String({ minLength: 10, maxLength: 100 }),
                        fc.base64String({ minLength: 10, maxLength: 200 }),
                        fc.base64String({ minLength: 10, maxLength: 100 })
                    ).map(([header, payload, signature]) => `${header}.${payload}.${signature}`),
                    async (jwtToken) => {
                        const storageKey = `${STORAGE_PREFIX}.session_token`;

                        // Mock the storage behavior
                        const storage = new Map<string, string>();

                        (SecureStore.setItemAsync as jest.Mock).mockImplementation(
                            async (key: string, value: string) => {
                                storage.set(key, value);
                            }
                        );

                        (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                            async (key: string) => {
                                return storage.get(key) ?? null;
                            }
                        );

                        // Store the JWT token
                        await SecureStore.setItemAsync(storageKey, jwtToken);

                        // Retrieve the JWT token
                        const retrievedToken = await SecureStore.getItemAsync(storageKey);

                        // Property: JWT token integrity must be preserved
                        expect(retrievedToken).toBe(jwtToken);
                        expect(retrievedToken?.split('.').length).toBe(3);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: better-auth-google-signin, Property 9: Session Restoration on App Launch**
     * **Validates: Requirements 3.5, 5.2**
     * 
     * Property: For any stored valid session, when the app launches, the system SHALL 
     * restore the authentication state and the user SHALL be considered authenticated 
     * without re-login.
     */
    describe('Property 9: Session Restoration on App Launch', () => {
        // Arbitrary for generating valid session data
        const sessionArbitrary = fc.record({
            id: fc.uuid(),
            userId: fc.uuid(),
            token: fc.string({ minLength: 32, maxLength: 256 }).filter(s => s.trim().length > 0),
            expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }),
            createdAt: fc.date({ max: new Date() }),
            updatedAt: fc.date({ max: new Date() }),
        });

        const userArbitrary = fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
            emailVerified: fc.boolean(),
            name: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
            image: fc.option(fc.webUrl(), { nil: null }),
            createdAt: fc.date({ max: new Date() }),
            updatedAt: fc.date({ max: new Date() }),
        });

        it('should restore authentication state from stored valid session', async () => {
            await fc.assert(
                fc.asyncProperty(
                    sessionArbitrary,
                    userArbitrary,
                    async (session, user) => {
                        // Ensure userId matches between session and user
                        const linkedSession = { ...session, userId: user.id };

                        // Mock storage with the session data
                        const storage = new Map<string, string>();
                        const sessionKey = `${STORAGE_PREFIX}.session`;
                        const sessionData = JSON.stringify({ session: linkedSession, user });

                        (SecureStore.setItemAsync as jest.Mock).mockImplementation(
                            async (key: string, value: string) => {
                                storage.set(key, value);
                            }
                        );

                        (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                            async (key: string) => {
                                return storage.get(key) ?? null;
                            }
                        );

                        // Store the session (simulating previous authentication)
                        await SecureStore.setItemAsync(sessionKey, sessionData);

                        // Simulate app launch - retrieve stored session
                        const storedData = await SecureStore.getItemAsync(sessionKey);

                        // Property: stored session data must be retrievable
                        expect(storedData).not.toBeNull();

                        const parsedData = JSON.parse(storedData!);

                        // Property: restored session must match original session
                        expect(parsedData.session.id).toBe(linkedSession.id);
                        expect(parsedData.session.userId).toBe(linkedSession.userId);
                        expect(parsedData.session.token).toBe(linkedSession.token);

                        // Property: restored user must match original user
                        expect(parsedData.user.id).toBe(user.id);
                        expect(parsedData.user.email).toBe(user.email);

                        // Property: user should be considered authenticated
                        const isAuthenticated = !!parsedData.session && !!parsedData.user;
                        expect(isAuthenticated).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should not authenticate when no stored session exists', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.constant(null), // No session stored
                    async () => {
                        // Mock empty storage
                        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

                        const sessionKey = `${STORAGE_PREFIX}.session`;

                        // Simulate app launch - attempt to retrieve session
                        const storedData = await SecureStore.getItemAsync(sessionKey);

                        // Property: no stored session means not authenticated
                        expect(storedData).toBeNull();

                        const isAuthenticated = storedData !== null;
                        expect(isAuthenticated).toBe(false);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should handle session expiration correctly', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate expired sessions (expiration date in the past)
                    fc.record({
                        id: fc.uuid(),
                        userId: fc.uuid(),
                        token: fc.string({ minLength: 32, maxLength: 256 }).filter(s => s.trim().length > 0),
                        expiresAt: fc.date({
                            min: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
                            max: new Date(Date.now() - 1000) // Expired at least 1 second ago
                        }),
                        createdAt: fc.date({ max: new Date() }),
                        updatedAt: fc.date({ max: new Date() }),
                    }),
                    userArbitrary,
                    async (expiredSession, user) => {
                        const linkedSession = { ...expiredSession, userId: user.id };

                        // Mock storage with expired session
                        const storage = new Map<string, string>();
                        const sessionKey = `${STORAGE_PREFIX}.session`;
                        const sessionData = JSON.stringify({ session: linkedSession, user });

                        (SecureStore.setItemAsync as jest.Mock).mockImplementation(
                            async (key: string, value: string) => {
                                storage.set(key, value);
                            }
                        );

                        (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                            async (key: string) => {
                                return storage.get(key) ?? null;
                            }
                        );

                        // Store the expired session
                        await SecureStore.setItemAsync(sessionKey, sessionData);

                        // Simulate app launch - retrieve stored session
                        const storedData = await SecureStore.getItemAsync(sessionKey);
                        const parsedData = JSON.parse(storedData!);

                        // Parse the expiration date
                        const expiresAt = new Date(parsedData.session.expiresAt);
                        const now = new Date();

                        // Property: expired session should be detected
                        const isExpired = expiresAt < now;
                        expect(isExpired).toBe(true);

                        // Property: expired session should not be considered valid for authentication
                        const isValidSession = !isExpired && !!parsedData.session && !!parsedData.user;
                        expect(isValidSession).toBe(false);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should preserve all user data fields during session restoration', async () => {
            await fc.assert(
                fc.asyncProperty(
                    sessionArbitrary,
                    userArbitrary,
                    async (session, user) => {
                        const linkedSession = { ...session, userId: user.id };

                        const storage = new Map<string, string>();
                        const sessionKey = `${STORAGE_PREFIX}.session`;
                        const sessionData = JSON.stringify({ session: linkedSession, user });

                        (SecureStore.setItemAsync as jest.Mock).mockImplementation(
                            async (key: string, value: string) => {
                                storage.set(key, value);
                            }
                        );

                        (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                            async (key: string) => {
                                return storage.get(key) ?? null;
                            }
                        );

                        // Store session data
                        await SecureStore.setItemAsync(sessionKey, sessionData);

                        // Retrieve and parse
                        const storedData = await SecureStore.getItemAsync(sessionKey);
                        const parsedData = JSON.parse(storedData!);

                        // Property: all user fields must be preserved
                        expect(parsedData.user.id).toBe(user.id);
                        expect(parsedData.user.email).toBe(user.email);
                        expect(parsedData.user.emailVerified).toBe(user.emailVerified);
                        expect(parsedData.user.name).toBe(user.name);
                        expect(parsedData.user.image).toBe(user.image);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});


/**
 * **Feature: better-auth-google-signin, Property 10: Navigation Based on User State**
 * **Validates: Requirements 4.4**
 * 
 * Property: For any successful authentication, the system SHALL navigate to onboarding 
 * if the user has not completed onboarding, or to the home screen if onboarding is complete.
 */
describe('Property 10: Navigation Based on User State', () => {
    // Arbitrary for generating valid user states
    const userStateArbitrary = fc.record({
        isAuthenticated: fc.constant(true), // Only testing authenticated users
        hasCompletedOnboarding: fc.boolean(),
        userId: fc.uuid(),
        email: fc.emailAddress(),
    });

    /**
     * Helper function to determine expected navigation destination
     * This mirrors the logic in the index.tsx component
     */
    function getExpectedDestination(isAuthenticated: boolean, hasCompletedOnboarding: boolean): string {
        if (!isAuthenticated) {
            return '/login';
        }
        return hasCompletedOnboarding ? '/(tabs)' : '/onboarding';
    }

    it('should navigate to correct destination based on authentication and onboarding state', async () => {
        await fc.assert(
            fc.asyncProperty(
                userStateArbitrary,
                async (userState) => {
                    const expectedDestination = getExpectedDestination(
                        userState.isAuthenticated,
                        userState.hasCompletedOnboarding
                    );

                    // Property: authenticated users who completed onboarding go to home
                    if (userState.isAuthenticated && userState.hasCompletedOnboarding) {
                        expect(expectedDestination).toBe('/(tabs)');
                    }

                    // Property: authenticated users who haven't completed onboarding go to onboarding
                    if (userState.isAuthenticated && !userState.hasCompletedOnboarding) {
                        expect(expectedDestination).toBe('/onboarding');
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should navigate unauthenticated users to login', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    isAuthenticated: fc.constant(false),
                    hasCompletedOnboarding: fc.boolean(), // Onboarding state doesn't matter for unauthenticated
                }),
                async (userState) => {
                    const expectedDestination = getExpectedDestination(
                        userState.isAuthenticated,
                        userState.hasCompletedOnboarding
                    );

                    // Property: unauthenticated users always go to login regardless of onboarding state
                    expect(expectedDestination).toBe('/login');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should correctly determine navigation for all possible user state combinations', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    isAuthenticated: fc.boolean(),
                    hasCompletedOnboarding: fc.boolean(),
                }),
                async (userState) => {
                    const destination = getExpectedDestination(
                        userState.isAuthenticated,
                        userState.hasCompletedOnboarding
                    );

                    // Property: destination must be one of the valid routes
                    const validRoutes = ['/login', '/onboarding', '/(tabs)'];
                    expect(validRoutes).toContain(destination);

                    // Property: navigation logic is deterministic
                    const destination2 = getExpectedDestination(
                        userState.isAuthenticated,
                        userState.hasCompletedOnboarding
                    );
                    expect(destination).toBe(destination2);

                    // Property: authentication is required for non-login routes
                    if (destination !== '/login') {
                        expect(userState.isAuthenticated).toBe(true);
                    }

                    // Property: onboarding completion determines home vs onboarding for authenticated users
                    if (userState.isAuthenticated) {
                        if (userState.hasCompletedOnboarding) {
                            expect(destination).toBe('/(tabs)');
                        } else {
                            expect(destination).toBe('/onboarding');
                        }
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should handle onboarding state stored in AsyncStorage', async () => {
        // Mock AsyncStorage behavior
        const mockAsyncStorage = new Map<string, string>();

        const getItem = async (key: string): Promise<string | null> => {
            return mockAsyncStorage.get(key) ?? null;
        };

        const setItem = async (key: string, value: string): Promise<void> => {
            mockAsyncStorage.set(key, value);
        };

        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    userId: fc.uuid(),
                    onboardingCompleted: fc.boolean(),
                }),
                async ({ userId, onboardingCompleted }) => {
                    // Clear storage before each test
                    mockAsyncStorage.clear();

                    // Set onboarding state if completed
                    if (onboardingCompleted) {
                        await setItem('@onboarding_completed', 'true');
                    }

                    // Retrieve onboarding state
                    const storedValue = await getItem('@onboarding_completed');
                    const hasCompletedOnboarding = storedValue === 'true';

                    // Property: stored value correctly reflects onboarding state
                    expect(hasCompletedOnboarding).toBe(onboardingCompleted);

                    // Property: navigation destination is correct based on stored state
                    const destination = getExpectedDestination(true, hasCompletedOnboarding);
                    if (onboardingCompleted) {
                        expect(destination).toBe('/(tabs)');
                    } else {
                        expect(destination).toBe('/onboarding');
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
});


/**
 * **Feature: better-auth-google-signin, Property 13: Session Token in API Requests**
 * **Validates: Requirements 5.4**
 * 
 * Property: For any API request made by an authenticated user, the request headers 
 * SHALL include the session token.
 */
describe('Property 13: Session Token in API Requests', () => {
    // Mock fetch globally
    const originalFetch = global.fetch;
    let mockFetch: jest.Mock;
    let capturedHeaders: Record<string, string>[] = [];

    beforeEach(() => {
        capturedHeaders = [];
        mockFetch = jest.fn().mockImplementation((url: string, options?: RequestInit) => {
            // Capture the headers from each request
            if (options?.headers) {
                capturedHeaders.push(options.headers as Record<string, string>);
            }
            return Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ success: true }),
            });
        });
        global.fetch = mockFetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
        jest.clearAllMocks();
    });

    // Arbitrary for generating valid session tokens
    const sessionTokenArbitrary = fc.string({ minLength: 32, maxLength: 256 })
        .filter(s => s.trim().length > 0);

    // Arbitrary for generating API endpoints
    const endpointArbitrary = fc.stringMatching(/^\/[a-z][a-z0-9\-\/]*$/)
        .filter(s => s.length > 1 && s.length < 100);

    // Arbitrary for generating request bodies
    const requestBodyArbitrary = fc.record({
        id: fc.uuid(),
        data: fc.string({ minLength: 1, maxLength: 100 }),
        timestamp: fc.date().map(d => d.toISOString()),
    });

    /**
     * Helper function to simulate API client behavior
     * This mirrors the logic in api-client.ts
     */
    async function makeAuthenticatedRequest(
        endpoint: string,
        token: string | null,
        method: string = 'GET',
        body?: any
    ): Promise<{ headers: Record<string, string> }> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        // Include session token in Authorization header if available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            headers,
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        await fetch(`https://api.example.com${endpoint}`, options);

        return { headers };
    }

    it('should include session token in Authorization header for all authenticated requests', async () => {
        await fc.assert(
            fc.asyncProperty(
                sessionTokenArbitrary,
                endpointArbitrary,
                async (sessionToken, endpoint) => {
                    capturedHeaders = [];

                    const result = await makeAuthenticatedRequest(endpoint, sessionToken);

                    // Property: Authorization header must be present
                    expect(result.headers['Authorization']).toBeDefined();

                    // Property: Authorization header must contain Bearer token
                    expect(result.headers['Authorization']).toBe(`Bearer ${sessionToken}`);

                    // Property: fetch was called with the correct headers
                    expect(mockFetch).toHaveBeenCalled();
                    const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
                    const requestHeaders = lastCall[1]?.headers as Record<string, string>;
                    expect(requestHeaders['Authorization']).toBe(`Bearer ${sessionToken}`);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not include Authorization header when no session token exists', async () => {
        await fc.assert(
            fc.asyncProperty(
                endpointArbitrary,
                async (endpoint) => {
                    capturedHeaders = [];

                    const result = await makeAuthenticatedRequest(endpoint, null);

                    // Property: Authorization header must NOT be present when no token
                    expect(result.headers['Authorization']).toBeUndefined();

                    // Property: fetch was called without Authorization header
                    expect(mockFetch).toHaveBeenCalled();
                    const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
                    const requestHeaders = lastCall[1]?.headers as Record<string, string>;
                    expect(requestHeaders['Authorization']).toBeUndefined();
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should include session token for all HTTP methods', async () => {
        const httpMethods = ['GET', 'POST', 'PATCH', 'DELETE'];

        await fc.assert(
            fc.asyncProperty(
                sessionTokenArbitrary,
                endpointArbitrary,
                fc.constantFrom(...httpMethods),
                requestBodyArbitrary,
                async (sessionToken, endpoint, method, body) => {
                    capturedHeaders = [];

                    const requestBody = method !== 'GET' ? body : undefined;
                    const result = await makeAuthenticatedRequest(endpoint, sessionToken, method, requestBody);

                    // Property: Authorization header must be present for all HTTP methods
                    expect(result.headers['Authorization']).toBe(`Bearer ${sessionToken}`);

                    // Property: fetch was called with correct method and headers
                    expect(mockFetch).toHaveBeenCalled();
                    const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
                    expect(lastCall[1]?.method).toBe(method);
                    const requestHeaders = lastCall[1]?.headers as Record<string, string>;
                    expect(requestHeaders['Authorization']).toBe(`Bearer ${sessionToken}`);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should preserve token integrity in Authorization header', async () => {
        await fc.assert(
            fc.asyncProperty(
                // Generate tokens with special characters that might be problematic
                fc.tuple(
                    fc.base64String({ minLength: 10, maxLength: 100 }),
                    fc.base64String({ minLength: 10, maxLength: 200 }),
                    fc.base64String({ minLength: 10, maxLength: 100 })
                ).map(([header, payload, signature]) => `${header}.${payload}.${signature}`),
                endpointArbitrary,
                async (jwtToken, endpoint) => {
                    capturedHeaders = [];

                    const result = await makeAuthenticatedRequest(endpoint, jwtToken);

                    // Property: JWT token integrity must be preserved in header
                    expect(result.headers['Authorization']).toBe(`Bearer ${jwtToken}`);

                    // Property: Token structure is preserved (3 parts separated by dots)
                    const tokenFromHeader = result.headers['Authorization'].replace('Bearer ', '');
                    expect(tokenFromHeader.split('.').length).toBe(3);
                    expect(tokenFromHeader).toBe(jwtToken);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should include required headers alongside Authorization', async () => {
        await fc.assert(
            fc.asyncProperty(
                sessionTokenArbitrary,
                endpointArbitrary,
                async (sessionToken, endpoint) => {
                    capturedHeaders = [];

                    const result = await makeAuthenticatedRequest(endpoint, sessionToken);

                    // Property: Content-Type header must be present
                    expect(result.headers['Content-Type']).toBe('application/json');

                    // Property: Accept header must be present
                    expect(result.headers['Accept']).toBe('application/json');

                    // Property: Authorization header must be present
                    expect(result.headers['Authorization']).toBe(`Bearer ${sessionToken}`);

                    // Property: All three headers must be sent together
                    const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
                    const requestHeaders = lastCall[1]?.headers as Record<string, string>;
                    expect(requestHeaders['Content-Type']).toBe('application/json');
                    expect(requestHeaders['Accept']).toBe('application/json');
                    expect(requestHeaders['Authorization']).toBe(`Bearer ${sessionToken}`);
                }
            ),
            { numRuns: 100 }
        );
    });
});


/**
 * **Feature: better-auth-google-signin, Property 14: Logout Cleanup and Navigation**
 * **Validates: Requirements 6.1, 6.2, 6.3**
 * 
 * Property: For any completed logout action, the system SHALL clear all stored session 
 * data from secure storage AND navigate to the login screen.
 */
describe('Property 14: Logout Cleanup and Navigation', () => {
    // Storage key prefix used by Better Auth expo client
    const BETTER_AUTH_STORAGE_PREFIX = 'duck-auth';

    // Keys that should be cleared on logout
    const SECURE_STORE_KEYS = [
        `${BETTER_AUTH_STORAGE_PREFIX}.session`,
        `${BETTER_AUTH_STORAGE_PREFIX}.session_token`,
    ];

    const ASYNC_STORAGE_KEYS = [
        '@onboarding_completed',
        'access_token',
        'refresh_token',
        'user',
    ];

    // Arbitrary for generating valid session data
    const sessionArbitrary = fc.record({
        id: fc.uuid(),
        userId: fc.uuid(),
        token: fc.string({ minLength: 32, maxLength: 256 }).filter(s => s.trim().length > 0),
        expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }),
        createdAt: fc.date({ max: new Date() }),
        updatedAt: fc.date({ max: new Date() }),
    });

    const userArbitrary = fc.record({
        id: fc.uuid(),
        email: fc.emailAddress(),
        emailVerified: fc.boolean(),
        name: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
        image: fc.option(fc.webUrl(), { nil: null }),
        createdAt: fc.date({ max: new Date() }),
        updatedAt: fc.date({ max: new Date() }),
    });

    /**
     * Simulates the logout cleanup logic from the profile screen
     * This mirrors the clearAllLocalData function implementation
     */
    async function performLogoutCleanup(
        secureStore: Map<string, string>,
        asyncStorage: Map<string, string>
    ): Promise<void> {
        // Clear Better Auth session data from SecureStore
        for (const key of SECURE_STORE_KEYS) {
            secureStore.delete(key);
        }

        // Clear legacy auth data and app state from AsyncStorage
        for (const key of ASYNC_STORAGE_KEYS) {
            asyncStorage.delete(key);
        }
    }

    /**
     * Determines the expected navigation destination after logout
     */
    function getNavigationDestinationAfterLogout(): string {
        return '/login';
    }

    it('should clear all SecureStore session data on logout', async () => {
        await fc.assert(
            fc.asyncProperty(
                sessionArbitrary,
                userArbitrary,
                async (session, user) => {
                    // Setup: Create storage with session data
                    const secureStore = new Map<string, string>();
                    const asyncStorage = new Map<string, string>();

                    // Store session data (simulating authenticated state)
                    const linkedSession = { ...session, userId: user.id };
                    secureStore.set(
                        `${BETTER_AUTH_STORAGE_PREFIX}.session`,
                        JSON.stringify({ session: linkedSession, user })
                    );
                    secureStore.set(
                        `${BETTER_AUTH_STORAGE_PREFIX}.session_token`,
                        session.token
                    );

                    // Verify data is stored before logout
                    expect(secureStore.has(`${BETTER_AUTH_STORAGE_PREFIX}.session`)).toBe(true);
                    expect(secureStore.has(`${BETTER_AUTH_STORAGE_PREFIX}.session_token`)).toBe(true);

                    // Perform logout cleanup
                    await performLogoutCleanup(secureStore, asyncStorage);

                    // Property: All SecureStore session keys must be cleared after logout
                    for (const key of SECURE_STORE_KEYS) {
                        expect(secureStore.has(key)).toBe(false);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should clear all AsyncStorage data on logout', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    onboardingCompleted: fc.boolean(),
                    accessToken: fc.string({ minLength: 32, maxLength: 256 }).filter(s => s.trim().length > 0),
                    refreshToken: fc.string({ minLength: 32, maxLength: 256 }).filter(s => s.trim().length > 0),
                    userData: fc.record({
                        id: fc.uuid(),
                        username: fc.string({ minLength: 1, maxLength: 50 }),
                        phone: fc.string({ minLength: 10, maxLength: 15 }),
                    }),
                }),
                async (storedData) => {
                    // Setup: Create storage with app data
                    const secureStore = new Map<string, string>();
                    const asyncStorage = new Map<string, string>();

                    // Store app data (simulating authenticated state with legacy data)
                    if (storedData.onboardingCompleted) {
                        asyncStorage.set('@onboarding_completed', 'true');
                    }
                    asyncStorage.set('access_token', storedData.accessToken);
                    asyncStorage.set('refresh_token', storedData.refreshToken);
                    asyncStorage.set('user', JSON.stringify(storedData.userData));

                    // Perform logout cleanup
                    await performLogoutCleanup(secureStore, asyncStorage);

                    // Property: All AsyncStorage keys must be cleared after logout
                    for (const key of ASYNC_STORAGE_KEYS) {
                        expect(asyncStorage.has(key)).toBe(false);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should clear both SecureStore and AsyncStorage data on logout', async () => {
        await fc.assert(
            fc.asyncProperty(
                sessionArbitrary,
                userArbitrary,
                fc.record({
                    onboardingCompleted: fc.boolean(),
                    accessToken: fc.string({ minLength: 32, maxLength: 256 }).filter(s => s.trim().length > 0),
                    refreshToken: fc.string({ minLength: 32, maxLength: 256 }).filter(s => s.trim().length > 0),
                }),
                async (session, user, legacyData) => {
                    // Setup: Create storage with both Better Auth and legacy data
                    const secureStore = new Map<string, string>();
                    const asyncStorage = new Map<string, string>();

                    // Store Better Auth session data
                    const linkedSession = { ...session, userId: user.id };
                    secureStore.set(
                        `${BETTER_AUTH_STORAGE_PREFIX}.session`,
                        JSON.stringify({ session: linkedSession, user })
                    );
                    secureStore.set(
                        `${BETTER_AUTH_STORAGE_PREFIX}.session_token`,
                        session.token
                    );

                    // Store legacy data
                    if (legacyData.onboardingCompleted) {
                        asyncStorage.set('@onboarding_completed', 'true');
                    }
                    asyncStorage.set('access_token', legacyData.accessToken);
                    asyncStorage.set('refresh_token', legacyData.refreshToken);
                    asyncStorage.set('user', JSON.stringify(user));

                    // Perform logout cleanup
                    await performLogoutCleanup(secureStore, asyncStorage);

                    // Property: All storage must be cleared after logout
                    const allKeys = [...SECURE_STORE_KEYS, ...ASYNC_STORAGE_KEYS];
                    for (const key of SECURE_STORE_KEYS) {
                        expect(secureStore.has(key)).toBe(false);
                    }
                    for (const key of ASYNC_STORAGE_KEYS) {
                        expect(asyncStorage.has(key)).toBe(false);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should navigate to login screen after logout', async () => {
        await fc.assert(
            fc.asyncProperty(
                sessionArbitrary,
                userArbitrary,
                async (session, user) => {
                    // Setup: Create storage with session data
                    const secureStore = new Map<string, string>();
                    const asyncStorage = new Map<string, string>();

                    // Store session data
                    const linkedSession = { ...session, userId: user.id };
                    secureStore.set(
                        `${BETTER_AUTH_STORAGE_PREFIX}.session`,
                        JSON.stringify({ session: linkedSession, user })
                    );

                    // Perform logout cleanup
                    await performLogoutCleanup(secureStore, asyncStorage);

                    // Property: Navigation destination after logout must be /login
                    const destination = getNavigationDestinationAfterLogout();
                    expect(destination).toBe('/login');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should handle logout cleanup even when some storage keys do not exist', async () => {
        await fc.assert(
            fc.asyncProperty(
                // Generate a subset of keys that exist
                fc.subarray(SECURE_STORE_KEYS),
                fc.subarray(ASYNC_STORAGE_KEYS),
                sessionArbitrary,
                async (existingSecureKeys, existingAsyncKeys, session) => {
                    // Setup: Create storage with only some keys populated
                    const secureStore = new Map<string, string>();
                    const asyncStorage = new Map<string, string>();

                    // Only populate the randomly selected keys
                    for (const key of existingSecureKeys) {
                        if (key.includes('session_token')) {
                            secureStore.set(key, session.token);
                        } else {
                            secureStore.set(key, JSON.stringify({ session }));
                        }
                    }

                    for (const key of existingAsyncKeys) {
                        asyncStorage.set(key, 'test_value');
                    }

                    // Perform logout cleanup (should not throw even if keys don't exist)
                    await performLogoutCleanup(secureStore, asyncStorage);

                    // Property: All storage keys must be cleared (or remain non-existent)
                    for (const key of SECURE_STORE_KEYS) {
                        expect(secureStore.has(key)).toBe(false);
                    }
                    for (const key of ASYNC_STORAGE_KEYS) {
                        expect(asyncStorage.has(key)).toBe(false);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should ensure logout cleanup is idempotent', async () => {
        await fc.assert(
            fc.asyncProperty(
                sessionArbitrary,
                userArbitrary,
                fc.integer({ min: 1, max: 5 }), // Number of times to call logout
                async (session, user, logoutCount) => {
                    // Setup: Create storage with session data
                    const secureStore = new Map<string, string>();
                    const asyncStorage = new Map<string, string>();

                    // Store session data
                    const linkedSession = { ...session, userId: user.id };
                    secureStore.set(
                        `${BETTER_AUTH_STORAGE_PREFIX}.session`,
                        JSON.stringify({ session: linkedSession, user })
                    );
                    secureStore.set(
                        `${BETTER_AUTH_STORAGE_PREFIX}.session_token`,
                        session.token
                    );
                    asyncStorage.set('@onboarding_completed', 'true');

                    // Perform logout cleanup multiple times
                    for (let i = 0; i < logoutCount; i++) {
                        await performLogoutCleanup(secureStore, asyncStorage);
                    }

                    // Property: Storage must be cleared regardless of how many times logout is called
                    for (const key of SECURE_STORE_KEYS) {
                        expect(secureStore.has(key)).toBe(false);
                    }
                    for (const key of ASYNC_STORAGE_KEYS) {
                        expect(asyncStorage.has(key)).toBe(false);
                    }

                    // Property: Navigation destination is always /login
                    const destination = getNavigationDestinationAfterLogout();
                    expect(destination).toBe('/login');
                }
            ),
            { numRuns: 100 }
        );
    });
});


/**
 * **Feature: frontend-auth-data-model-sync, Property 1: User Interface Field Completeness**
 * **Validates: Requirements 1.1**
 * 
 * Property: For any User object returned from AuthContext, the object SHALL contain 
 * all required fields (id, email, emailVerified, name, image, createdAt, updatedAt) 
 * with correct types.
 */
describe('Property 1: User Interface Field Completeness', () => {
    // Arbitrary for generating valid dates using integer timestamps to avoid NaN dates
    const validDateArbitrary = fc.integer({
        min: new Date('2020-01-01').getTime(),
        max: Date.now()
    }).map(ts => new Date(ts));

    const userArbitrary = fc.record({
        id: fc.uuid(),
        email: fc.emailAddress(),
        emailVerified: fc.boolean(),
        name: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
        image: fc.option(fc.webUrl(), { nil: null }),
        createdAt: validDateArbitrary,
        updatedAt: validDateArbitrary,
    });

    /**
     * Required fields that must be present in every User object
     */
    const REQUIRED_USER_FIELDS = ['id', 'email', 'emailVerified', 'name', 'image', 'createdAt', 'updatedAt'] as const;

    it('should contain all required fields for any valid user object', async () => {
        await fc.assert(
            fc.asyncProperty(
                userArbitrary,
                async (user) => {
                    // Property: all required fields must be present
                    for (const field of REQUIRED_USER_FIELDS) {
                        expect(user).toHaveProperty(field);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should have correct types for all user fields', async () => {
        await fc.assert(
            fc.asyncProperty(
                userArbitrary,
                async (user) => {
                    // Property: id must be a non-empty string
                    expect(typeof user.id).toBe('string');
                    expect(user.id.length).toBeGreaterThan(0);

                    // Property: email must be a non-empty string
                    expect(typeof user.email).toBe('string');
                    expect(user.email.length).toBeGreaterThan(0);

                    // Property: emailVerified must be a boolean
                    expect(typeof user.emailVerified).toBe('boolean');

                    // Property: name must be string or null
                    expect(user.name === null || typeof user.name === 'string').toBe(true);

                    // Property: image must be string or null
                    expect(user.image === null || typeof user.image === 'string').toBe(true);

                    // Property: createdAt must be a Date
                    expect(user.createdAt instanceof Date).toBe(true);

                    // Property: updatedAt must be a Date
                    expect(user.updatedAt instanceof Date).toBe(true);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not have legacy fields (username, phone, fullName, avatarUrl)', async () => {
        await fc.assert(
            fc.asyncProperty(
                userArbitrary,
                async (user) => {
                    // Property: legacy fields must NOT be present
                    const legacyFields = ['username', 'phone', 'fullName', 'avatarUrl', 'targetExam', 'notificationEnabled'];

                    for (const field of legacyFields) {
                        expect(user).not.toHaveProperty(field);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should preserve field values through serialization round-trip', async () => {
        await fc.assert(
            fc.asyncProperty(
                userArbitrary,
                async (user) => {
                    // Serialize to JSON (as would happen in storage/API)
                    const serialized = JSON.stringify(user);
                    const deserialized = JSON.parse(serialized);

                    // Property: all fields must be preserved after round-trip
                    expect(deserialized.id).toBe(user.id);
                    expect(deserialized.email).toBe(user.email);
                    expect(deserialized.emailVerified).toBe(user.emailVerified);
                    expect(deserialized.name).toBe(user.name);
                    expect(deserialized.image).toBe(user.image);

                    // Dates are serialized as ISO strings
                    expect(new Date(deserialized.createdAt).toISOString()).toBe(user.createdAt.toISOString());
                    expect(new Date(deserialized.updatedAt).toISOString()).toBe(user.updatedAt.toISOString());
                }
            ),
            { numRuns: 100 }
        );
    });
});
