import { notes } from '$db/client';
import { stripMongoId } from '$db/functions/ids';

/** Throws */
export const getNote = async (id: string) => {
    const rawNote = await notes.findOne({ id });
    if (!rawNote) throw new Error('NOT_FOUND');
    return stripMongoId(rawNote);
};
