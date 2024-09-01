<script lang="ts">
	import type { ActionResult } from "@sveltejs/kit";
    import './style.css';

    let { text = $bindable(), result}:{
        text: string;
        result: ActionResult|undefined
    } = $props();
</script>

<div class="content-notes">
    <div class="text-form">
        {#if result?.type === 'failure'}
            <span id="error">{result.data!.name}</span>
        {/if}
        <textarea bind:value={text} name="text" spellcheck="false" class="note-text" placeholder="Write here" ></textarea>
    </div>
</div>