import { useState } from 'react';
import {
    Button,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useRegister } from '../hooks/useRegister';

type RegisterFormProps = {
    onRegisterSuccess: () => void;
};


function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const registerMutation = useRegister();

    function handleRegister(): void {

        if (!userName.trim()) {
            setValidationError('Username is required.');
            return;
        }

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters.");
            return;
        }

        setValidationError('');

        registerMutation.mutate({
            userName,
            password
        },
            {
                onSuccess: () => {
                    onRegisterSuccess();
                }
            }

        );
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

                <TextField
                    label="Confirm password"
                    type="password"
                    size="small"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                >
                    {registerMutation.isPending
                        ? 'Registering...'
                        : 'Register'}
                </Button>
            </Stack>

            {validationError && (
                <Typography color="error" variant="body2">
                    {validationError}
                </Typography>
            )}
            {registerMutation.isError && (
                <Typography
                    variant="body2"
                    color="error"
                >
                    {registerMutation.error.message}
                </Typography>
            )}
        </Stack>
    );
}

export default RegisterForm;