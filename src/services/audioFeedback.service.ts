import { createAudioPlayer, AudioSource } from 'expo-audio';

// Audio sources
const correctSoundFile = require('../../assets/audio/correct.mp3') as AudioSource;
const incorrectSoundFile = require('../../assets/audio/incorrect.mp3') as AudioSource;

// Global audio singleton service using expo-audio
class AudioFeedbackService {
    private static instance: AudioFeedbackService;
    private isLoaded = false;
    private correctPlayer: ReturnType<typeof createAudioPlayer> | null = null;
    private incorrectPlayer: ReturnType<typeof createAudioPlayer> | null = null;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    static getInstance(): AudioFeedbackService {
        if (!AudioFeedbackService.instance) {
            AudioFeedbackService.instance = new AudioFeedbackService();
        }
        return AudioFeedbackService.instance;
    }

    async load() {
        if (this.isLoaded) return;

        try {
            // Create audio players for both sounds
            this.correctPlayer = createAudioPlayer(correctSoundFile);
            this.incorrectPlayer = createAudioPlayer(incorrectSoundFile);

            this.isLoaded = true;
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    }

    async playCorrect() {
        if (!this.correctPlayer) {
            await this.load();
        }

        try {
            if (this.correctPlayer) {
                // Seek to start and play
                this.correctPlayer.seekTo(0);
                this.correctPlayer.play();
            }
        } catch (error) {
            console.warn('Could not play correct sound:', error);
        }
    }

    async playIncorrect() {
        if (!this.incorrectPlayer) {
            await this.load();
        }

        try {
            if (this.incorrectPlayer) {
                // Seek to start and play
                this.incorrectPlayer.seekTo(0);
                this.incorrectPlayer.play();
            }
        } catch (error) {
            console.warn('Could not play incorrect sound:', error);
        }
    }

    async playFeedback(isCorrect: boolean) {
        if (isCorrect) {
            await this.playCorrect();
        } else {
            await this.playIncorrect();
        }
    }

    // Cleanup method if needed
    async unload() {
        try {
            if (this.correctPlayer) {
                this.correctPlayer.remove();
                this.correctPlayer = null;
            }
            if (this.incorrectPlayer) {
                this.incorrectPlayer.remove();
                this.incorrectPlayer = null;
            }
            this.isLoaded = false;
        } catch (error) {
            console.warn('Error unloading audio:', error);
        }
    }
}

// Singleton instance access
export const audioFeedbackService = AudioFeedbackService.getInstance();
