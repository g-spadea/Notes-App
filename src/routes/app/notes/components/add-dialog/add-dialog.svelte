<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import './add-dialog.css';

	let {inDialog, dialog = $bindable(), submitError, submit} : {
		inDialog: (dialog: HTMLDialogElement, event: PointerEvent) => void,
		dialog:HTMLDialogElement,
		submitError: {submitter: string; text: string;} | undefined
		submit: SubmitFunction
		} = $props();
</script>

<dialog 
	bind:this={dialog} 
	class="add-dialog" 
	onpointerdown={(evt) => inDialog(dialog,evt)}>
	
	<form
		class='form-dialog'
		name="add" 
		method="POST" 
		action="?/addNote" 
		use:enhance={submit}
		onsubmit={() => dialog.close()} >

		<p id="dialog-text">New Note</p>
		
		<menu class="dialog-menu">
			{#if submitError?.submitter === "add"}
				<span id="error">{submitError.text}</span>
			{/if}
            
			<input id="text" name="noteName" autocomplete="off" type="text" placeholder="Note name">
            
			<div class="button">
                <button type="reset" onclick={() => dialog.close()}>Cancel</button>
                <button type="submit">Confirm</button>
            </div>
		</menu>
		
	</form>
</dialog>