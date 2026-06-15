import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as examServices from '../services/examServices';

export const useCreateExam = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: examServices.createExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
};

export const useExams = (instId) => {
    return useQuery({
        queryKey: ['exams', instId],
        queryFn: () => examServices.getExams(instId),
    });
};
