import { createWebSocketServer } from '$lib/server/ws/websocket';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
    createWebSocketServer();
    return resolve(event);
}) satisfies Handle;
