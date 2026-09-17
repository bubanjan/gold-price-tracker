import { useState } from 'react';
import { Link } from 'react-router';
import {
    Alert,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Pagination,
    Typography
} from '@mui/material';

import { useDeleteGoldPriceHistory, useGoldPriceHistory } from '../hooks/useGoldPriceHistory';
import { useGoldPriceChart } from '../hooks/useGoldPriceChart';
import GoldPriceChart from '../components/GoldPriceChart';

function HistoryPage() {
    const [page, setPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [chartHours, setChartHours] = useState(24);

    const pageSize = 20;

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useGoldPriceHistory(page, pageSize);

    const {
        data: chartData,
        isLoading: isChartLoading,
        isError: isChartError,
    } = useGoldPriceChart(chartHours);

    const deleteHistoryMutation = useDeleteGoldPriceHistory();

    if (isLoading) {
        return (
            <Container sx={{ mt: 5 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography color="error">
                    Failed to load history
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>

            <Button
                component={Link}
                to="/"
                variant="outlined"
                sx={{ mb: 2 }}
            >
                Back to Current Price
            </Button>

            <Button
                sx={{ mb: 2, ml: 1 }}
                color="error"
                variant="outlined"
                onClick={() => setDeleteDialogOpen(true)}
            >
                Clear History
            </Button>

            <Typography variant="h4" gutterBottom>
                Gold Price History
            </Typography>

            {isFetching && (
                <CircularProgress size={20} />
            )}

            {data?.items.map((item) => (
                <Typography key={item.id}>
                    {item.price} {item.currency} -{' '}
                    {new Date(item.fetchedAt).toLocaleString()}
                </Typography>
            ))}

            <Pagination
                count={data?.totalPages ?? 1}
                page={page}
                onChange={(_, value) => setPage(value)}
                sx={{ mt: 3 }}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={() => {
                    if (!deleteHistoryMutation.isPending) {
                        setDeleteDialogOpen(false);
                    }
                }}
            >
                <DialogTitle>
                    Clear gold price history?
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        This will permanently delete all saved gold price
                        history. This action cannot be undone.
                    </DialogContentText>
                    {deleteHistoryMutation.isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {deleteHistoryMutation.error.message}
                        </Alert>
                    )}

                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deleteHistoryMutation.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        onClick={() => {
                            deleteHistoryMutation.mutate(
                                undefined,
                                {
                                    onSuccess: () => {
                                        setPage(1);
                                        setDeleteDialogOpen(false);
                                    }
                                }
                            );
                        }}
                        disabled={deleteHistoryMutation.isPending}
                    >
                        {deleteHistoryMutation.isPending
                            ? 'Deleting...'
                            : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>


            <Button onClick={() => setChartHours(1)}>
                1H
            </Button>

            <Button onClick={() => setChartHours(6)}>
                6H
            </Button>

            <Button onClick={() => setChartHours(24)}>
                24H
            </Button>

            <Button onClick={() => setChartHours(168)}>
                7D
            </Button>

            {isChartLoading && (
                <CircularProgress />
            )}

            {isChartError && (
                <Alert severity="error">
                    Failed to load chart
                </Alert>
            )}

            {chartData && (
                <GoldPriceChart data={chartData} />
            )}

        </Container >
    );
}

export default HistoryPage;