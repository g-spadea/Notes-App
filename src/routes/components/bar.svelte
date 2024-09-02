<script lang="ts">
	import { enhance } from '$app/forms';
	import codeRepository from '$lib/assets/code.png';
	import {authMethod} from "$lib/firebase/auth/auth";
	import {themeStore} from "$lib/store/themeStore";
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
	import './bar.css';
	
	let {logout = false, back = false, info=false, sync=false, syncNote} : {
		logout?: boolean,
		back?: boolean,
		info?: boolean,
		sync?: boolean,
		syncNote?:() => Promise<void>,
	} = $props();

	let dialog:HTMLDialogElement = $state()!;

	let themeValue: boolean | null = $state($themeStore != null ? $themeStore : true);
	let lightDark:HTMLLabelElement;
	
	let syncIcon: SVGElement| undefined = $state();
    let syncCheck: boolean = false;
	
	let logoutButton: HTMLButtonElement|undefined = $state();
	let resultStore:ActionResult|undefined = $state();
	let interval:NodeJS.Timeout;

	let networkStatus: boolean|undefined;

	export function syncFunction(){
		if(!syncIcon)
			return;

        if(!syncCheck){
            syncIcon.classList.add('syncing');
            syncCheck = true;
            setTimeout(() => {
                syncIcon!.classList.remove("syncing");
                syncCheck=false;
            }, 2800)
        }
    }

	function iconOpacity(action: boolean){
		if(!logoutButton)
			return;
 
		if(action){
			logoutButton.style.opacity='1';
			logoutButton.style.pointerEvents='initial';
		}
		else{
			logoutButton.style.opacity='.3';
			logoutButton.style.pointerEvents='none';
		}
	}

	$effect(() => {
		
		if(logoutButton && !interval){
			interval = setInterval(() => {
				networkStatus = sessionStorage.getItem('networkStatus') === 'true' ? true : false;
				iconOpacity(networkStatus)
			},2000)
		}
		if(!logoutButton && interval)
			clearInterval(interval);

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

	const logoutAction: SubmitFunction = async ({submitter, formData}) => {
		const name = submitter?.getAttribute("name");

		if(name && name === 'logout')
			formData.append("result", JSON.stringify(await authMethod('logout')));

		
		return async ({ result, update }) => {
			if(result.type==='success')
				await update();
			else
				resultStore = result;
		}
	}

</script>

{#if sync}
	<div hidden class='syncing'></div>
{/if}

{#if info}
	<dialog class="hidden-content" bind:this={dialog} onpointerdowncapture={(evt) => inDialog(dialog, evt)}>
		<ul>
			<li>
				<a href="https://github.com/g-spadea/SAW" draggable="false">Github Repository</a>
			</li>
		</ul>
	</dialog>
{/if}

<div class="menu">

	{#if logout}
		<form class="action" action='?/logout' method="post" use:enhance={logoutAction}>
			<button bind:this={logoutButton} title="Logout" name='logout' class="button-logout">
				{#if resultStore}
					<svg class="icon-action" viewBox="0 -960 960 960" fill='#b04145'>
						<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
					</svg>
				{:else}
					<svg class="icon-action" viewBox="0 -960 960 960" fill='#ffffff'>
						<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
					</svg>
				{/if}
			</button>
		</form>
	{/if}

	{#if back}
		<form class="action" method="get">
				
			{#if sessionStorage.getItem("networkStatus") === "true" || sessionStorage.getItem("cached") === "true"}
				<a href='/app/notes' title="Return to notes" class="button-action">
					<svg class="icon-action" viewBox="0 -960 960 960" fill='#ffffff'>
						<path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
					</svg>
				</a>
			{:else}
				<a href='/app/notes' title="Return to notes" class="button-action" data-sveltekit-reload>
					<svg class="icon-action" viewBox="0 -960 960 960" fill='#ffffff'>
						<path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
					</svg>
				</a>
			{/if}

		</form>
	{/if}

	{#if sync}
		<div class="action">
			<button title="Sync current note with database" class="button-action" onclick={() => syncNote!()}>
				<svg bind:this={syncIcon} class="icon-action" viewBox="0 -960 960 960" fill='#ffffff'>
					<path d="M160-160v-80h109q-51-44-80-106t-29-134q0-112 68-197.5T400-790v84q-70 25-115 86.5T240-480q0 54 21.5 99.5T320-302v-98h80v240H160Zm440 0q-50 0-85-35t-35-85q0-48 33-82.5t81-36.5q17-36 50.5-58.5T720-480q53 0 91.5 34.5T858-360q42 0 72 29t30 70q0 42-29 71.5T860-160H600Zm116-360q-7-41-27-76t-49-62v98h-80v-240h240v80H691q43 38 70.5 89T797-520h-81ZM600-240h260q8 0 14-6t6-14q0-8-6-14t-14-6h-70v-50q0-29-20.5-49.5T720-400q-29 0-49.5 20.5T650-330v10h-50q-17 0-28.5 11.5T560-280q0 17 11.5 28.5T600-240Zm120-80Z"/>
				</svg>
			</button>
		</div>
	{/if}

	{#if info}
		<button title="Project info" onclick={() => dialog.showModal()} class="menu-control">
			<img src={codeRepository} id="logo" alt="Information icon for Github code project" draggable="false"/>
		</button>
	{/if}

	<div class="light-dark">
		<button title="Change theme color" class="switch" onkeypress={(evt) => evt.code==="Enter"? lightDark.click(): evt.stopPropagation()}>
			<input id="theme-switch" type="checkbox" bind:checked={themeValue} />
			<label bind:this={lightDark} id="switch-control" for="theme-switch">
		</button>
	</div>
	
</div>