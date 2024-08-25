<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import Notes from './components/notes.svelte';
	import { applyAction } from '$app/forms';
	import { storageMethod } from '$lib/firebase/database/storage';
	import { createStore } from '$lib/store/noteStore';
	import type { Readable } from 'svelte/store';

	let {data, form} = $props();

    let noteStore: Readable<Note[]> = $state(createStore(data.uid, data.notes));
	
	let timeout:boolean = false;

	$effect(() => {
		if(form?.error && form?.error.submitter != "" && !timeout){
			setTimeout(() => {
				timeout=false;
				if(form)
					form.error.submitter = ""
			}, 5000);
			timeout = true;
		}
	})

	const storageAction: SubmitFunction = async ({action,formData, submitter}) => {
		const actionNote:string = action.search;
		const noteName = formData.get("noteName")?.toString();
		const noteId = submitter?.getAttribute("name");

		switch(actionNote){
			case '?/addNote':
				if(noteName != undefined)
					formData.append("result", JSON.stringify(await storageMethod('add', {uid: data.uid, name: noteName})));
				break;
			case '?/deleteNote':
				if(noteId)
					formData.append("result", JSON.stringify(await storageMethod('delete', {id:noteId})));
				break;
			case '?/dateSort':
				noteStore = createStore(data.uid, data.notes, 'date')
				break;
			case '?/nameSort':
				noteStore = createStore(data.uid, data.notes, 'name')
				break;
		}

		return async ({ result, update }) => {

			await applyAction(result);

			let dialog: HTMLDialogElement|null;
			switch(actionNote){
				case '?/addNote':
					dialog = document.querySelector('.add-dialog')!;
					break;
				case '?/deleteNote':
					dialog = document.querySelector('.delete-dialog')!;
					break;
				default:
					dialog=null;
			}

			if(result.type === 'success'){
				if(dialog) dialog.close();
				await update();
			}
		}
	}
</script>

<Notes notes={noteStore} submit={storageAction} submitError={form?.error}/>