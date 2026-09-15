import { useQuery } from '@tanstack/react-query';
import { getGoldPrice } from '../api/goldPriceApi';

export const useGoldPrice = () => {
    return useQuery({
        queryKey: ['goldPrice'],
        queryFn: getGoldPrice,
        staleTime: 40000,
        refetchInterval: 60000,
    });
};