import { auth } from "$lib/firebase/adminFirebaseConf";
import { type Handle } from "@sveltejs/kit";
import debug from "debug";

const log = debug("app:hooks.server");

export const handle: Handle = async ({ event, resolve }) => {
    if(event.request.method === 'HEAD')
        return await resolve(event);
    
    try{
        const token = event.cookies.get("__session");
        const currentUser = token ? await auth.verifyIdToken(token) : null;
        if(currentUser)
            event.locals.user = currentUser?.uid;
        log("loggin", currentUser ? true : false)
    }
    catch(e) {
        log("error", e)
        event.cookies.set("__session", "", { path:'/', maxAge: -1});
    }

    return await resolve(event);
}