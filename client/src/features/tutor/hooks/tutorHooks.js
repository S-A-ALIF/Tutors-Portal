import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorQueryKeys } from '../constants/tutorQueryKeys';
import * as tutorServices from '../services/tutorServices';

export const useTutors = () => {
    return useQuery({
        queryKey: tutorQueryKeys.lists(),
        queryFn: tutorServices.getTutors,
    });
};

export const useTutor = (id) => {
    return useQuery({
        queryKey: tutorQueryKeys.detail(id),
        queryFn: () => tutorServices.getTutorById(id),
        enabled: !!id, // Only run the query if an ID is provided
    });
};

export const useCreateTutor = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: tutorServices.createTutor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tutorQueryKeys.lists() });
        },
    });
};

export const useUpdateTutor = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: tutorServices.updateTutor,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: tutorQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: tutorQueryKeys.detail(variables.id) });
        },
    });
};

export const useDeleteTutor = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: tutorServices.deleteTutor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tutorQueryKeys.lists() });
        },
    });
};