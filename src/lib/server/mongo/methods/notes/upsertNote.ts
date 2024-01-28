import { collection } from '$db/client';
import { NOTE_COLLECTION } from '$db/constants';
import type { Note } from '$lib/schemas';

// Throws
export const upsertNote = async (note: Note) => {
    await collection<Note>(NOTE_COLLECTION).findOneAndUpdate(
        { id: note.id },
        { $set: note },
        { upsert: true },
    );
};
