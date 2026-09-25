import type { AlertCondition } from "./PriceAlert";

export type UserNotification = {
    id: number;
    targetPrice: number;
    triggeredPrice: number;
    condition: AlertCondition;
    isRead: boolean;
    createdAt: string;
    userId: number;
    priceAlertId: number;
}