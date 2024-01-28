import { createNote } from '$db/methods/notes/createNote';
import { deleteNote } from '$db/methods/notes/deleteNote';
import { normalizedTRPCError } from '$functions/normalizedError';
import { NoteSchema } from '$lib/schemas';
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import z from 'zod';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
    note: t.router({
        create: t.procedure
            .input(NoteSchema.omit({ id: true }))
            .mutation(async ({ input }) => {
                try {
                    const id: string = crypto.randomUUID();
                    await createNote({ ...input, id });
                    return id;
                } catch (error) {
                    throw normalizedTRPCError(error);
                }
            }),
        delete: t.procedure
            .input(z.string().uuid())
            .mutation(async ({ input: id }) => {
                try {
                    await deleteNote(id);
                } catch (error) {
                    console.error('TODO', error);
                }
            }),
    }),
});

export type Router = typeof router;
