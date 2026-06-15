import apiClient from '../../../services/apiClient';

export const createExam = async (examData) => {
    try {
        const response = await apiClient.post('/exams', examData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getExams = async (instId = null) => {
    try {
        const url = instId ? `/exams?inst_id=${instId}` : '/exams';
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
