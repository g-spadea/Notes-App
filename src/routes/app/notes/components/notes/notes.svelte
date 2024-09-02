<script lang='ts'>
	import ActionBar from "../action-bar/action-bar.svelte";
    import DeleteDialog from "../delete-dialog/delete-dialog.svelte";
	import AddDialog from "../add-dialog/add-dialog.svelte";
	import { type SubmitFunction } from "@sveltejs/kit";
	import type { Readable } from "svelte/store";
    import './notes.css';

    let { prop=$bindable(), sortMethod=$bindable(), notes, submit, submitError } : {

        // Current note information
        prop: {noteId:string, noteText?:string}| undefined,
        
        // Current sort method
        sortMethod:HTMLButtonElement | undefined,
        
        notes: Readable<Note[] | null> | undefined,
        submit: SubmitFunction,
        submitError: {submitter: string; text: string;} | undefined
    } = $props();

    let deleteDialog: HTMLDialogElement = $state()!;
    let addDialog: HTMLDialogElement = $state()!;
    
    function formatDate(date: Date){
        return date.toString().slice(0, date.toString().indexOf("G"));
    }

    function openNote(id:string,text:string){
        sessionStorage.setItem('text', JSON.stringify({id,text}));
        return {noteId: id, noteText: text};
    }

    export function inDialog(dialog: HTMLDialogElement, event: PointerEvent){
		var rect = dialog.getBoundingClientRect();
		var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
		rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		if (!isInDialog)
			dialog.close();
	}

</script>

{#snippet noteSnippet(id:string, name:string, text: string, date: string)}

    <div id={name} class="note">
        
        <a 
            id="note-button" 
            href='/app/editor' 
            data-sveltekit-preload-code='eager' 
            onclick={() => {prop = openNote(id,text)}}>

            <span title={name}>{name}</span>
            <span title={date}>{date}</span>
        </a>

        <button 
            class="delete" 
            type="button" 
            title="Delete note"
            onclick={() => {prop={noteId:id}; deleteDialog.showModal();}}>

            <svg viewBox="0 -960 960 960">
                <path id="lid" d="M 768 -697 H 192 V -769 H 384 V -817 H 576 V -769 H 768 V -697"/>
                <path d="M 310 -144 Q 280.3 -144 259.15 -165.15 Q 240 -186.3 240 -216 V -697 H 720 V -217.43 Q 720 -186 698.85 -165 T 648 -144 H 312 Z M 646 -696 H 312 V -216 H 648 V -696 Z M 384 -288 H 456 V -624 H 384 V -288 Z M 504 -288 H 576 V -624 H 504 V -288 Z M 312 -696 V -216 V -696 Z"/>
            </svg>

        </button>
    </div>
{/snippet}

<DeleteDialog
    bind:dialog={deleteDialog}
    inDialog={inDialog} 
    {submitError}
    {submit}
/>

<AddDialog 
    bind:dialog={addDialog} 
    inDialog={inDialog} 
    {submitError} 
    {submit}
/>

<div class="content-notes" >
    <form id="notes-form" class="notes-form" method="GET">
        
        <ActionBar bind:sortMethod={sortMethod}/>
        
        {#if submitError?.submitter === "note"}
            <span id="error">{submitError.text}</span>
        {/if}

        <div class="notes">
            <!-- Add note -->
            <div class="note">
                <button 
                    class="new-note-button" 
                    type='button' 
                    title="Add notes" 
                    onclick={() => addDialog.showModal()} >
            
                    <span>
                        +
                    </span>
                </button>
            </div>

            <!-- Notes -->
            {#each $notes ? $notes : [] as note}
                {@render noteSnippet(note.id, note.name, note.text, formatDate(note.modified))}
            {/each}

        </div>
    </form>
</div>