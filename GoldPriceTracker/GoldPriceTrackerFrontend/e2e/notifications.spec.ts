import { expect, test } from '@playwright/test';

test('anonymous visitors are asked to log in to see notifications', async ({ page }) => {
    const currentUserResponse = page.waitForResponse(response =>
        response.url() === 'https://localhost:7111/api/auth/me' &&
        response.request().method() === 'GET'
    );

    await page.goto('/notifications');

    expect((await currentUserResponse).status()).toBe(401);
    await expect(page.getByRole('alert')).toHaveText('Log in to see notifications.');
});
