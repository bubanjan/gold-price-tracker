export type PriceAlert = {
    id: number;
    targetPrice: number;
    condition: string;
    isActive: boolean;
    isTriggered: boolean;
    createdAt: string;
    triggeredAt: string | null;
};

export type CreatePriceAlertRequest = {
    targetPrice: number;
    condition: string;
};

export type UpdatePriceAlertRequest = {
    targetPrice: number;
    condition: string;
    isActive: boolean;
};