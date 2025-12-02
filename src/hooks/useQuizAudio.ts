import { useEffect, useRef } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';

interface UseQuizAudioProps {
    audioUrl?: string;
    isEnabled: boolean;
    autoPlay?: boolean;
    speed?: number;
}

interface UseQuizAudioReturn {
    play: () => void;
    stop: () => void;
    replay: () => void;
    isPlaying: boolean;
}

export const useQuizAudio = ({
    audioUrl,
    isEnabled,
    autoPlay = true,
    speed = 1.0,
}: UseQuizAudioProps): UseQuizAudioReturn => {
    const audioSource: AudioSource | null = audioUrl ? { uri: audioUrl } : null;
    const player = useAudioPlayer(audioSource || '');
    const previousUrlRef = useRef<string | undefined>(undefined);

    // Update playback rate when speed changes
    useEffect(() => {
        if (player) {
            player.setPlaybackRate(speed);
        }
    }, [speed, player]);

    // Auto-play when question changes (new audioUrl) and audio is enabled
    useEffect(() => {
        if (!audioUrl || !isEnabled || !autoPlay) {
            return;
        }

        // Only play if this is a new question (URL changed)
        if (audioUrl !== previousUrlRef.current) {
            previousUrlRef.current = audioUrl;

            // Small delay to ensure player is ready
            const timeoutId = setTimeout(() => {
                try {
                    player.setPlaybackRate(speed);
                    player.seekTo(0);
                    player.play();
                } catch (error) {
                    console.error('Error auto-playing audio:', error);
                }
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [audioUrl, isEnabled, autoPlay, speed]);

    // Update ref when URL changes
    useEffect(() => {
        previousUrlRef.current = audioUrl;
    }, [audioUrl]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            try {
                player.pause();
            } catch (error) {
                // Ignore cleanup errors
            }
        };
    }, []);

    const play = () => {
        if (!audioUrl || !isEnabled) return;

        try {
            player.setPlaybackRate(speed);
            player.play();
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const stop = () => {
        try {
            player.pause();
            player.seekTo(0);
        } catch (error) {
            console.error('Error stopping audio:', error);
        }
    };

    const replay = () => {
        if (!audioUrl || !isEnabled) return;

        try {
            player.setPlaybackRate(speed);
            player.seekTo(0);
            player.play();
        } catch (error) {
            console.error('Error replaying audio:', error);
        }
    };

    return {
        play,
        stop,
        replay,
        isPlaying: player.playing,
    };
};
