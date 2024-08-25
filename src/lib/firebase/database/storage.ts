import { FirebaseError } from "firebase/app";
import { Injector } from "./injector";
import type { ActionResult } from "@sveltejs/kit";

function stringError(error: string){
    return error.substring(error.indexOf('/') + 1).
        replaceAll('-', ' ').
        replaceAll(/\b\w/gm, (c) => c.toUpperCase());
}

type params = { id?: string | undefined; uid?: string | undefined; name?: string | undefined; text?: string | undefined; }; 

export async function storageMethod(type: string, params:params) : Promise<ActionResult>{
	try{
		await Injector.getInjector().callInjector(type).method(params)
	}
	catch(error) {
		if(error instanceof FirebaseError){
			return {type:'failure', status: 400, data: {name: stringError(error.code)}}
		}
		if(error instanceof Error){
			return {type:'failure', status: 400, data: {name: error.message}}
		}
	}
	return {type:'success', status:200}
}