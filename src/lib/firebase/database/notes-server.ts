import type { DocumentData, QuerySnapshot, Timestamp } from "firebase-admin/firestore";
import { adminDB } from "../adminFirebaseConf";
import { FirebaseError } from "firebase/app";
import { error } from "@sveltejs/kit";

export function snapToData(q: QuerySnapshot<DocumentData,DocumentData>){
    if(q.empty)
        return [];

    return q.docs.map((doc) => {
        const data = doc.data();
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

export async function getNotes(user: string) {

    let noteSnapshot: QuerySnapshot<DocumentData, DocumentData>;
    
    try{
        noteSnapshot = await adminDB
        .collection('notes')
        .where('uid', '==', user)
        .orderBy('modified','desc')
        .get();
    }
    catch(e){
        if(e instanceof FirebaseError)
            error(500, e.message)
        if(e instanceof Error)
            error(500, e.message)
        error(500, "Error")
    }
        
    const bundleID = Date.now().toString();
    const bundle = adminDB
        .bundle(bundleID)
        .add('notes-query', noteSnapshot)
        .build()
        .toString();
    
    const notes = snapToData(noteSnapshot);
    
    return {notes, bundle};
}