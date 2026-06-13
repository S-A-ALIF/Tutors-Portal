import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStudentWithEnrollment } from '../services/enrollmentService';

export const useEnrollStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addStudentWithEnrollment,
        onSuccess: () => {
            // Invalidate queries to refresh any lists in the UI automatically
            queryClient.invalidateQueries({ queryKey: ['students'] });
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
        },
        onError: (error) => {
            console.error("Failed to enroll student:", error);
        }
    });
};