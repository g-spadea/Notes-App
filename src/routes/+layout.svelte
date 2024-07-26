<script lang="ts">
	import { userStore } from "$lib/store/userStore";
	let { children } = $props();
</script>

{#snippet circle(name: string, pos:[number, number], dim:number)}
	<div class={name}
		style='
			position: absolute;
			transform: translate({pos[0]}%, {pos[1]}%);
			height: calc({dim}vh + 2em);
			width: calc({dim}vh + 2em);
			border-radius: 50%;
		'
	></div>
{/snippet}

<div class="circle">
	<div class="second"></div>
	{@render circle('circle-1', [70,30], 40)}
	{@render circle('circle-2', [-80,-40], 20)}
	{@render circle('circle-3', [600,-300], 5)}
	{@render circle('circle-4', [-500,200], 10)}
	{@render circle('circle-5', [-300,300], 2)}
	{@render circle('circle-6', [-600,-400], 5)}
	{@render circle('circle-7', [700,400], 2)}
</div>
{@render children()}

<style>
	.circle {
		z-index: -1;
		position: fixed;
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		animation: lightCircle 30s infinite alternate;
	}

	@keyframes lightCircle {
		from {
			scale: 1;
		}
		to {
			scale: 2;
		}
	}

	.circle-1 {
		background: linear-gradient(94deg, rgba(181,120,120,1) 15%, rgba(255,165,0,1) 58%, rgba(182,47,47,1) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(255, 166, 0, 0.315);
	}

    .circle-2 {
        background: linear-gradient(94deg, rgba(82,44,181,1) 15%, rgba(71,0,255,1) 58%, rgba(82,47,182,1) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(71,0,255,0.350);
    }

	.circle-3 {
		background: linear-gradient(94deg, rgba(44,59,181,1) 15%, rgba(0,84,255,1) 50%, rgba(77,83,255,1) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(0,182,255,1);
	}

	.circle-4 {
		background: linear-gradient(94deg, rgba(4,167,0,1) 15%, rgba(20,130,0,1) 50%, rgba(2,112,0,1) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(20,130,0,1);
	}

	.circle-5 {
		background: linear-gradient(94deg, rgba(122,0,64,1) 15%, rgba(178,16,16,1) 50%, rgba(194,0,0,1) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(178,16,16,1);
	}

	.circle-6 {
		background: linear-gradient(94deg, rgb(133, 132, 107) 15%, rgb(189, 189, 139) 50%, rgba(130,130,9,1) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(255,255,188,1);
	}

	.circle-7 {
		background: linear-gradient(94deg, rgba(136,5,132,1) 15%, rgba(216,48,164,1) 50%, rgba(169,82,165,1) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(216,48,164,1);
	}

	:root {
		color-scheme: light;
		--primary-color: light-dark(#333, #ffffff);
		--primary-background: light-dark(#cbcbcb, #373737);
		--navigator-color: light-dark(#716853, #817862);
		--form-color: light-dark(rgba(255, 255, 255, 0.208), rgba(61, 61, 61, 0.753));
		--content-shadow-color: light-dark(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.03));
		--background-shadow: light-dark(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6));
		--primary-color-reverse: light-dark(#efefec, #333);
		--google-background: light-dark(rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0.1));
		--signin-backgound: light-dark(rgba(0, 0, 0, 0.50),rgba(255, 255, 255, 0.85));
        --signup-backgound: light-dark(rgba(255, 255, 255, 0.65),rgba(24, 24, 24, .9));

		background-color: rgb(21, 21, 21);
	}
</style>