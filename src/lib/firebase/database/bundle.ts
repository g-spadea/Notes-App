import { loadBundle } from "firebase/firestore";
import { db } from "../clientFirebaseConf";

export async function loadBundleNotes(buffer: string) {

    const loadedState = await loadBundle(db, buffer);

    if (loadedState.taskState === 'Error') {
        throw 'Error loading data from server';
    }
}