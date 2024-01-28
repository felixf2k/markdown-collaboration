import type { Id } from '$lib/api';

/** Hanldes selection of an item, maintains the shape of value (array -> array) */
export function flipItemSelection<T extends Id>(
    item: T,
    valueS?: T,
    required?: boolean,
    onSingleChangeSuccess?: () => void,
): T | undefined;

export function flipItemSelection<T extends Id>(
    item: T,
    valueArr: T[],
    required?: boolean,
    onSingleChangeSuccess?: () => void,
): T[];

export function flipItemSelection<T extends Id>(
    item: T,
    value?: T | T[],
    required?: boolean,
    onSingleChangeSuccess?: () => void,
): T | T[] | undefined;

export function flipItemSelection<T extends Id>(
    item: T,
    value?: T | T[],
    required?: boolean,
    onSingleChangeSuccess?: () => void,
): T | T[] | undefined {
    if (Array.isArray(value)) {
        const IS_CONTAINED = value.find((v) => v.id === item.id);
        // lets reject removing the last element if a value is required
        if (required && IS_CONTAINED && value.length === 1) return value;
        if (IS_CONTAINED) return value.filter((v) => v.id !== item.id);
        value.push(item);
        return value;
    } else {
        if (value?.id === item.id) {
            if (required) return value;
            onSingleChangeSuccess?.();
            return undefined;
        } else {
            onSingleChangeSuccess?.();
            return item;
        }
    }
}

export const asArray = <T>(value?: T | T[]): T[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
};

export const isSelected = (item: Id, value?: Id | Id[]): boolean => {
    if (!value) return false;
    if (Array.isArray(value)) {
        return !!value.find((v) => v.id === item.id);
    } else {
        return value.id === item.id;
    }
};
