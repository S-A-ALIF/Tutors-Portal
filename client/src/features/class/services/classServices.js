import apiClient from '../../../services/apiClient';

export const createClass = async (classData) => {
    try {
        const response = await apiClient.post('/classes', classData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getClasses = async (instId = null) => {
    try {
        const url = instId ? `/classes?inst_id=${instId}` : '/classes';
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
