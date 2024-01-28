import { notes } from '$db/client';

/** Throws */
export const deleteNote = async (id: string) => {
    await notes.deleteOne({ id });
};
