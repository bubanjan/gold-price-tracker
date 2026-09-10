
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Typography
} from '@mui/material';
import { getGoldPrice } from '../api/goldPriceApi';

function HomePage() {
    const {
        data,
        isLoading,
        isError,
        error,
        dataUpdatedAt
    } = useQuery({
        queryKey: ['goldPrice'],
        queryFn: getGoldPrice,
        staleTime: 4000,
        refetchInterval: 5000,
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
                    Error: {error.message}
                </Typography>
            </Container>
        );
    }

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: data?.currency ?? 'USD',
    }).format(data?.price ?? 0);

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Gold Price Tracker
                    </Typography>

                    <Typography variant="h3">
                        {formattedPrice}
                    </Typography>

                    <Typography variant="body1">
                        {data?.currency} / oz
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Gold API updated: {data?.updatedAtReadable}
                    </Typography>

                    <Typography variant="body2">
                        Frontend fetched at:{' '}
                        {new Date(dataUpdatedAt).toLocaleTimeString()}
                    </Typography>
                </CardContent>
            </Card>

            <Button
                component={Link}
                to="/history"
                variant="contained"
                sx={{ mt: 2 }}
            >
                View History
            </Button>
        </Container>
    );
}

export default HomePage;