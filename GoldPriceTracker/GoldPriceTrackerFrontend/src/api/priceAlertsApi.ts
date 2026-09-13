import type {
    CreatePriceAlertRequest,
    PriceAlert,
    UpdatePriceAlertRequest
} from '../types/PriceAlert';

const url = 'https://localhost:7111/api/pricealerts';

export const getPriceAlerts = async (): Promise<PriceAlert[]> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch price alerts');
    }

    return response.json();
};

export const createPriceAlert = async (
    request: CreatePriceAlertRequest
): Promise<PriceAlert> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create price alert');
    }

    return response.json();
};

export const deletePriceAlert = async (id: number): Promise<void> => {
    const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete price alert');
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
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to update price alert');
    }
};