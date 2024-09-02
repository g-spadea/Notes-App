<script lang="ts">
	import Notes from './components/notes/notes.svelte';
	import Bar from '../../components/bar.svelte';
	import { type SubmitFunction } from '@sveltejs/kit';
	import { applyAction } from '$app/forms';
	import { storageMethod } from '$lib/firebase/database/storage';
	import { createStore } from '$lib/store/noteStore';
	import type { Readable } from 'svelte/store';
	
	let {data, form} = $props();

	let prop: {noteId:string, noteText?:string} | undefined = $state();
    
	let noteStore: Readable<Note[]> | undefined = $state(createStore(data.uid, data.notes));
	let sortMethod: HTMLButtonElement | undefined = $state();
	let oldSortMethod: string | null = null;
	
	let timeout:boolean = false;
	
	let initialize: boolean = false;

	//Sync note and delete storage data
	function updateNote(){

		const storageText = sessionStorage.getItem('text');
		if(!storageText)
			return;

		const updatedNote = JSON.parse(storageText);
		const oldNote = $noteStore!.find((note) => note.id === updatedNote.id)
		
		if(oldNote && oldNote.text !== updatedNote.text){
			sessionStorage.removeItem('text');
			return;
		}
		storageMethod('update', {id: updatedNote.id, text: updatedNote.text})
	
	}

	//Create right store with sort method selected
	function initializeSort(){

		if(!oldSortMethod && sortMethod){
			oldSortMethod = localStorage.getItem('sort');

			if(oldSortMethod === "Name"){
				noteStore = createStore(data.uid, data.notes, 'name');
				return;
			}

			if(oldSortMethod === null)
				oldSortMethod = sortMethod?.textContent!;
		}

	}

	$effect(() => {

		if(!initialize){

			if(sessionStorage.getItem('inNote') === 'false'){
				sessionStorage.setItem('inNote', 'true');
				if(sessionStorage.getItem('cached') !== 'true')
					window.location.reload();
			}

			initializeSort();
			updateNote();
			initialize=true;
		}

		// If sortMethod change update
		if(oldSortMethod && oldSortMethod !== sortMethod?.textContent)
			switch(sortMethod?.textContent){
				case 'Date':
					noteStore = createStore(data.uid, data.notes);
					oldSortMethod = 'Date';
					break;
				case 'Name':
					noteStore = createStore(data.uid, data.notes, 'name');
					oldSortMethod = 'Name';
			}

		// Hide error after 5 second
		if(form?.error && form?.error.submitter != "" && !timeout){
			setTimeout(() => {
				timeout=false;
				if(form)
					form.error.submitter = ""
			}, 10*1000);
			timeout = true;
		}
	})

	const storageAction: SubmitFunction = async ({action, formData, submitter, cancel}) => {
		const actionNote:string = action.search;
		const noteName = formData.get("noteName")?.toString();

		switch(actionNote){
			case '?/addNote':
				if(!noteName)
					cancel();

				formData.append("result", JSON.stringify(await storageMethod('add', {uid: data.uid, name: noteName})));
				break;
			case '?/deleteNote':
				if(!prop?.noteId)
					cancel();

				formData.append("result", JSON.stringify(await storageMethod('delete', {id: prop?.noteId})));
				break;
		}

		return async ({ result, update }) => {

			await applyAction(result);

			if(result.type === 'success')
				await update();

		}
	}
</script>

<Bar logout={true} />
<Notes bind:prop={prop} bind:sortMethod={sortMethod} notes={noteStore} submit={storageAction} submitError={form?.error} />