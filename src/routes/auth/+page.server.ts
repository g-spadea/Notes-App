import { fail, type ActionResult } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
	login: async ({request}) => {
        const data = await request.formData();
        const result: ActionResult = JSON.parse(data.get('result') as string);
        if(result.type === 'failure')
            return fail(result.status, {error: result.data!.name})
    }
}