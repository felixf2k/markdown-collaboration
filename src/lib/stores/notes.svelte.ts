export type NoteTab = {
    open: boolean;
    active: boolean;
    title: string;
    id: string;
};

export const notes = createNoteStore();

function createNoteStore() {
    let notes = $state<NoteTab[]>([]);
    let openNotes = $derived(notes.filter((n) => n.open));
    let activeNote = $derived(openNotes.find((n) => n.active));

    const close = (id: string) => {
        let lastOpenNote: NoteTab | undefined = undefined;
        for (const note of notes) {
            if (note.id !== id) {
                if (note.open) lastOpenNote = note;
                continue;
            }
            note.open = false;
            if (note.active) {
                if (lastOpenNote) lastOpenNote.active = true;
            }
        }
        notes = notes;
    };

    const open = (id: string) => {
        for (const note of notes) {
            if (note.id !== id) {
                note.active = false;
                continue;
            }
            note.open = true;
            note.active = true;
        }
        notes = notes;
    };

    const select = (id: string) => {
        for (const note of notes) {
            if (note.id === id) {
                note.active = true;
            } else {
                note.active = false;
            }
        }
        notes = notes;
    };

    const updateTitle = (id: string, title: string) => {
        for (const note of notes) {
            if (note.id !== id) continue;
            note.title = title;
            break;
        }
        notes = notes;
    };

    const deleteNote = (id: string) => {
        notes = notes.filter((n) => n.id !== id);
    };

    return {
        get all() {
            return notes;
        },
        set all(tabs: NoteTab[]) {
            notes = tabs;
        },
        get openNotes() {
            return openNotes;
        },
        get active() {
            return activeNote;
        },
        close,
        open,
        select,
        updateTitle,
        deleteNote,
    };
}
