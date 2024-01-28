import { collection } from '$db/client';
import { NOTE_COLLECTION } from '$db/constants';
import { stripMongoId } from '$db/functions/ids';
import type { Note } from '$lib/schemas';

/** Throws */
export const getNote = async (id: string) => {
    const rawNote = await collection<Note>(NOTE_COLLECTION).findOne({ id });
    if (!rawNote) throw new Error('NOT_FOUND');
    return stripMongoId(rawNote);
};
