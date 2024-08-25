import { browser } from '$app/environment';
import { loadBundleNotes } from '$lib/firebase/database/bundle';

export async function load({data}) {
    if(browser && data.bundle){
        await loadBundleNotes(data.bundle)
    }

    return {notes: data.notes, uid: data.uid};
}