import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where} from "firebase/firestore";
import { db } from "../clientFirebaseConf";

interface FirestoreMethod {
    method({id, uid, name, text}: {id?: string, uid?: string, name?: string, text?: string}): Promise<void>;
}

class AddNote implements FirestoreMethod{
    async method({uid, name}: {uid: string, name: string}): Promise<void> {
        return setDoc(
            doc(collection(db,'notes')), {
                uid,
                name,
                text: '',
                created: serverTimestamp(),
                modified: serverTimestamp(),
            }
        )
    }
}

class UpdateNote implements FirestoreMethod{
    method({id, text}: {id: string, text: string}): Promise<void> {
        return updateDoc(doc(db, 'notes', id), {text, modified:serverTimestamp()})
    }
}

class DeleteNote implements FirestoreMethod{
    method({id}: {id: string}): Promise<void> {
        return deleteDoc(doc(db, 'notes', id));
    }
}

//Singleton
export class Injector {

    private constructor() {}
    private static injector: Injector = new Injector();
    
    private add:FirestoreMethod = new AddNote();
    private update:FirestoreMethod = new UpdateNote();
    private delete:FirestoreMethod = new DeleteNote();

    static getInjector(){
        return this.injector;
    }

    callInjector(type: string): FirestoreMethod {
        switch(type){
            case 'add':
                return this.add;
            case 'update':
                return this.update;
            case 'delete':
                return this.delete;
            default:
                throw new Error('Method not found')
        }
    }
}