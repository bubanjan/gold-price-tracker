import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import type { GoldPrice } from '../types/GoldPrice';

type GoldPriceChartProps = {
    data: GoldPrice[];
    hours: number;
};

function GoldPriceChart({ data, hours }: GoldPriceChartProps) {

    const formatXAxis = (value: string) => {
        const date = new Date(value);

        if (hours === 168) {
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
            });
        }

        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    dataKey="fetchedAt"
                    tickFormatter={formatXAxis}
                />

                <YAxis
                    domain={['dataMin', 'dataMax']}
                />

                <Tooltip
                    formatter={(value) => [
                        `$${Number(value).toFixed(2)}`,
                        'Gold Price'
                    ]}
                />
                <Line
                    type="monotone"
                    dataKey="price"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default GoldPriceChart;