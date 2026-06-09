import apiClient from '../../../services/apiClient';

/**
 * Service for handling Student API requests
 */

export const getStudents = async () => {
    try {
        const response = await apiClient.get('/students');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await apiClient.get(`/students/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const enrollStudent = async (studentData) => {
    try {
        const response = await apiClient.post('/students', studentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateStudent = async (id, updateData) => {
    try {
        const response = await apiClient.patch(`/students/${id}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteStudent = async (id) => {
    try {
        const response = await apiClient.delete(`/students/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};