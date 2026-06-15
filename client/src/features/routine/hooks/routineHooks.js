import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as routineServices from '../services/routineServices';

export const usePeriods = (instId) => {
    return useQuery({
        queryKey: ['routine_periods', instId],
        queryFn: () => routineServices.getPeriods(instId),
        enabled: !!instId
    });
};

export const useSetupPeriods = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: routineServices.setupPeriods,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['routine_periods'] });
        }
    });
};

export const useRoutine = (instId, dayOfWeek) => {
    return useQuery({
        queryKey: ['routine_slots', instId, dayOfWeek],
        queryFn: () => routineServices.getRoutine(instId, dayOfWeek),
        enabled: !!instId && !!dayOfWeek
    });
};

export const useSaveSlot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: routineServices.saveSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['routine_slots'] });
        }
    });
};
