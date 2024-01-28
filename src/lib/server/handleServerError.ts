import type { NumericRange } from '@sveltejs/kit';

export const handleServerError = (
    error: unknown,
): [NumericRange<400, 599>, string] => {
    // TODO
    console.error(error);
    return [500, 'unknown_error'];
};
