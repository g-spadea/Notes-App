import { fail, redirect, type ActionResult } from "@sveltejs/kit";
import type { Actions } from "./$types";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
    
    const acceptParams = ['signin', 'signup', 'forgotpassword'];

    if(!(acceptParams.includes(params.slug)))
        redirect(303,'/')
    
    return {
        slug: params.slug
    }
}

export const actions: Actions = {
    login: async ({request}) => {
        const data = await request.formData();
        const result: ActionResult = JSON.parse(data.get('result') as string);
        if(result.type === 'failure')
            return fail(result.status, {error: result.data!.name})
    },
    register: async ({request}) => {
        const data = await request.formData();
        
        if(!(data.has('result'))){
            const password = data.get("password") as string;
            const cpassword = data.get("confirm-password") as string;
            const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/gm;

            if(password.replaceAll(regex, '') !== '')
                return fail(422, {error: "Your passwords must respect constraint"})
            
            if(password !== cpassword)
                return fail(422, {error: "Your passwords must match"})
            
            return;
        }
        
        const result: ActionResult = JSON.parse(data.get('result') as string);
        if(result.type === 'failure')
            return fail(result.status, {error: result.data!.name})
    }
}