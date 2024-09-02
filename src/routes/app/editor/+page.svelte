<script lang="ts">
    import Bar from "../../components/bar.svelte";
    import Editor from "./components/editor.svelte";
    import { storageMethod } from "$lib/firebase/database/storage";
	import { type ActionResult } from "@sveltejs/kit";
	import { goto } from "$app/navigation";
    
    let bar:Bar;

    let storageNote: {id: string, text: string};
    let text: string = $state('');

    let timer:NodeJS.Timeout;
    let result: ActionResult|undefined = $state();
    
    let initialize: boolean = false;

    async function syncNote(){
        if(bar)
            bar.syncFunction();
        result = await storageMethod('update', {id: storageNote.id, text: storageNote.text})
    }

    $effect(() => {

        if(!initialize){
            const store = sessionStorage.getItem('text');
            if(!store)
                goto('/app/notes');
            storageNote = JSON.parse(store!);
            text = storageNote.text;
            initialize = true;
        }

        sessionStorage.setItem('text', JSON.stringify({id:storageNote.id,text}));
        
        if(text != storageNote.text && !timer)
            timer = setInterval(() => syncNote(), 60 * 1000);
    
        if(text && text.includes('\n\n\n\n\n'))
            text = text.slice(0,text.length-1);
    })
</script>

<Bar bind:this={bar} back={true} sync={true} {syncNote}/>
<Editor bind:text={text} {result}/>