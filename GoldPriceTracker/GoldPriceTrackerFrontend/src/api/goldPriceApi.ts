import type { GoldPrice } from "../types/GoldPrice";

export const getGoldPrice = async (): Promise<GoldPrice> => {

    const response = await fetch("https://localhost:7111/api/goldprice");

    if (!response.ok) {
        throw new Error("Failed to fetch gold price");
    }

    return response.json();
}