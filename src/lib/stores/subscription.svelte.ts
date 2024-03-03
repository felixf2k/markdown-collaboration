import { browser } from '$app/environment';
import type { Note, WSMessage } from '$lib/schemas';
import { notes } from '$stores/notes.svelte';

const ws = createWebSocket();
const subscribtion = new Map<string, (message: WSMessage) => void>();

function createWebSocket() {
    if (!browser) return undefined as unknown as WebSocket;
    let ws = new WebSocket('ws://localhost:8080');

    ws.addEventListener('message', (event) => {
        try {
            const message = JSON.parse(event.data) as WSMessage;
            const handler = subscribtion.get(message.id);
            if (!handler) {
                unsubscribeFromRemote(message.id);
                return;
            }
            handler(message);
        } catch (error) {
            console.error(error);
        }
    });
    return ws;
}

function unsubscribeFromRemote(id: string) {
    const unsubscribeMessage: WSMessage = {
        type: 'unsubscribe',
        id,
    };
    subscribtion.delete(id);
    ws.send(JSON.stringify(unsubscribeMessage));
}

const subscribeToRemote = (id: string, handler: (msg: WSMessage) => void) => {
    console.log('subscribing');
    const subscribeMessage: WSMessage = {
        type: 'subscribe',
        id,
    };
    ws.send(JSON.stringify(subscribeMessage));
    subscribtion.set(id, handler);
};

const updateRemote = (id: string, note: Note) => {
    const updateMessage: WSMessage = {
        type: 'update',
        content: note,
        id,
    };
    ws.send(JSON.stringify(updateMessage));
};

export function createNoteSubscribtion(id: string) {
    let note = $state<Note | undefined>();

    function handleMessage(msg: WSMessage) {
        console.log(msg);
        if (msg.type !== 'update') return;
        if (msg.id !== id) {
            console.error(
                `expected message with id ${id}, received message with id ${msg.id}`,
            );
            return;
        }
        notes.updateTitle(id, msg.content.title);
        note = { ...msg.content, id };
    }

    subscribeToRemote(id, handleMessage);
    return {
        get value() {
            if (note) return note;
            return { id: '', title: '', content: '' } satisfies Note;
        },
        update: (n: Note) => {
            note = n;
            notes.updateTitle(id, n.title);
            updateRemote(id, n);
        },
        unsubscribe: () => {
            unsubscribeFromRemote(id);
        },
    };
}
