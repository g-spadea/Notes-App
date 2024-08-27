import { db } from "$lib/firebase/clientFirebaseConf";
import { collection, onSnapshot, orderBy, query, Timestamp, where, type DocumentData, type QuerySnapshot } from "firebase/firestore";
import { readable } from "svelte/store";

function snapToNotes(q: QuerySnapshot<DocumentData,DocumentData>){
    if(q.empty)
        return [];

    return q.docs.map((doc) => {
        const data = doc.data({serverTimestamps: 'estimate'});
        const created = data['created'] as Timestamp;
        const modified = data['modified'] as Timestamp;
        return{
            ...data,
            created: created.toDate(),
            modified: modified.toDate(),
            id: doc.id
        }
    }) as Note[];
}

export function createStore(uid: string, notes: Note[], order?:'modified'|'name'){
    return readable<Note[]>(
        [], (set) => {
            set(notes);

            const method = order ? order : 'modified';

            return onSnapshot(
                query(
                    collection(db, 'notes'),
                    where('uid', '==', uid),
                    orderBy(method, method === 'modified'? 'desc' : 'asc')
                ), (queryResult) => {
                    set(snapToNotes(queryResult));
                }
            )
        }
    )
}