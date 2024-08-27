import { redirect } from "@sveltejs/kit";

export async function load({cookies}) {
    
    const noteSession: string | undefined = cookies.get('note')
    if(noteSession){
        const note: Note = JSON.parse(noteSession); 
        return {note: note}
    }
    else
        redirect(303, '/app/notes')
    
}