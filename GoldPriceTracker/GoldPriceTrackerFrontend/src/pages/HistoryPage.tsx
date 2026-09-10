
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
    Button,
    CircularProgress,
    Container,
    Pagination,
    Typography
} from '@mui/material';
import { getGoldPriceHistory } from '../api/goldPriceApi';
import { useState } from 'react';

function HistoryPage() {

    const [page, setPage] = useState(1);
    const pageSize = 20;

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['goldPriceHistory', page, pageSize],
        queryFn: () => getGoldPriceHistory(page, pageSize),
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

            <Typography variant="h4" gutterBottom>
                Gold Price History
            </Typography>

            {data?.items.map((item) => (
                <Typography key={item.id}>
                    {item.price} {item.currency} -{' '}
                    {new Date(item.fetchedAt).toLocaleTimeString()}
                </Typography>
            ))}

            <Pagination
                count={data?.totalPages ?? 1}
                page={page}
                onChange={(_, value) => setPage(value)}
                sx={{ mt: 3 }}
            />
        </Container>
    );
}

export default HistoryPage;