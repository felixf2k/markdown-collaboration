import { notes } from '$db/client';
import type { Note } from '$lib/schemas';

export const createNote = async (note: Note) => {
    await notes.insertOne(note);
};
