import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentQueryKeys } from '../constants/studentQueryKeys';
import * as studentServices from '../services/studentServices';

export const useStudents = (options = {}) => {
    return useQuery({
        queryKey: studentQueryKeys.lists(),
        queryFn: studentServices.getStudents,
        ...options,
    });
};

export const useStudent = (id) => {
    return useQuery({
        queryKey: studentQueryKeys.detail(id),
        queryFn: () => studentServices.getStudentById(id),
        enabled: !!id, 
    });
};

export const useCreateStudent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: studentServices.enrollStudent, // Corrected to match your service
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() });
        },
    });
};

export const useUpdateStudent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        // FIX: Destructure the single object into two arguments for the service
        mutationFn: ({ id, data }) => studentServices.updateStudent(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: studentQueryKeys.detail(variables.id) });
        },
    });
};

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: studentServices.deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() });
        },
    });
};