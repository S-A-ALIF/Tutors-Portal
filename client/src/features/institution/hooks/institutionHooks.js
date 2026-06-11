import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { institutionQueryKeys } from '../constants/institutionQueryKeys';
import * as institutionServices from '../services/institutionServices';

export const useInstitutions = () => {
    return useQuery({
        queryKey: institutionQueryKeys.lists(),
        queryFn: institutionServices.getInstitutions,
    });
};

export const useInstitution = (id) => {
    return useQuery({
        queryKey: institutionQueryKeys.detail(id),
        queryFn: () => institutionServices.getInstitutionById(id),
        enabled: !!id, // Only run the query if an ID is provided
    });
};

export const useCreateInstitution = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: institutionServices.createInstitution,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: institutionQueryKeys.lists() });
        },
    });
};

export const useUpdateInstitution = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: institutionServices.updateInstitution,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: institutionQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: institutionQueryKeys.detail(variables.id) });
        },
    });
};

export const useDeleteInstitution = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: institutionServices.deleteInstitution,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: institutionQueryKeys.lists() });
        },
    });
};