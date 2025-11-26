import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { authAPI } from '@/services/auth.api';
import { YStack, Spinner } from 'tamagui';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const isAuthenticated = await authAPI.isAuthenticated();

        if (isAuthenticated) {
            router.replace('/(tabs)');
        } else {
            router.replace('/login');
        }
    };

    return (
        <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
            <Spinner size="large" color="$blue10" />
        </YStack>
    );
}
