<script lang="ts">
	import logo from '$lib/assets/white-logo.svg';
	import {authMethod} from "$lib/firebase/auth/auth";
	import {themeStore} from "$lib/store/themeStore";
	
	let {logout = false} = $props();
	let dialog:HTMLDialogElement, lightDark:HTMLLabelElement;
	let themeValue: boolean | null = $state($themeStore);
		
	$effect(() => {
		const savedValue: string | null = window.localStorage.getItem("theme");
		if(savedValue && $themeStore === null){
			themeValue = savedValue === "true" ? true : false;
			themeStore.set(themeValue);
		}
		if(themeValue !== $themeStore){
			themeStore.set(themeValue);
			window.localStorage.setItem("theme", JSON.stringify(themeValue));
		}
	});
	
	export function inDialog(dialog: HTMLDialogElement, event: PointerEvent){
		var rect = dialog.getBoundingClientRect();
		var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
		rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		if (!isInDialog)
			dialog.close();
	}

</script>

<dialog class="hidden-content" bind:this={dialog} onpointerdowncapture={(evt) => inDialog(dialog, evt)}>
	<ul>
		<li>
			<a href="https://github.com/g-spadea/SAW" draggable="false">Github Repository</a>
		</li>
		<li>
			<a href="https://github.com/g-spadea" draggable="false">About</a>
		</li>
	</ul>
	<!-- TODO: Version-->
</dialog>
<div class="menu">
	{#if logout}
		<form class="logout" method="POST">
			<button type="submit" onclick={() => authMethod('logout')} class="button-logout">
				<svg class="icon-logout" viewBox="0 -960 960 960">
					<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
				</svg>
			</button>
		</form>
	{/if}
	<button onclick={() => dialog.showModal()} class="menu-control">
		<img src={logo} id="logo" alt="" draggable="false"/>
	</button>
	<div class="light-dark">
		<button class="switch" onkeypress={(evt) => evt.code==="Enter"? lightDark.click(): evt.stopPropagation()}>
			<input id="theme-switch" type="checkbox" bind:checked={themeValue} />
			<label bind:this={lightDark} id="switch-control" for="theme-switch">
		</button>
	</div>
	</div>

<style>

	.logout{
		width: 5.5dvh;
		height: 5dvh;
		transition: scale .4s, transform .4s;
		
		.button-logout{
			position:absolute;
			border: none;
			background: transparent;
			cursor:pointer;
			scale: 1;
			transition: scale .4s;
			
			&:hover{
				scale: 1.2;
			}
		}
		
		.icon-logout{
			display: flex;
			width: 5.5dvh;
			height: 5dvh;
			fill: white;
		}

		@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
			width: 4.5vw;
			height: 4vw;

			.icon-logout{
				width: 4.5vw;
				height: 4vw;
			}
		}
	}

	.menu-control{
		background: transparent;
		border: none;
	}

	#logo {
		position: relative;
		z-index: 1;
		padding-bottom: 3%;
		display: block;
		max-width: 100%;
		width: 5.5dvh;
		height: 5dvh;
		scale: 1;
		user-select: none;
		transition: scale 0.5s;

		@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
			width: 4.5vw;
			height: 4vw;
		}
	}

	#logo:hover {
		scale: 1.2;
		cursor: pointer;
	}

	.hidden-content {
		position:fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		background: transparent;
		margin:auto;
		border: none;

		&::backdrop{
			background-color: rgba(0, 0, 0, 0.85);
		}
		
		&:not([open]) {
			pointer-events: none;
			opacity: 0;
			transform: translateY(100px);
		}

		&[open]{
			opacity: 1;
			scale: 1;
			transform: translateY(0%);
			transition: transform 1s, opacity .4s;

		}
	}

	.hidden-content ul {
		display: flex;
		justify-content: center;
		width: fit-content;
		flex-wrap: wrap;
		align-items: center;
		list-style: none;
		gap: 4vw;
		font-size: 2rem;
		text-wrap: nowrap;
		overflow: hidden;
	}

	.hidden-content ul li {

		a {
			color: white;
			text-decoration: none;
		}

		&:hover {
			a {
				color: rgb(255, 0, 0);
				transition: color 0.4s;
			}
		}
	}

	.menu {
		position: relative;
		z-index: 1;
		width: 100vw;
		height: 10dvh;
		padding: 1vw;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10%;

		@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
			height: 20dvh;
		}
	}

	.light-dark{
		display: flex;
		align-items: center;

		.switch{			
			border: none;
			background: transparent;
			transition: scale .4s, transform .4s;
		}
	}

	#theme-switch {
		display: none;
	}

	#switch-control {
		position: sticky;
		z-index: 1;
		display: flex;
  		justify-content: center;
		width: 8dvh;
		height: 4dvh;
		background: #93e6ef;
		border-radius: 4cm;
		box-shadow:
			rgba(0, 0, 0, 0.3) 0px 1dvh 3dvh,
			rgba(0, 0, 0, 0.22) 0px 1dvh 1dvh;
		transition: background 0.25s ease-in-out;
		cursor: pointer;
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 50%;
			height: 100%;
			background: #fbde0d;
			border-radius: inherit;
			box-shadow: 0 0 .6dvh 0.2dvh #fbde0d;
			transition:
				background 0.25s ease-in-out,
				box-shadow 0.25s ease-in-out,
				left 0.25s ease-in-out;
		}

		@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
			width: 7vw;
			height: 3.3vw;
			box-shadow:
			rgba(0, 0, 0, 0.3) 0px 1vw 3vw,
			rgba(0, 0, 0, 0.22) 0px 1vw 1vw;
			&::before {
				box-shadow: 0 0 .6vw .2vw #fbde0d;
			}
		}
		
	}

	#theme-switch:checked + #switch-control {
		background: #3e5a98;
		&::before {
			left: 50%;
			background: #fafbb2;
			box-shadow: 0 0 .6dvh 0.2dvh #fafbb2;
			
		}
		
		@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
			&::before{
				box-shadow: 0 0 .6vw .2vw #fafbb2;
			}
		}
	}

	@media only screen and (max-height: 500px), only screen and (max-width: 450px) {
		.menu {
			background: transparent;
			backdrop-filter: unset;
			-webkit-backdrop-filter: unset;
			border-radius: 0;
			border: none;
			box-shadow: none;
		}
	}

</style>
