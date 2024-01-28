import { ObjectId } from 'mongodb';

export const stripMongoId = <T>(
    o: T & { _id: ObjectId },
): T & { id: string } => {
    const { _id, ...restOfInput } = o;
    return { ...restOfInput } as T & { id: string };
};
