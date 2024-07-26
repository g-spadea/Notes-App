<script lang="ts">
	import Button from './buttons.svelte'

	let {form} = $props();

</script>

{#if form?.error}
	<span id="error">{form.error}</span>
{/if}
<Button />

<style>

	span#error {
		color: rgb(127, 0, 0);
		font-size: 1.2em;
		padding-bottom: 2%;
		text-wrap: nowrap;
	}

	@media only screen and (max-height: 350px) {
		span#error {
			padding-bottom: 10%;
			font-size: 2.5vw;
		}
	}
	
</style>