import { TRPCClientError } from '@trpc/client';
import { TRPCError } from '@trpc/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizedError = async (e: any): Promise<App.Error> => {
    if (e instanceof TRPCClientError || e instanceof TRPCError) {
        return {
            message: e.message,
        };
    }

    return {
        message: UNKNOWN_ERROR,
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizedTRPCError = async (e: any): Promise<TRPCError> => {
    if (e instanceof TRPCError) return e;

    return {
        code: 'INTERNAL_SERVER_ERROR',
        message: UNKNOWN_ERROR,
        name: '',
    };
};

export default normalizedError;
export const UNKNOWN_ERROR = 'unknown_error';
