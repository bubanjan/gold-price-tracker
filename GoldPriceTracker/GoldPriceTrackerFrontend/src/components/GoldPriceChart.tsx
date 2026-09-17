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
};

function GoldPriceChart({ data }: GoldPriceChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="fetchedAt" />

                <YAxis />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="price"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default GoldPriceChart;