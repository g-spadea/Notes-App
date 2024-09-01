<script lang="ts">
	import { type SubmitFunction } from '@sveltejs/kit';
	import Notes from './components/notes.svelte';
	import Bar from "../../bar.svelte";
	import { applyAction } from '$app/forms';
	import { storageMethod } from '$lib/firebase/database/storage';
	import { createStore } from '$lib/store/noteStore';
	import type { Readable } from 'svelte/store';
	
	let {data, form} = $props();

	let prop: {noteId:string, noteText?:string}| undefined = $state();
    let noteStore: Readable<Note[]> | undefined = $state(createStore(data.uid, data.notes, 'name'));
	let timeout:boolean = false;
	let sortMethod: HTMLButtonElement | undefined = $state();
	let oldSortMethod: string | null = null;
	let initialize: boolean = false;

	function updateNote(){
		const storageText = sessionStorage.getItem('text');
		if(!storageText)
			return;
		const updatedNote = JSON.parse(storageText);
		const oldNote = $noteStore!.find((note) => note.id === updatedNote.id)
		if(oldNote && oldNote.text === updatedNote.text){
			sessionStorage.removeItem('text');
			return;
		}
		storageMethod('update', {id: updatedNote.id, text: updatedNote.text})
	}

	function initializeSort(){
		if(!oldSortMethod && sortMethod){
			oldSortMethod = localStorage.getItem('sort');

			if(oldSortMethod === "Name"){
				noteStore = createStore(data.uid, data.notes, 'name');
				return;
			}
			if(!oldSortMethod)
				oldSortMethod = sortMethod?.textContent!;
			
			noteStore = createStore(data.uid, data.notes);
		}
	}

	$effect(() => {

		if(!initialize){
			if(sessionStorage.getItem('inNote') === 'false'){
				sessionStorage.setItem('inNote', 'true');
				window.location.reload();
			}
			initializeSort();
			updateNote();
			initialize=true;
		}

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

		if(form?.error && form?.error.submitter != "" && !timeout){
			setTimeout(() => {
				timeout=false;
				if(form)
					form.error.submitter = ""
			}, 5000);
			timeout = true;
		}
	})

	const storageAction: SubmitFunction = async ({action, formData, submitter, cancel}) => {
		const actionNote:string = action.search;
		const noteName = formData.get("noteName")?.toString();
		const noteId = submitter?.getAttribute("name");

		switch(actionNote){
			case '?/addNote':
				if(!noteName)
					cancel();
				formData.append("result", JSON.stringify(await storageMethod('add', {uid: data.uid, name: noteName})));
				break;
			case '?/deleteNote':
				if(!noteId)
					cancel();
				formData.append("result", JSON.stringify(await storageMethod('delete', {id:noteId!})));
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