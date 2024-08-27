import { getNotes } from '$lib/firebase/database/notes-server.js';
import { fail, redirect, type ActionResult, type Actions} from '@sveltejs/kit';

export async function load({locals, cookies}) {
    if(!locals.user)
        redirect(303, '/auth')

    cookies.delete('note', {path:'/app/editor'});
    const {notes, bundle} = (await getNotes(locals.user))!;
    return {notes, bundle, uid: locals.user};
}

export const actions: Actions = {
	addNote: async ({request}) => {
        const data = await request.formData();

        const result: ActionResult = JSON.parse(data.get('result') as string);
        if(result.type === 'failure')
            return fail(result.status, {error: {submitter: 'add', text: result.data!.name}})
    },
    deleteNote: async ({request}) => {
        const data = await request.formData();

        const result: ActionResult = JSON.parse(data.get('result') as string);
        if(result.type === 'failure')
            return fail(result.status, {error: {submitter: 'delete', text: result.data!.name}})
    },
    openNote: async ({request,cookies}) => {
        const data = await request.formData();

        if(data.has('note')){
            cookies.set('note', data.get('note') as string, {
                path: '/app/editor',
                secure: false,
                httpOnly:false
            })
            redirect(303, '/app/editor');
        }
        
        return fail(400, {error: {submitter: 'note', text: "Unable to open note"}})
    },
    dateSort: async ({request}) => {},
    nameSort: async ({request}) => {}
}