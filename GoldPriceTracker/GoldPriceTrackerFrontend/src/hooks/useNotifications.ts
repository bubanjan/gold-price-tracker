import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationAsRead } from '../api/notificationsApi';

export const useNotifications = (enabled: boolean) => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        enabled: enabled
    });
};

export const useUpdateIsRead = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markNotificationAsRead,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications']
            });
        },
    });
};

