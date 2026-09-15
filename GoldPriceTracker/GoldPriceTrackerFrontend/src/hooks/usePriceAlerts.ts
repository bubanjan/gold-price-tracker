import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';

import {
    createPriceAlert,
    deletePriceAlert,
    getPriceAlerts,
    updatePriceAlert
} from '../api/priceAlertsApi';

export const usePriceAlerts = () => {
    return useQuery({
        queryKey: ['priceAlerts'],
        queryFn: getPriceAlerts,
        refetchInterval: 5000,
    });
};

export const useCreatePriceAlert = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPriceAlert,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['priceAlerts']
            });
        },
    });
};

export const useUpdatePriceAlert = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePriceAlert,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['priceAlerts']
            });
        },
    });
};

export const useDeletePriceAlert = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePriceAlert,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['priceAlerts']
            });
        },
    });
};