<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import './delete-dialog.css';

	let {inDialog, dialog = $bindable(), submitError, submit } : {
		inDialog: (dialog: HTMLDialogElement, event: PointerEvent) => void, 
		dialog: HTMLDialogElement,
		submitError: {submitter: string; text: string;} | undefined,
		submit: SubmitFunction,
	} = $props();

</script>

<dialog 
	bind:this={dialog} 
	class="delete-dialog" 
	onpointerdown={(evt) => inDialog(dialog,evt)}>
	
	<form 
		class='form-dialog'
		name="delete" 
		method="POST" 
		action="?/deleteNote" 
		use:enhance={submit}
		onsubmit={() => dialog.close()}>

		<p id="dialog-text">Remove this note?</p>

		{#if submitError?.submitter === "delete"}
			<span id="error">{submitError.text}</span>
		{/if}

		<menu class="dialog-menu">
			<button type="reset" onclick={() => dialog.close()}>Cancel</button>
			<button type="submit">Confirm</button>
		</menu>
		
	</form>
</dialog>