import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendInvitation, verifyInvitation, getPendingInvitations, rejectInvitation } from '../services/invitationService';
import { toast } from 'sonner';

export const useSendInvitation = () => {
    return useMutation({
        mutationFn: sendInvitation,
        onSuccess: () => {
            toast.success("Invitation sent successfully!");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to send invitation.");
        }
    });
};

export const useVerifyInvitation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: verifyInvitation,
        onSuccess: () => {
            toast.success("Invitation verified and enrollment successful!");
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['invitations', 'pending'] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to verify invitation.");
        }
    });
};

export const usePendingInvitations = (email) => {
    return useQuery({
        queryKey: ['invitations', 'pending', email],
        queryFn: () => getPendingInvitations(email),
        enabled: !!email
    });
};

export const useRejectInvitation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectInvitation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations', 'pending'] });
        }
    });
};
