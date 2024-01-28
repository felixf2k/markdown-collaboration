import { notes } from '$db/client';
import { stripMongoId } from '$db/functions/ids';
import { getNote } from '$db/methods/notes/getNote';
import { upsertNote } from '$db/methods/notes/upsertNote';
import type { WSMessage } from '$lib/schemas';
import { WebSocket, WebSocketServer } from 'ws';

let wssInitialized = false;
export const createWebSocketServer = () => {
    if (wssInitialized) return;
    const wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', async (ws) => {
        const subscriptions = new Set<string>();
        const changeStream = notes.watch(undefined, {
            fullDocument: 'updateLookup',
        });

        changeStream.on('change', (change) => {
            if (change.operationType !== 'update' || !change.fullDocument)
                return;
            const note = stripMongoId(change.fullDocument);
            if (!subscriptions.has(note.id)) return;
            const updateMessage: WSMessage = {
                type: 'update',
                id: note.id,
                content: note,
            };
            ws.send(JSON.stringify(updateMessage));
        });

        ws.on('message', async (message) => {
            const wsMsg = JSON.parse(message.toString()) as WSMessage;
            if (wsMsg.type === 'update') {
                try {
                    await upsertNote({ ...wsMsg.content, id: wsMsg.id });
                } catch (error) {
                    console.error(error);
                    const errorMsg: WSMessage = {
                        type: 'error',
                        id: wsMsg.id,
                        message: 'TODO: Message',
                    };
                    ws.send(JSON.stringify(errorMsg));
                }
            } else if (wsMsg.type === 'subscribe') {
                onSubscribe(ws, subscriptions, wsMsg.id);
            } else if (wsMsg.type === 'unsubscribe') {
                subscriptions.delete(wsMsg.id);
            } else if (wsMsg.type === 'error') {
                console.error(wsMsg.id, wsMsg.message);
            } else {
                console.error('invalid message');
            }
        });

        ws.on('close', () => {
            changeStream.close();
        });
        ws.on('error', console.error);
    });
    wssInitialized = true;
};

async function onSubscribe(
    ws: WebSocket,
    subscriptions: Set<string>,
    id: string,
) {
    try {
        const note = await getNote(id);
        const updateMsg: WSMessage = {
            type: 'update',
            content: note,
            id,
        };
        ws.send(JSON.stringify(updateMsg));
        subscriptions.add(id);
    } catch {
        const errorMsg: WSMessage = {
            type: 'error',
            id,
            message: 'TODO',
        };
        ws.send(JSON.stringify(errorMsg));
    }
}
