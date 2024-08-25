import { db } from "$lib/firebase/clientFirebaseConf";
import { collection, onSnapshot, orderBy, query, where, type DocumentData, type QuerySnapshot, type Timestamp } from "firebase/firestore";
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

function orderMethod(s:string|undefined){
    switch(s){
        case 'date': 
            return 'modified';
        case 'name':
            return'name';
        default:
            return 'modified'
    }
}

export function createStore(uid: string, notes: Note[], order?:'date'|'name'){
    return readable<Note[]>(
        [], (set) => {
            set(notes);

            const method = orderMethod(order)

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