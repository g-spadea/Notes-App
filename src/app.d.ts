// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {

	type Note = {
		id: string;
		uid: string;
		name: string;
		text: string;
		created: Date;
		modified: Date;
	}

	namespace App {
		interface Locals {
			user?: string
		}
	}
}

export {FormResponse};
