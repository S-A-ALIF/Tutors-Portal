import apiClient from '../../../services/apiClient';

export const getTutors = async () => {
    try {
        const response = await apiClient.get('/tutors');
        return response.data.data; 
    } catch (error) {
        console.error("Error fetching tutors:", error.response?.data || error.message);
        throw error;
    }
};

export const getTutorById = async (id) => {
    try {
        const response = await apiClient.get(`/tutors/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching tutor ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

export const createTutor = async (tutorData) => {
    try {
        const response = await apiClient.post('/tutors', tutorData);
        return response.data.data;
    } catch (error) {
        console.error("DEBUG: Error creating tutor. Payload sent from frontend:", tutorData);
        console.error("DEBUG: Server rejected with 400. Backend response:", error.response?.data || error.message);
        throw error;
    }
};

export const updateTutor = async ({ id, data }) => {
    try {
        const response = await apiClient.patch(`/tutors/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating tutor ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

export const deleteTutor = async (id) => {
    try {
        const response = await apiClient.delete(`/tutors/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting tutor ${id}:`, error.response?.data || error.message);
        throw error;
    }
};