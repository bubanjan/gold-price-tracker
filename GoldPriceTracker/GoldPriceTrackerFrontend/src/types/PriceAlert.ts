

export type AlertCondition = 'Above' | 'Below';

export type PriceAlert = {
    id: number;
    targetPrice: number;
    condition: AlertCondition;
    isActive: boolean;
    isTriggered: boolean;
    createdAt: string;
    triggeredAt: string | null;
};

export type CreatePriceAlertRequest = {
    targetPrice: number;
    condition: AlertCondition;
};

export type UpdatePriceAlertRequest = {
    targetPrice: number;
    condition: AlertCondition;
    isActive: boolean;
};
