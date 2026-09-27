import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegisterForm from './RegisterForm';

test('RegisterForm displays "Username is required." when Register is clicked with an empty username', async () => {
    // Arrange
    const user = userEvent.setup();
    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <RegisterForm onRegisterSuccess={() => {}} />
        </QueryClientProvider>
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Register' }));

    // Assert
    expect(screen.getByText('Username is required.')).toBeVisible();
});
