import {
    Alert,
    Button,
    Chip,
    Stack,
    Typography
} from '@mui/material';

import { Link } from 'react-router';

import { useCurrentUser } from '../hooks/useCurrentUser';
import { useNotifications, useUpdateIsRead } from '../hooks/useNotifications';

function NotificationsPage() {

    const { data: currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();

    const {
        data: notifications,
        isLoading,
        isError
    } = useNotifications(!!currentUser);

    const updateIsReadMutation = useUpdateIsRead();

    const handleUpdateIsRead = (id: number) => {

        updateIsReadMutation.mutate(id);

    }

    if (isLoadingCurrentUser) {
        return (
            <Typography>
                Checking user...
            </Typography>
        );
    }

    if (!currentUser) {
        return (
            <Alert severity="info">
                Log in to see notifications.
            </Alert>
        );
    }

    if (isLoading) {
        return <Typography>Loading notifications...</Typography>;
    }


    if (isError) {
        return (
            <Typography color="error">
                Failed to load notifications
            </Typography>
        );
    }


    return (
        <Stack spacing={3} sx={{ mt: 2 }}>

            <Typography variant="h5">
                Notifications
            </Typography>

            <Button
                component={Link}
                to="/"
                variant="outlined"
                sx={{ mb: 2 }}
            >
                Back to Current Price
            </Button>


            {
                notifications?.length === 0 && (
                    <Typography>
                        No notifications yet.
                    </Typography>
                )
            }

            <Stack
                spacing={2}
                sx={{
                    maxHeight: 350,
                    overflowY: 'auto',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2,
                }}>
                {notifications?.map((notification) => (
                    <Stack
                        key={notification.id}
                        spacing={1}
                        sx={{
                            backgroundColor: 'darkblue',
                            border: '2px solid',
                            borderColor: 'yellow',
                            borderRadius: 2,
                            p: 2,
                            color: 'white'
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography variant="h6">
                                {notification.condition} ${notification.targetPrice}
                            </Typography>

                            <Typography variant="body1">
                                Triggered at: ${notification.triggeredPrice}
                            </Typography>

                            <Chip
                                label={
                                    notification.isRead
                                        ? 'Read'
                                        : 'Not read'
                                }

                                size="small"
                                onClick={!notification.isRead ? () => handleUpdateIsRead(notification.id) : undefined}
                                sx={{ color: notification.isRead ? "white" : "gray" }}
                            />
                        </Stack>

                        <Typography variant="body2">
                            Created:{' '}
                            {new Date(notification.createdAt).toLocaleString()}
                        </Typography>

                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
}

export default NotificationsPage;