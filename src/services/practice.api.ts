import { apiClient } from './api-client';

export enum QuestionPreferenceType {
    BALANCED = 'balanced',
    ADAPTIVE = 'adaptive',
    WEAK_AREA = 'weak_area',
    HARD_CORE = 'hard_core',
    SUBJECT_FOCUS = 'subject_focus',
}

export interface CreateSessionDto {
    sessionType: QuestionPreferenceType;
    difficulty?: number;
    subjectIds: string[]
}

export interface SubmitAnswerDto {
    questionId: string;
    selectedOptionId?: string;
    timeSpentSeconds: number;
}

export interface QuestionResponseDto {
    id: string;
    topicId: string;
    questionText: string;
    explanation?: string;
    difficulty: number;
    isActive: boolean;
    createdAt: string;
    answerOptions: {
        id: string;
        questionId: string;
        optionText: string;
        isCorrect?: boolean; // Only shown if answered or in practice mode depending on logic
        displayOrder: number;
    }[];
}

export interface PracticeSessionResponseDto {
    id: string;
    userId: string;
    sessionType: string;
    topicId: string;
    totalQuestions: number;
    questionsAttempted: number;
    correctAnswers: number;
    wrongAnswers: number;
    accuracy: number;
    xpEarned: number;
    status: 'active' | 'completed' | 'abandoned';
    timeSpentSeconds: number;
    createdAt: string;
    completedAt?: string;
    questions?: QuestionResponseDto[];
}

export interface SessionAnswerResponseDto {
    id: string;
    sessionId: string;
    questionId: string;
    selectedOptionId?: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
    answeredAt: string;
}

class PracticeAPI {
    /**
     * Create a new practice session
     */
    async createSession(data: CreateSessionDto): Promise<PracticeSessionResponseDto> {
        return await apiClient.post<PracticeSessionResponseDto>('/practice/sessions', { subjectIds: data.subjectIds, type: data.sessionType, difficulty: data.difficulty });
    }

    /**
     * Get active practice session
     */
    async getActiveSession(): Promise<PracticeSessionResponseDto | null> {
        // The backend returns null (200 OK with null body) or 204 No Content if no session
        // Our apiClient handles 204 by returning empty object, but we expect null
        const session = await apiClient.get<PracticeSessionResponseDto | null>('/practice/sessions/active');
        // Check if session is empty object (from 204) or null
        if (!session || Object.keys(session).length === 0) {
            return null;
        }
        return session;
    }

    /**
     * Get a specific practice session
     */
    async getSession(sessionId: string): Promise<PracticeSessionResponseDto> {
        return await apiClient.get<PracticeSessionResponseDto>(`/practice/sessions/${sessionId}`);
    }

    /**
     * Submit an answer to a question in a session
     */
    async submitAnswer(sessionId: string, data: SubmitAnswerDto): Promise<SessionAnswerResponseDto> {
        return await apiClient.post<SessionAnswerResponseDto>(`/practice/sessions/${sessionId}/answers`, data);
    }

    /**
     * Complete a practice session
     */
    async completeSession(sessionId: string): Promise<PracticeSessionResponseDto> {
        return await apiClient.post<PracticeSessionResponseDto>(`/practice/sessions/${sessionId}/complete`);
    }
}

export const practiceAPI = new PracticeAPI();
