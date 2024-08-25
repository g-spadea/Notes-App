<script lang="ts">
	import Bar from "../../bar.svelte";

    let {children} = $props();
    let bar: Bar;

</script>

<Bar bind:this={bar} logout={true}/>
{@render children()}