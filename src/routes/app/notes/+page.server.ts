import { getNotes } from '$lib/firebase/database/notes-server.js';
import { fail, redirect, type ActionResult, type Actions} from '@sveltejs/kit';

export async function load({locals}) {
    if(!locals.user)
        redirect(303, '/auth')

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
            return fail(result.status, {error: {submitter: 'add', text: result.data!.name}})
    },
    dateSort: async ({request}) => {},
    nameSort: async ({request}) => {}
}