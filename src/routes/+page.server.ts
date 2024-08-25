import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoadEvent} from "./auth/$types";

export async function load(event:LayoutServerLoadEvent) {
  if(event.locals.user)
    redirect(303,'/app/notes')
  else
    redirect(307, '/auth');
}