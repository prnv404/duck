import { apiClient } from './api-client';

export interface SubjectResponseDto {
    id: string;
    name: string;
    iconUrl?: string;
    colorCode?: string;
    displayOrder: number;
    weightage: number;
    is_active_in_random: boolean;
    createdAt: string;
}

export interface TopicResponseDto {
    id: string;
    subjectId: string;
    name: string;
    description?: string;
    displayOrder: number;
    is_active_in_random: boolean;
    weightage: number;
    createdAt: string;
}

export interface SubjectAccuracyResponseDto {
    subjectId: string;
    subjectName: string;
    accuracy: number;
    performance: 'weak' | 'average' | 'strong';
}

class CurriculumAPI {
    /**
     * Get all subjects
     */
    async getSubjects(): Promise<SubjectResponseDto[]> {
        return await apiClient.get<SubjectResponseDto[]>('/curriculum/subjects');
    }

    /**
     * Get subject by ID
     */
    async getSubjectById(id: string): Promise<SubjectResponseDto> {
        return await apiClient.get<SubjectResponseDto>(`/curriculum/subjects/${id}`);
    }

    /**
     * Get topics by subject ID
     */
    async getTopicsBySubjectId(subjectId: string): Promise<TopicResponseDto[]> {
        return await apiClient.get<TopicResponseDto[]>(`/curriculum/subjects/${subjectId}/topics`);
    }

    /**
     * Get topic by ID
     */
    async getTopicById(id: string): Promise<TopicResponseDto> {
        return await apiClient.get<TopicResponseDto>(`/curriculum/topics/${id}`);
    }

    /**
     * Get user's subject-wise accuracy
     */
    async getMySubjectAccuracy(): Promise<SubjectAccuracyResponseDto[]> {
        return await apiClient.get<SubjectAccuracyResponseDto[]>('/curriculum/my-accuracy');
    }
}

export const curriculumAPI = new CurriculumAPI();
