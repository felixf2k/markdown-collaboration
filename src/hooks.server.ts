import { createWebSocketServer } from '$lib/server/ws/websocket';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router.server';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

const trpcHandle = createTRPCHandle({
    router,
    createContext,
});

const webSocket: Handle = async ({ event, resolve }) => {
    createWebSocketServer();
    return resolve(event);
};

export const handle = sequence(trpcHandle, webSocket);
