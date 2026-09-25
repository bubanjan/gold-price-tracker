import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api/notificationsApi';

export const useNotifications = (enabled: boolean) => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        enabled: enabled
    });
};
