import { useState } from 'react';
import {
    Button,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useLogin } from '../hooks/useLogin';

function LoginForm() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useLogin();

    function handleLogin(): void {
        loginMutation.mutate({
            userName,
            password
        });
    }

    return (
        <Stack spacing={1}>
            <Stack
                direction={{
                    xs: 'column',
                    sm: 'row',
                }}
                spacing={1.5}
                sx={{
                    alignItems: {
                        xs: 'stretch',
                        sm: 'center',
                    },
                }}
            >
                <TextField
                    label="Username"
                    size="small"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending
                        ? 'Logging in...'
                        : 'Login'}
                </Button>
            </Stack>

            {loginMutation.isError && (
                <Typography
                    variant="body2"
                    color="error"
                >
                    {loginMutation.error.message}
                </Typography>
            )}
        </Stack>
    );
}

export default LoginForm;