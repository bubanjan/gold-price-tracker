
import { Link } from 'react-router';
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    Typography
} from '@mui/material';
import PriceAlerts from '../components/PriceAlerts';
import { useGoldPrice } from '../hooks/useGoldPrice';

function HomePage() {
    const {
        data,
        isLoading,
        isError,
        error,
        dataUpdatedAt
    } = useGoldPrice();

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

            <Stack sx={{ mt: 4 }}>
                <PriceAlerts />
            </Stack>

            <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2 }}
            >
                <Button
                    component={Link}
                    to="/history"
                    variant="contained"
                >
                    View History
                </Button>

            </Stack>
        </Container>
    );
}

export default HomePage;