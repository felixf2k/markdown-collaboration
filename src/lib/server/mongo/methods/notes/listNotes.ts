import { notes } from '$db/client';
import { stripMongoId } from '$db/functions/ids';

/** Throws */
export const listNotes = async () => {
    const allNotes = await notes.find().toArray();
    const serializableNotes = allNotes.map((n) => stripMongoId(n));
    return serializableNotes;
};
