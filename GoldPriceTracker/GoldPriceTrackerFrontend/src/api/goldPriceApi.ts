import type { GoldPrice } from "../types/GoldPrice";
import type { GoldPriceHistoryResponse } from "../types/GoldPriceHistory";

const url = "https://localhost:7111/api/goldprice";

export const getGoldPrice = async (): Promise<GoldPrice> => {

    const response = await fetch(url);

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
        `${url}/history?page=${page}&pageSize=${pageSize}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch gold price history');
    }

    return response.json();
};

export const deleteGoldPriceHistory = async (): Promise<void> => {
    const response = await fetch(
        `${url}/history`,
        {
            method: 'DELETE',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete gold price history');
    }
};

export const getGoldPriceChart = async (
    hours: number
): Promise<GoldPrice[]> => {

    const response = await fetch(
        `${url}/chart?hours=${hours}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch gold price chart');
    }

    return response.json();
};