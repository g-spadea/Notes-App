<script lang='ts'>
	import ActionBar from "./action-bar.svelte";
    import DeleteDialog from "./delete-dialog.svelte";
	import AddDialog from "./add-dialog.svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
	import type { Readable } from "svelte/store";

    let {notes, submit, submitError}: {
        notes: Readable<Note[] | null>, 
        submit: SubmitFunction, 
        submitError: {submitter: string; text: string;} | undefined
    } = $props();
    
    export function inDialog(dialog: HTMLDialogElement, event: PointerEvent){
		var rect = dialog.getBoundingClientRect();
		var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
		rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		if (!isInDialog)
			dialog.close();
	}

    let deleteDialog: HTMLDialogElement = $state()!;
    let addDialog: HTMLDialogElement = $state()!;
    let prop:{noteId:string}| undefined = $state()

</script>

{#snippet noteSnippet(id:string, name:string, date:Date)}
    <div id={name} class="note">
        <!-- TODO: Open text editor -->
        <button type="submit">
            <span title={name}>{name}</span>
            <span title={date.toUTCString()}>{date.toUTCString()}</span>
        </button>
        <button type="button" class="delete" onclick={() => {
                prop={noteId:id}
                deleteDialog.showModal(); 
            }}>
            <svg viewBox="0 -960 960 960">
                <path id="lid" d="M 768 -697 H 192 V -769 H 384 V -817 H 576 V -769 H 768 V -697"/>
                <path d="M 310 -144 Q 280.3 -144 259.15 -165.15 Q 240 -186.3 240 -216 V -697 H 720 V -217.43 Q 720 -186 698.85 -165 T 648 -144 H 312 Z M 646 -696 H 312 V -216 H 648 V -696 Z M 384 -288 H 456 V -624 H 384 V -288 Z M 504 -288 H 576 V -624 H 504 V -288 Z M 312 -696 V -216 V -696 Z"/>
            </svg>
        </button>
    </div>
{/snippet}

<DeleteDialog bind:dialog={deleteDialog} inDialog={inDialog} {submitError} {submit} {prop}/>
<AddDialog bind:dialog={addDialog} inDialog={inDialog} {submitError} {submit}/>
<div class="content-notes">
    <form id="notes-form" class="notes-form" method="POST" use:enhance={submit}>
        <ActionBar/>
        <div class="notes">
            <div class="note">
                <button type='button' class="new-note-button" onclick={() => addDialog.showModal()}>
                    <span>
                        +
                    </span>
                </button>
            </div>
            {#each $notes ? $notes : [] as note}
                {@render noteSnippet(note.id, note.name, note.modified)}
            {/each}
        </div>
    </form>
</div>

<style>

    .content-notes {
        position: absolute;
        width: 100vw;
        height: 90dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 0px;
    }

    .notes-form {
        zoom: 110%;
        position: relative;
        width: 30em;
        height: 30em;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        box-sizing: border-box;
        background: light-dark(rgba(255, 255, 255, 0.4), rgba(0, 0, 0, .1));
        backdrop-filter: blur(9px);
        -webkit-backdrop-filter: blur(9px);
        border-radius: 20px;
        border: .15vw solid white;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        background-size: 400% 400%;
        transition: ease all 0.4s;
    }

    .notes {
        position:relative;
        display: flex;
        align-items: center;
        flex-direction: column;
        overflow-y: auto;
        margin-top: 1.5em;
        gap: .3em;
        height: 80%;
        transition: ease all 0.4s;

        &::-webkit-scrollbar {
            width: .2em;
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,1);
            border-radius: 1em;
        }

        &::-webkit-scrollbar-track {
            background-color: transparent;
            margin: .1em;
        }

        .note {
            width: 90%;
            background: light-dark(rgba(255, 255, 255, .8), rgba(255, 255, 255, 0.05));
            border-radius: 1em;
            border: .1em solid var(--primary-color);
            border-left: .3em solid var(--primary-color);
            display: flex;
            justify-content: center;
            align-items: center;
            scale:1;
            transition: box-shadow .4s, opacity .4s, scale .4s, background .4s;

            &:first-child{
                border-left: none;
                border: .15em solid var(--primary-color);
                padding: 1em;
                background: transparent;
                transition: ease all .4s;
                
                &:hover{
                    margin-bottom: 1em;
                }
                
                .new-note-button{
                    position:absolute;
                    cursor: pointer;
                    width: 100%;
                    height: 100%;
                    background: light-dark(rgba(255, 255, 255, 0.707) ,rgba(0, 0, 0, 0.309));
                    border-radius: 1em;
                    
                    border: none;
                    
                    span {
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 1.7rem;
                    }
                
                }
            }


            button[type="submit"] {
                cursor: pointer;
                background: transparent;
                padding: 1.3em;
                border: none;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                
                span{
                    width: 45%;
                    font-family: 'Courier New', Courier, monospace;
                    color: light-dark('', white);
                    font-size: .8rem;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

            }
            
            .delete {
                position: absolute;
                right: 2em;
                z-index: 1;
                width: 20px;
                height: 20px;
                background: transparent;
                cursor: pointer;
                border: none;

                svg{
                    height: 100%;
                    width: 100%;
                    fill:var(--primary-color);

                    #lid{
                        transform-origin: top;
                        transition: transform 200ms;
                    }

                    &:hover #lid{
                        transform: translateY(-10%) rotate(15deg);
                    }
                }
            }

            &:hover {
                opacity: 1;
                background: light-dark(rgb(255, 255, 255, 1), rgba(28, 33, 63, 0.7));
                scale: 1.02;
                box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3), 0px 2px 0px rgba(0, 0, 0, 0.2);
            }
        }
    }

    @media only screen and (max-height: 640px), only screen and (max-width: 695px) {

        .notes-form {
            zoom: normal;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(-5%);
            width: 100%;
            height: 100dvh;
            overflow-x: hidden;
            padding: 0;
            border-radius: 0;
            border: none;
            box-shadow: none;
            transition: ease padding .4s;
        }

        .notes {
            margin-top: 0;
            width: 100vw;
            height: 80dvh;
            justify-content: center;
            align-items: center;
            flex-flow: row wrap;
            overflow-x: hidden;
            gap: 2dvh;
            padding: 2em;
            transition: gap .4s;

            @media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
                height: 72dvh;
            }
            
            .note {
                width: fit-content;
                max-width: 70vw;
                height: 8em;
                flex-direction: column;
                flex-wrap: wrap;
                justify-content: unset;
                align-items: center;
                gap: 1em;
                transition: box-shadow 0.2s, background .5s, margin .4s;

                &:first-child{
                    padding: 0;
                    
                    .new-note-button{
                        position:relative;
                        padding: 3em;
                    }
                }

                button[type="submit"] {
                    
                    flex-direction: column;
                    gap: 1em;
                    width: 100%;
                    height: 100%;
                    
                    span {
                        font-size: 1.2em;
                        width: 100%;
                        text-align: center;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }

                .delete {
                    width: fit-content;
                    height: fit-content;
                    justify-content: center;
                    align-items: center;
                    display: flex;
                    bottom: 1.5em;
                    right: auto;

                    @media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation: landscape),
                    only screen and (max-device-width: 430px) and (max-device-height: 932px) and (orientation: portrait){
                        width: 6em;
                        height: 4em;
                        bottom: .4em;
                    }

                    svg {
                        width: 1.8em;
                        height: 1.8em;
                    }
                }

                &:hover {
                    position: relative;
                    background: light(white,blue);
                    scale: none;
                    margin-top: 5dvh;
                    margin-bottom: 5dvh;
                    z-index: 1;

                    &::after, &::before{
                        content: '';
                        z-index: -1;
                        display: block;
                        position: absolute;
                        height: 50px;
                        width: 100%;
                    }

                    &::after{
                        bottom:-2em;
                    }

                    &::before{
                        top: -2em;
                    }
                }
            }
        }
    }

</style>