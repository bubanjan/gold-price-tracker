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

export const markNotificationAsRead = async (id: number): Promise<void> => {
    const response = await fetch(
        `${url}/${id}/read`,
        {
            method: 'PATCH',
            credentials: 'include',
        });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }
};

