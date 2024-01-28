import { collection } from '$db/client';
import { NOTE_COLLECTION } from '$db/constants';
import { stripMongoId } from '$db/functions/ids';
import type { Note } from '$lib/schemas';

// Throws
export const listNotes = async () => {
    const notes = await collection<Note>(NOTE_COLLECTION).find().toArray();
    const serializableNotes = notes.map((n) => stripMongoId(n));
    return serializableNotes;
};
