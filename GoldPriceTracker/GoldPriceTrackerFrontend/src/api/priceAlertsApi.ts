import type {
    CreatePriceAlertRequest,
    PriceAlert,
    UpdatePriceAlertRequest
} from '../types/PriceAlert';

const url = 'https://localhost:7111/api/pricealerts';

type ApiError = {
    title?: string;
    errors?: Record<string, string[]>;
};

const getErrorMessage = async (response: Response): Promise<string> => {
    try {
        const data: ApiError = await response.json();

        if (data.errors) {
            const messages = Object.values(data.errors).flat();

            return messages.join(', ');
        }

    } catch { }

    return 'Something went wrong';
};


export const getPriceAlerts = async (): Promise<PriceAlert[]> => {
    const response = await fetch(url);

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
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
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }
};