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
    };

    if (isLoadingCurrentUser) {
        return <Typography>Checking user...</Typography>;
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
        <Stack
            spacing={3}
            sx={{
                mt: 3,
                maxWidth: 750,
                mx: 'auto',
                width: '100%'
            }}
        >
            <Stack
                direction="row"

                sx={{
                    alignItems: 'center',             // CSS
                    justifyContent: 'space-between'   // CSS
                }}
            >
                <Typography variant="h4">
                    Notifications
                </Typography>

                <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    size="small"
                    sx={{ ml: 2 }}
                >
                    Back to Current Price
                </Button>
            </Stack>

            {notifications?.length === 0 ? (
                <Alert severity="info">
                    No notifications yet.
                </Alert>
            ) : (
                <Stack
                    spacing={1.5}
                    sx={{
                        maxHeight: 500,
                        overflowY: 'auto',
                        pr: 1
                    }}
                >
                    {notifications?.map((notification) => (
                        <Stack
                            key={notification.id}
                            spacing={1.5}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: notification.isRead
                                    ? 'divider'
                                    : 'warning.main',
                                backgroundColor: notification.isRead
                                    ? 'background.paper'
                                    : 'action.hover',
                                opacity: notification.isRead ? 0.7 : 1,
                                transition: '0.2s'
                            }}
                        >
                            <Stack
                                spacing={2}
                                sx={{
                                    alignItems: {
                                        xs: 'flex-start',
                                        sm: 'center'
                                    },
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Stack spacing={0.5}>
                                    <Typography
                                        variant="h6"
                                        color={
                                            notification.condition === 'Above'
                                                ? 'success.main'
                                                : 'error.main'
                                        }
                                    >
                                        Price {notification.condition.toLowerCase()} target
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Target: ${notification.targetPrice}
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700 }}
                                >
                                    ${notification.triggeredPrice}
                                </Typography>

                                <Chip
                                    label={notification.isRead ? 'Read' : 'Mark as read'}
                                    size="small"
                                    variant={notification.isRead ? 'outlined' : 'filled'}
                                    color={notification.isRead ? 'default' : 'warning'}
                                    clickable={!notification.isRead}
                                    onClick={
                                        !notification.isRead
                                            ? () => handleUpdateIsRead(notification.id)
                                            : undefined
                                    }
                                />
                            </Stack>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Triggered {new Date(notification.createdAt).toLocaleString()}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}

export default NotificationsPage;