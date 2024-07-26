import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoadEvent, LayoutServerLoad } from "./auth/$types";


export async function load(event:LayoutServerLoadEvent) {
  if(event.locals.user)
    redirect(303,'/app')
  else
    redirect(307, '/auth')
}