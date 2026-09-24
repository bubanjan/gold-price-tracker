import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography
} from '@mui/material';

import { useCurrentUser } from '../hooks/useCurrentUser';
import { useLogout } from '../hooks/useLogout';
import LoginForm from './LoginForm';

function AuthBar() {
    const {
        data: currentUser,
        isLoading
    } = useCurrentUser();

    const logoutMutation = useLogout();

    if (isLoading) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <CircularProgress size={24} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {
                            xs: 'column',
                            md: 'row',
                        },
                        justifyContent: 'space-between',
                        alignItems: {
                            xs: 'stretch',
                            md: 'center',
                        },
                        gap: 2,
                    }}
                >
                    <Typography variant="h6">
                        Gold Price Tracker
                    </Typography>

                    {currentUser ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Typography variant="body2">
                                Logged in as {currentUser.userName}
                            </Typography>

                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                            >
                                {logoutMutation.isPending
                                    ? 'Logging out...'
                                    : 'Logout'}
                            </Button>
                        </Box>
                    ) : (
                        <LoginForm />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default AuthBar;