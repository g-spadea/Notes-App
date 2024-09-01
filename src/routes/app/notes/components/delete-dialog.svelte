<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";

	let {inDialog, dialog = $bindable(), submitError, submit, prop} : {
		inDialog: (dialog: HTMLDialogElement, event: PointerEvent) => void, 
		dialog:HTMLDialogElement,
		submitError: {submitter: string; text: string;} | undefined,
		submit: SubmitFunction,
		prop: {noteId:string}| undefined
	} = $props();

</script>

<dialog bind:this={dialog} class="delete-dialog" onpointerdown={(evt) => inDialog(dialog,evt)}>
	<form method="POST" name="delete" action="?/deleteNote" onsubmit={() => dialog.close()} use:enhance={submit}>
		<p id="dialog-text">Remove this note?</p>
		<menu class="dialog-menu">
			{#if submitError?.submitter === "delete"}
				<span id="error">{submitError.text}</span>
			{/if}
			<button type="reset" onclick={() => dialog.close()}>Cancel</button>
			<button type="submit" name={prop?.noteId}>Confirm</button>
		</menu>
	</form>
</dialog>

<style>
    .delete-dialog{
		display: block;
		position:fixed;
		margin:auto;
		width: fit-content;
		height: fit-content;
		padding: 2.5em;
		background: linear-gradient(135deg, var(--content-shadow-color), rgba(255, 255, 255, 0));
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		border-radius: 20px;
		border: .15vw solid white;
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
		transition: opacity .3s, transform .3s;

		&::backdrop{
			backdrop-filter: blur(1px);
			-webkit-backdrop-filter: blur(1px);
		}

		&:not([open]) {
    		opacity: 0;
			transform: translateY(-100%);
		}

		&[open]{
			opacity: 1;
			transform: translateY(0%);
		}
		
		form{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			gap: .5em;

			#dialog-text{
				font-family: 'Courier New', Courier, monospace;
				font-size: 1.8rem;
			}

			.dialog-menu{

				display: flex;
				flex-direction: row;
				align-items: center;
				gap: .5em;

				span#error {
					color: rgb(127, 0, 0);
					font-size: 1.6em;
					margin-bottom: 2%;
					text-wrap: nowrap;
				}

				button{
					font-family: 'Courier New', Courier, monospace;
					font-size: 1.4rem;
					padding: .5em;
					border-radius: 10px;
					border: .10vw solid light-dark(black,white);
					background: var(--content-shadow-color);
					cursor: pointer;
					transform: scale(1);
					transition: transform 0.4s;

					&:hover{
						transform: scale(1.1);
					}
				}

				button[type="submit"]{
					background: light-dark(rgb(219, 83, 83),rgb(137, 43, 43)) ;
				}
			}
		}
	}

    @media only screen and (max-height: 400px), only screen and (max-width: 340px){
        .delete-dialog{		
            padding: 5vw;
            border-radius: 2vw;
            transition: ease all .3s, padding 0s;

            form{

                gap: 1vw;

                #dialog-text{
                    font-size: 6dvh;
                }
                
                .dialog-menu{
                    gap: 1vw;

					span#error {
						font-size: 4vw;
					}

                    button{
                        font-size: 5dvh;
                        padding: 1.2vw;
                        border-radius: 1vw;
                    }
                }
            }
        }
    }
</style>