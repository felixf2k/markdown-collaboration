import { NOTE_COLLECTION } from '$db/constants';
import { MONGO_PASSWORD, MONGO_USERNAME } from '$env/static/private';
import type { Note } from '$lib/schemas';
import { MongoClient, type Document } from 'mongodb';

const client = await new MongoClient(
    `mongodb+srv://${encodeURIComponent(MONGO_USERNAME)}:${encodeURIComponent(
        MONGO_PASSWORD,
    )}@cluster0.xyra8ij.mongodb.net/?retryWrites=true&w=majority`,
)
    .connect()
    .then((r) => {
        console.log('connected to mongodb');
        return r;
    });

export const collection = <T extends Document>(collection: string) =>
    client.db('dynamic').collection<T>(collection);

export const notes = collection<Note>(NOTE_COLLECTION);
