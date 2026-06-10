import apiClient from '../../../services/apiClient';

export const getTutors = async () => {
    const response = await apiClient.get('/tutors');
    // Assuming your backend sends responses in the format: { status: 'success', data: [...] }
    return response.data.data; 
};

export const getTutorById = async (id) => {
    const response = await apiClient.get(`/tutors/${id}`);
    return response.data.data;
};

export const createTutor = async (tutorData) => {
    const response = await apiClient.post('/tutors', tutorData);
    return response.data.data;
};

export const updateTutor = async ({ id, data }) => {
    const response = await apiClient.patch(`/tutors/${id}`, data);
    return response.data.data;
};

export const deleteTutor = async (id) => {
    const response = await apiClient.delete(`/tutors/${id}`);
    return response.data;
};