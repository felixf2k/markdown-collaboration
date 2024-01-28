import { listNotes } from '$db/methods/notes/listNotes';

export const load = async () => {
    const notes = await listNotes();
    return { notes };
};
