import apiClient from '../../../services/apiClient';

export const sendInvitation = async (data) => {
    try {
        const response = await apiClient.post('/invitations/send', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const verifyInvitation = async (data) => {
    try {
        const response = await apiClient.post('/invitations/verify', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
