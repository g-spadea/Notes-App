<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";

	let {inDialog, dialog = $bindable(), submitError, submit} : {
		inDialog: (dialog: HTMLDialogElement, event: PointerEvent) => void,
		dialog:HTMLDialogElement,
		submitError: {submitter: string; text: string;} | undefined
		submit: SubmitFunction
		} = $props();
</script>

<dialog bind:this={dialog} class="add-dialog" onpointerdown={(evt) => inDialog(dialog,evt)}>
	<form method="POST" name="add" use:enhance={submit} action="?/addNote">
		<p id="dialog-text">New Note</p>
		<menu class="dialog-menu">
			{#if submitError?.submitter === "add"}
				<span id="error">{submitError.text}</span>
			{/if}
            <input id="text" autocomplete="off" type="text" name="noteName" placeholder="Note name">
            <div class="button">
                <button type="reset" onclick={() => dialog.close()}>Cancel</button>
                <button type="submit">Confirm</button>
            </div>
		</menu>
	</form>
</dialog>

<style>
    .add-dialog{
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
		border: .15vw solid light-dark(rgba(0, 0, 0, 0.544), rgba(255, 255, 255, 0.715));
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
		transition: opacity .3s, transform .3s;

		&::backdrop{
            background: rgba(0, 0, 0, 0.364);
			backdrop-filter: blur(5px);
			-webkit-backdrop-filter: blur(5px);
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
			gap: 1em;

			#dialog-text{
				font-family: 'Courier New', Courier, monospace;
				font-size: 3.8rem;
                text-wrap: nowrap;
			}

			.dialog-menu{

                width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;

				span#error {
					color: rgb(127, 0, 0);
					font-size: 1.6em;
					margin-bottom: 2%;
					text-wrap: nowrap;
				}

                .button{
					margin-top: 1em;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1.5em;
                }

				button, input{
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

                input#text{
                    width: 90%;
                    border-radius: 20px;
                    text-align: center;
                    background: light-dark(rgba(255, 255, 255, 0.37), rgba(0, 0, 0, 0.07));

                    &:hover{
                        cursor: text;
                        transform: none;
                    }

                    &::placeholder{
                        text-align: center;
                    }
                }

				button[type="submit"]{
					background: light-dark(rgb(194, 109, 5),rgb(16, 12, 61)) ;
				}
			}
		}
	}

    @media only screen and (max-height: 400px), only screen and (max-width: 340px){
        .add-dialog{		
            padding: 5vw;
            border-radius: 2vw;
            transition: ease all .3s, padding 0s;

            form{

                gap: 1vw;
                flex-direction: row;

                #dialog-text{
                    font-size: 10dvh;
                    text-wrap: nowrap;
                }
                
                .dialog-menu{

					span#error {
						font-size: 4vw;
					}
                    
                    .button{
						margin-top: 2vw;
                        gap: 1vw;
                    }

                    button, input{
                        font-size: 5dvh;
                        padding: 1.2vw;
                        border-radius: 1vw;
                    }
                    
                    input#text{
                        width: 80%;
                    }
                }
            }
        }
    }
</style>