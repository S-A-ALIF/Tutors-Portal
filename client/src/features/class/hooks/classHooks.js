import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as classServices from '../services/classServices';

export const useCreateClass = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: classServices.createClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
    });
};

export const useClasses = (instId) => {
    return useQuery({
        queryKey: ['classes', instId],
        queryFn: () => classServices.getClasses(instId),
    });
};
