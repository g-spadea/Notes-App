import { Injector } from "./injector";
import { FirebaseError } from "firebase/app";
import type { ActionResult } from '@sveltejs/kit';

function stringError(error: string){
    return error.substring(error.indexOf('/') + 1).
        replaceAll('-', ' ').
        replaceAll(/\b\w/gm, (c) => c.toUpperCase());
}

export async function authMethod(type: string, email?: string, password?: string) : Promise<ActionResult>{
	try{
		await Injector.getInjector().callInjector(type).method(email,password)
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