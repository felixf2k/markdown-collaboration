import { browser } from '$app/environment';
import type { Note, WSMessage } from '$lib/schemas';
import { writable } from 'svelte/store';

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
    const { set, subscribe } = writable<Note>(
        { content: '', id: '', title: '' },
        (set) => {
            subscribeToRemote(id, (msg) => {
                console.log(msg);
                if (msg.type !== 'update') return;
                if (msg.id !== id) {
                    console.error(
                        `expected message with id ${id}, received message with id ${msg.id}`,
                    );
                    return;
                }
                set({ ...msg.content, id });
            });
            return unsubscribeFromRemote(id);
        },
    );

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
        subscribe,
    };
}
