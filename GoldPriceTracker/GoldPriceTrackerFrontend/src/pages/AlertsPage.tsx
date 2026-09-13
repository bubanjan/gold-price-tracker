import { useState } from 'react';
import {
    Button,
    Container,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';
import {
    createPriceAlert,
    deletePriceAlert,
    getPriceAlerts,
    updatePriceAlert
} from '../api/priceAlertsApi';

import { Link } from 'react-router';


function AlertsPage() {
    const queryClient = useQueryClient();

    const [targetPrice, setTargetPrice] = useState('');
    const [condition, setCondition] = useState('Above');

    const {
        data: alerts,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['priceAlerts'],
        queryFn: getPriceAlerts,
    });

    const createMutation = useMutation({
        mutationFn: createPriceAlert,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['priceAlerts']
            });

            setTargetPrice('');
            setCondition('Above');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deletePriceAlert,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['priceAlerts']
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: updatePriceAlert,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['priceAlerts']
            });
        },
    });

    const handleCreate = () => {
        createMutation.mutate({
            targetPrice: Number(targetPrice),
            condition,
        });
    };

    if (isLoading) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography>Loading alerts...</Typography>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography color="error">
                    Failed to load alerts
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Price Alerts
            </Typography>

            <Button
                component={Link}
                to="/"
                variant="outlined"
                sx={{ mb: 2 }}
            >
                Back to Current Price
            </Button>

            <Stack spacing={2} sx={{ mb: 4 }}>
                <TextField
                    label="Target price"
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                />

                <TextField
                    select
                    label="Condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                >
                    <MenuItem value="Above">Above</MenuItem>
                    <MenuItem value="Below">Below</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending
                        ? 'Creating...'
                        : 'Create Alert'}
                </Button>
            </Stack>

            <Stack spacing={1}>
                {alerts?.map((alert) => (
                    <Stack
                        key={alert.id}
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: 'center' }}
                    >
                        <Typography>
                            {alert.condition} ${alert.targetPrice}
                            {' - '}
                            {alert.isActive ? 'Active' : 'Inactive'}
                        </Typography>

                        <Button
                            color="error"
                            onClick={() => deleteMutation.mutate(alert.id)}
                        >
                            Delete
                        </Button>
                    </Stack>
                ))}
            </Stack>
        </Container>
    );
}

export default AlertsPage;