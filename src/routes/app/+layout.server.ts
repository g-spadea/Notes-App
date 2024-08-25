import { redirect} from "@sveltejs/kit";
import type { LayoutServerLoadEvent } from "./$types";

export function load(event:LayoutServerLoadEvent) {
  if(!(event.locals.user))
    redirect(303,'/auth')
}