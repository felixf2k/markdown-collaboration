export const queryParams = (
    ...params: [key: string, value: string | undefined | null][]
): string => {
    if (params.length === 0) return '';
    let query = '?';
    let isFirst = true;
    for (let i = 0; i < params.length; i++) {
        if (!params[i][1]) continue;
        if (!isFirst) query += '&';
        query += `${params[i][0]}=${params[i][1]}`;
        isFirst = false;
    }
    return isFirst ? '' : query;
};
