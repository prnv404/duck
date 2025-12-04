// Jest setup file for mocking React Native modules

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// Mock better-auth/react
jest.mock('better-auth/react', () => ({
    createAuthClient: jest.fn(() => ({
        signIn: { social: jest.fn() },
        signOut: jest.fn(),
        useSession: jest.fn(),
        getSession: jest.fn(),
    })),
}));

// Mock @better-auth/expo
jest.mock('@better-auth/expo', () => ({
    expoClient: jest.fn(() => ({})),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
        push: jest.fn(),
        back: jest.fn(),
    },
    useRouter: jest.fn(() => ({
        replace: jest.fn(),
        push: jest.fn(),
        back: jest.fn(),
    })),
}));

// Mock react-native Alert
jest.mock('react-native', () => ({
    Alert: {
        alert: jest.fn(),
    },
}));
