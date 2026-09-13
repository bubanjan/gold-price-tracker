import { useState } from 'react';
import { Link } from 'react-router';
import {
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
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';

import {
    deleteGoldPriceHistory,
    getGoldPriceHistory
} from '../api/goldPriceApi';

function HistoryPage() {
    const [page, setPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const pageSize = 20;

    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['goldPriceHistory', page, pageSize],
        queryFn: () => getGoldPriceHistory(page, pageSize),
        placeholderData: keepPreviousData,
    });

    const deleteHistoryMutation = useMutation({
        mutationFn: deleteGoldPriceHistory,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['goldPriceHistory']
            });

            setPage(1);
        },
    });

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
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>
                    Clear gold price history?
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        This will permanently delete all saved gold price
                        history. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        onClick={() => {
                            deleteHistoryMutation.mutate();
                            setDeleteDialogOpen(false);
                        }}
                        disabled={deleteHistoryMutation.isPending}
                    >
                        {deleteHistoryMutation.isPending
                            ? 'Deleting...'
                            : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default HistoryPage;