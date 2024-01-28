import { collection } from '$db/client';
import { NOTE_COLLECTION } from '$db/constants';
import { upsertNote } from '$db/methods/notes/upsertNote';
import type { Note, WSMessage } from '$lib/schemas';
import { WebSocketServer } from 'ws';

let wssInitialized = false;
export const createWebSocketServer = () => {
    if (wssInitialized) return;
    const wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', async (ws) => {
        const subscriptions = new Set<string>()
        const changeStream = collection(NOTE_COLLECTION).watch();

        changeStream.on('change', (change) => {
            if (change.operationType !== 'update') return;
            const note = change.fullDocument as Note;
            const updateMessage: WSMessage = {
                type: 'update',
                id: note.id,
                content: note,
            };
            ws.send(JSON.stringify(updateMessage));
        });

        ws.on('error', console.error);

        ws.on('message', (message) => {
            const wsMsg = JSON.parse(message.toString()) as WSMessage;
            if (wsMsg.type === 'update') {
                try {
                    upsertNote(wsMsg.content);
                } catch (error) {
                    const errorMsg: WSMessage = {
                        type: 'error',
                        id: wsMsg.id,
                        message: 'TODO: Message',
                    };
                }
            } else if(wsMsg.type === "subscribe") {
                
            } else {

            }
        });

        ws.on('close', () => {
            changeStream.close();
        });
    });
    wssInitialized = true;
};
