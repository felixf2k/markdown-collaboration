import { notes } from '$db/client';
import type { Note } from '$lib/schemas';

/** Throws */
export const upsertNote = async (note: Note) => {
    await notes.findOneAndUpdate(
        { id: note.id },
        { $set: note },
        { upsert: true },
    );
};
