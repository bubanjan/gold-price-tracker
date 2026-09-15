import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';

import {
    deleteGoldPriceHistory,
    getGoldPriceHistory
} from '../api/goldPriceApi';

export const useGoldPriceHistory = (
    page: number,
    pageSize: number
) => {
    return useQuery({
        queryKey: ['goldPriceHistory', page, pageSize],
        queryFn: () => getGoldPriceHistory(page, pageSize),
        placeholderData: keepPreviousData,
    });
};

export const useDeleteGoldPriceHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteGoldPriceHistory,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['goldPriceHistory']
            });
        },
    });
};