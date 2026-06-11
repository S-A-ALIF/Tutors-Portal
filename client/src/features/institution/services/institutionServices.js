import apiClient from '../../../services/apiClient';

export const getInstitutions = async () => {
    const response = await apiClient.get('/institutions');
    // Assuming your backend sends responses in the format: { status: 'success', data: [...] }
    return response.data.data; 
};

export const getInstitutionById = async (id) => {
    const response = await apiClient.get(`/institutions/${id}`);
    return response.data.data;
};

export const createInstitution = async (institutionData) => {
    const response = await apiClient.post('/institutions', institutionData);
    return response.data.data;
};

export const updateInstitution = async ({ id, data }) => {
    const response = await apiClient.patch(`/institutions/${id}`, data);
    return response.data.data;
};

export const deleteInstitution = async (id) => {
    const response = await apiClient.delete(`/institutions/${id}`);
    return response.data;
};