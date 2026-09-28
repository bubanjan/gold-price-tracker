import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    use: {
        baseURL: 'https://localhost:5173',
        ignoreHTTPSErrors: true,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: [
        {
            command: 'dotnet run --project ../GoldPriceTracker.Api/GoldPriceTracker.Api.csproj --no-launch-profile',
            env: {
                ASPNETCORE_ENVIRONMENT: 'Development',
                ASPNETCORE_URLS: 'https://localhost:7111',
                BackgroundWorkers__Enabled: 'false',
            },
            url: 'https://localhost:7111/health',
            ignoreHTTPSErrors: true,
            reuseExistingServer: false,
            timeout: 120000,
        },
        {
            command: 'npm run dev -- --host localhost --port 5173 --strictPort',
            url: 'https://localhost:5173',
            ignoreHTTPSErrors: true,
            reuseExistingServer: false,
        },
    ],
});
