import type { Note, WSMessage } from '$lib/schemas';
import { writable } from 'svelte/store';

const ws = new WebSocket('ws://localhost:8080');
const subscribtion = new Map<string, (message: WSMessage) => void>();

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

function unsubscribeFromRemote(id: string) {
    return () => {
        console.log('unsubscribing from note with id', id);
        const unsubscribeMessage: WSMessage = {
            type: 'unsubscribe',
            id,
        };
        subscribtion.delete(id);
        ws.send(JSON.stringify(unsubscribeMessage));
    };
}

function subscribeToRemote(id: string, handler: (msg: WSMessage) => void) {
    console.log('subscribing to note with id', id);
    const subscribeMessage: WSMessage = {
        type: 'subscribe',
        id,
    };
    ws.send(JSON.stringify(subscribeMessage));
    subscribtion.set(id, handler);
}

export function createNoteStore(id: string) {
    const { set, subscribe } = writable<Note>(undefined, () =>
        unsubscribeFromRemote(id),
    );

    subscribeToRemote(id, (msg) => {
        if (msg.type !== 'update') return;
        if (msg.id !== id) {
            console.error(
                `expected message with id ${id}, received message with id ${msg.id}`,
            );
            return;
        }
        set(msg.content);
    });

    return {
        set: (v: Note) => {
            const updateMessage: WSMessage = {
                type: 'update',
                content: v,
                id,
            };
            ws.send(JSON.stringify(updateMessage));
            set(v);
        },
    };
}
