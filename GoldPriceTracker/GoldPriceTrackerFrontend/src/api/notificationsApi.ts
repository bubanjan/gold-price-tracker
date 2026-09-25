import type { UserNotification } from "../types/UserNotification";
import { getErrorMessage } from "./apiError";

const url = 'https://localhost:7111/api/notifications';

export const getNotifications = async (): Promise<UserNotification[]> => {
    const response = await fetch(url, {
        credentials: 'include',
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }

    return response.json();
};

/*
export const createPriceAlert = async (
    request: CreatePriceAlertRequest
): Promise<PriceAlert> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }

    return response.json();
};

export const deletePriceAlert = async (
    id: number
): Promise<void> => {
    const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }
};

type UpdatePriceAlertParams = {
    id: number;
    request: UpdatePriceAlertRequest;
};

export const updatePriceAlert = async ({
    id,
    request
}: UpdatePriceAlertParams): Promise<void> => {
    const response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }
};
*/