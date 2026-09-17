import { useQuery } from "@tanstack/react-query";
import { getGoldPriceChart } from "../api/goldPriceApi";

export const useGoldPriceChart = (hours: number) => {
    return useQuery({
        queryKey: ['goldPriceChart', hours],
        queryFn: () => getGoldPriceChart(hours),
    });
};