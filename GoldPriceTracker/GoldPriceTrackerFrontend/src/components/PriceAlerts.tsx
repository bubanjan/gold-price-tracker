import { useState } from 'react';
import {
    Button,
    Chip,
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

import type { AlertCondition, PriceAlert } from '../types/PriceAlert';

function PriceAlerts() {
    const queryClient = useQueryClient();

    const [targetPrice, setTargetPrice] = useState('');
    const [condition, setCondition] = useState<AlertCondition>('Above');
    const [editingId, setEditingId] = useState<number | null>(null);

    const {
        data: alerts,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['priceAlerts'],
        queryFn: getPriceAlerts,
        refetchInterval: 5000,
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

            setEditingId(null);
            setTargetPrice('');
            setCondition('Above');
        },
    });

    const handleCreate = () => {
        createMutation.mutate({
            targetPrice: Number(targetPrice),
            condition,
        });
    };

    const handleEdit = (alert: PriceAlert) => {
        setEditingId(alert.id);
        setTargetPrice(alert.targetPrice.toString());
        setCondition(alert.condition);
    };

    const handleUpdate = () => {
        if (editingId === null) {
            return;
        }

        updateMutation.mutate({
            id: editingId,
            request: {
                targetPrice: Number(targetPrice),
                condition,
                isActive: true,
            },
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setTargetPrice('');
        setCondition('Above');
    };

    if (isLoading) {
        return <Typography>Loading alerts...</Typography>;
    }

    if (isError) {
        return (
            <Typography color="error">
                Failed to load alerts
            </Typography>
        );
    }

    return (
        <Stack spacing={3}>
            <Typography variant="h5">
                Price Alerts
            </Typography>

            <Stack spacing={2}>
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
                    onChange={(e) => setCondition(e.target.value as AlertCondition)}
                >
                    <MenuItem value="Above">Above</MenuItem>
                    <MenuItem value="Below">Below</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    onClick={
                        editingId === null
                            ? handleCreate
                            : handleUpdate
                    }
                    disabled={
                        createMutation.isPending ||
                        updateMutation.isPending
                    }
                >
                    {editingId === null
                        ? 'Create Alert'
                        : 'Save Changes'}
                </Button>

                {editingId !== null && (
                    <Button onClick={handleCancelEdit}>
                        Cancel Edit
                    </Button>
                )}
            </Stack>

            <Stack spacing={2}>
                {alerts?.map((alert) => (
                    <Stack
                        key={alert.id}
                        spacing={1}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 2,
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
                                {alert.condition} ${alert.targetPrice}
                            </Typography>

                            <Chip
                                label={
                                    alert.isTriggered
                                        ? 'Triggered'
                                        : alert.isActive
                                            ? 'Active'
                                            : 'Inactive'
                                }
                                color={
                                    alert.isTriggered
                                        ? 'warning'
                                        : alert.isActive
                                            ? 'success'
                                            : 'default'
                                }
                                size="small"
                            />
                        </Stack>

                        <Typography variant="body2">
                            Created:{' '}
                            {new Date(alert.createdAt).toLocaleString()}
                        </Typography>

                        {alert.triggeredAt && (
                            <Typography variant="body2">
                                Triggered at:{' '}
                                {new Date(alert.triggeredAt).toLocaleString()}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={1}>
                            <Button onClick={() => handleEdit(alert)}>
                                Edit
                            </Button>

                            <Button
                                color="error"
                                onClick={() =>
                                    deleteMutation.mutate(alert.id)
                                }
                                disabled={deleteMutation.isPending}
                            >
                                Delete
                            </Button>
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
}

export default PriceAlerts;