import { auth } from "$lib/firebase/adminFirebaseConf";
import { type Handle } from "@sveltejs/kit";
import debug from "debug";

const log = debug("app:hooks.server");

export const handle: Handle = async ({ event, resolve }) => {
    try{
        const token = event.cookies.get("token");
        const currentUser = token ? await auth.verifyIdToken(token) : null;
        if(currentUser)
            event.locals.user = currentUser?.uid;
        log("loggin", currentUser ? true : false)
    }
    catch(e) {
        log("error", e)
        event.cookies.set("token", "", { path:'/', maxAge: -1 });
    }

    return await resolve(event);
}