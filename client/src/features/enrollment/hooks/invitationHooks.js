import { useMutation } from '@tanstack/react-query';
import { sendInvitation, verifyInvitation } from '../services/invitationService';
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
    return useMutation({
        mutationFn: verifyInvitation,
        onSuccess: () => {
            toast.success("Invitation verified and enrollment successful!");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to verify invitation.");
        }
    });
};
