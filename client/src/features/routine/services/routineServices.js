import apiClient from '../../../services/apiClient';

export const setupPeriods = async (payload) => {
    const { data } = await apiClient.post('/routines/periods', payload);
    return data.data;
};

export const getPeriods = async (instId) => {
    const { data } = await apiClient.get(instId ? `/routines/periods?inst_id=${instId}` : '/routines/periods');
    return data.data;
};

export const saveSlot = async (payload) => {
    const { data } = await apiClient.post('/routines/slots', payload);
    return data.data;
};

export const getRoutine = async (instId, dayOfWeek) => {
    const url = `/routines/slots?day_of_week=${dayOfWeek}${instId ? `&inst_id=${instId}` : ''}`;
    const { data } = await apiClient.get(url);
    return data.data;
};
