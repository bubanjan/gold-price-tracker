export type GoldPriceHistory = {
    id: number;
    price: number;
    currency: string;
    symbol: string;
    updatedAt: string;
    fetchedAt: string;
};

export type GoldPriceHistoryResponse = {
    items: GoldPriceHistory[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};