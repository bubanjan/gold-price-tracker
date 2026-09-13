import type { GoldPrice } from "../types/GoldPrice";
import type { GoldPriceHistoryResponse } from "../types/GoldPriceHistory";

export const getGoldPrice = async (): Promise<GoldPrice> => {

    const response = await fetch("https://localhost:7111/api/goldprice");

    if (!response.ok) {
        throw new Error("Failed to fetch gold price");
    }

    return response.json();
}

export const getGoldPriceHistory = async (
    page: number,
    pageSize: number
): Promise<GoldPriceHistoryResponse> => {
    const response = await fetch(
        `https://localhost:7111/api/goldprice/history?page=${page}&pageSize=${pageSize}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch gold price history');
    }

    return response.json();
};

export const deleteGoldPriceHistory = async (): Promise<void> => {
    const response = await fetch(
        'https://localhost:7111/api/goldprice/history',
        {
            method: 'DELETE',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete gold price history');
    }
};