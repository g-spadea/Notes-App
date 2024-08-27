<script lang="ts">
    import Bar from "../../bar.svelte";
    import { storageMethod } from "$lib/firebase/database/storage";
	import { type ActionResult } from "@sveltejs/kit";
	import { browser } from "$app/environment";
    
    let {data} = $props();
    
    let bar:Bar;
    let timer:NodeJS.Timeout;
    let storageText;
    if(browser)
        storageText = sessionStorage.getItem('text');
    if(storageText)
        data.note.text = JSON.parse(storageText).text;

    let text: string = $state(data.note.text);
    let result: ActionResult|undefined = $state();

    async function update(){
        if(bar.syncFunction)
            bar.syncFunction();
        result = await storageMethod('update', {id: data.note.id, text})
    }

    $effect(() => {
        sessionStorage.setItem('text', JSON.stringify({id:data.note?.id,text}));
        if(text != data.note.text && !timer)
            timer = setInterval(() => update(), 60 * 1000);
    
        if(text && text.includes('\n\n\n\n\n'))
            text = text.slice(0,text.length-1);
    })
</script>

<Bar bind:this={bar} back={true} sync={true} {update}/>
<div class="content-notes">
    <div class="text-form">
        {#if result?.type === 'failure'}
            <span id="error">{result.data!.name}</span>
        {/if}
        <textarea bind:value={text} name="text" spellcheck="false" class="note-text" placeholder="Write here" ></textarea>
    </div>
</div>


<style>

    .content-notes {
        position: absolute;
        width: 100vw;
        height: 100dvh;
        transform: translateY(5%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        bottom: 0px;
    }

    span#error {
        color: rgb(127, 0, 0);
        font-size: 1.4em;
        margin-bottom: 2%;
        text-wrap: nowrap;
        text-align: center;
    }

    .text-form {
        position: relative;
        width: fit-content;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        background: light-dark(rgba(255, 255, 255, 0.4), rgba(0, 0, 0, .1));
        backdrop-filter: blur(9px);
        -webkit-backdrop-filter: blur(9px);
        border-radius: 2em;
        border: .15vw solid white;
        box-shadow: 0 .8vw 3.2vw 0 rgba(0, 0, 0, 0.37);
        background-size: 400% 400%;
        transition: ease border-radius .4s, ease transform .4s;

        .note-text{
            padding: 1em;
            min-width: 50em;
            min-height: 20em;
            max-width: 90vw;
            max-height: 80dvh;
            background: transparent;
            border: none;
            outline:none;
            font-family: 'Courier New', Courier, monospace;
            font-size: 1.5em;
            caret-color: light-dark(black,orange);

            &::placeholder{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: light-dark(rgba(0, 0, 0, 0.516),rgba(255, 255, 255, 0.401));
            }
            
            &:focus{
                &::placeholder{
                    color:transparent;
                }
            }

            &::-webkit-scrollbar {
                width: .2em;
            }

            &::-webkit-scrollbar-thumb {
                background-color: rgba(255,255,255,1);
                border-radius: 2em;
            }

            &::-webkit-scrollbar-track {
                background-color: transparent;
                margin: 1.1em;
            }

            &::-webkit-scrollbar-corner {
               outline: 2em;
            }

            &::-webkit-resizer {
                border-bottom: .1em solid  rgba(255, 255, 255, 0.839);
                border-right: .1em solid  rgba(255, 255, 255, 0.839);
            }
        }
    }

    

    @media only screen and (max-height: 640px), only screen and (max-width: 695px) {
        .text-form{
            transform: translateY(-5%);
            width: 100vw;
            height: 100dvh;
            border-radius: 0;
            border: none;
            box-shadow: none;
            overflow: hidden;
            
            .note-text{
                position: absolute;
                bottom: 0;
                min-width: 100vw;
                min-height: 90dvh;
                max-width: 100vw;
                max-height: 90dvh;
                font-size: 4dvh;
                resize: none;
            }
        
            @media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
                .note-text{
                    font-size: 3vw;
                }
            }
        }
    }

</style>