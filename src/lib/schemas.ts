import z from 'zod';

export const NoteSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    content: z.string(),
});
export type Note = z.infer<typeof NoteSchema>;

export const WSMessageSchema = z.union([
    z.object({
        type: z.literal('subscribe'),
        id: z.string(),
    }),
    z.object({
        type: z.literal('unsubscribe'),
        id: z.string(),
    }),
    z.object({
        type: z.literal('update'),
        id: z.string(),
        content: NoteSchema,
    }),
    z.object({
        type: z.literal('error'),
        id: z.string(),
        message: z.string(),
    }),
]);
export type WSMessage = z.infer<typeof WSMessageSchema>;
