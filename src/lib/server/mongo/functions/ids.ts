import { ObjectId } from 'mongodb';

export const stripMongoId = <T>(o: T & { _id?: ObjectId }): T => {
    const { _id, ...restOfInput } = o;
    return { ...restOfInput } as T;
};
