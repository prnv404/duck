import { Audio } from 'expo-av';

// Audio sources
const correctSoundFile = require('../../assets/audio/correct.mp3');
const incorrectSoundFile = require('../../assets/audio/incorrect.mp3');

// Global audio singleton service using expo-av
class AudioFeedbackService {
    private static instance: AudioFeedbackService;
    private isConfigured = false;
    private isLoaded = false;
    private correctSound: Audio.Sound | null = null;
    private incorrectSound: Audio.Sound | null = null;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    static getInstance(): AudioFeedbackService {
        if (!AudioFeedbackService.instance) {
            AudioFeedbackService.instance = new AudioFeedbackService();
        }
        return AudioFeedbackService.instance;
    }

    async configure() {
        if (this.isConfigured) return;

        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
            });
            this.isConfigured = true;
        } catch (error) {
            console.error('Error setting up audio mode:', error);
        }
    }

    async load() {
        if (this.isLoaded) return;

        try {
            // Configure audio mode first
            await this.configure();

            // Load sounds
            const { sound: correctSound } = await Audio.Sound.createAsync(correctSoundFile);
            const { sound: incorrectSound } = await Audio.Sound.createAsync(incorrectSoundFile);

            this.correctSound = correctSound;
            this.incorrectSound = incorrectSound;

            this.isLoaded = true;
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    }

    async playCorrect() {
        if (!this.correctSound) {
            await this.load();
        }

        try {
            if (this.correctSound) {
                await this.correctSound.setPositionAsync(0);
                await this.correctSound.playAsync();
            }
        } catch (error) {
            console.warn('Could not play correct sound:', error);
        }
    }

    async playIncorrect() {
        if (!this.incorrectSound) {
            await this.load();
        }

        try {
            if (this.incorrectSound) {
                await this.incorrectSound.setPositionAsync(0);
                await this.incorrectSound.playAsync();
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
            if (this.correctSound) {
                await this.correctSound.unloadAsync();
                this.correctSound = null;
            }
            if (this.incorrectSound) {
                await this.incorrectSound.unloadAsync();
                this.incorrectSound = null;
            }
            this.isLoaded = false;
        } catch (error) {
            console.warn('Error unloading audio:', error);
        }
    }
}

// Singleton instance access
export const audioFeedbackService = AudioFeedbackService.getInstance();
