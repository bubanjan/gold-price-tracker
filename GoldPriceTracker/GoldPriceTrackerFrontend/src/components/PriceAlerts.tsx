import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import type { AlertCondition, PriceAlert } from '../types/PriceAlert';
import {
    useCreatePriceAlert,
    useDeletePriceAlert,
    usePriceAlerts,
    useUpdatePriceAlert
} from '../hooks/usePriceAlerts';

function PriceAlerts() {

    const [targetPrice, setTargetPrice] = useState('');
    const [condition, setCondition] = useState<AlertCondition>('Above');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [targetPriceError, setTargetPriceError] = useState('');

    const {
        data: alerts,
        isLoading,
        isError
    } = usePriceAlerts();

    const createMutation = useCreatePriceAlert();

    const deleteMutation = useDeletePriceAlert();

    const updateMutation = useUpdatePriceAlert();

    const handleCreate = () => {

        const price = Number(targetPrice);

        if (!targetPrice || price <= 0) {
            setTargetPriceError('Target price must be greater than 0');
            return;
        }

        setTargetPriceError('');

        createMutation.mutate(
            {
                targetPrice: price,
                condition,
            },
            {
                onSuccess: () => {
                    setTargetPrice('');
                    setCondition('Above');
                },
            }
        );
    };

    const handleEdit = (alert: PriceAlert) => {
        setEditingId(alert.id);
        setTargetPrice(alert.targetPrice.toString());
        setCondition(alert.condition);
        setTargetPriceError('');
    };

    const handleUpdate = () => {
        if (editingId === null) {
            return;
        }

        const price = Number(targetPrice);

        if (!targetPrice || price <= 0) {
            setTargetPriceError('Target price must be greater than 0');
            return;
        }

        setTargetPriceError('');

        updateMutation.mutate(
            {
                id: editingId,
                request: {
                    targetPrice: price,
                    condition,
                    isActive: true,
                },
            },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setTargetPrice('');
                    setCondition('Above');
                },
            });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setTargetPrice('');
        setCondition('Above');
        setTargetPriceError('');
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

            {
                createMutation.isError && (
                    <Alert severity="error">
                        {createMutation.error.message}
                    </Alert>
                )
            }

            {
                updateMutation.isError && (
                    <Alert severity="error">
                        {updateMutation.error.message}
                    </Alert>
                )
            }

            {
                deleteMutation.isError && (
                    <Alert severity="error">
                        {deleteMutation.error.message}
                    </Alert>
                )
            }


            <Stack spacing={2}>
                <TextField
                    label="Target price"
                    type="number"
                    value={targetPrice}
                    onChange={(e) => {
                        setTargetPrice(e.target.value);
                        setTargetPriceError('');
                    }}
                    error={!!targetPriceError}
                    helperText={targetPriceError}
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

            <Box sx={{
                maxHeight: 350,
                overflowY: 'auto',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
            }}>
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
            </Box>
        </Stack>
    );
}

export default PriceAlerts;