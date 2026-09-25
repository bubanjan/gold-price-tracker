
type ApiError = {
    title?: string;
    errors?: Record<string, string[]>;
};

export const getErrorMessage = async (response: Response): Promise<string> => {
    try {
        const data: ApiError = await response.json();

        if (data.errors) {
            const messages = Object.values(data.errors).flat();

            return messages.join(', ');
        }

    } catch { }

    return 'Something went wrong';
};