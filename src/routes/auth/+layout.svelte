<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Bar from '../components/bar.svelte';
	import { authMethod } from '$lib/firebase/auth/auth';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	
	let { children } = $props();
	
	let title:string = $state('');

	if(browser)
		sessionStorage.setItem('inNote', 'false');
	
	$effect( () => {
		title = $page.params.slug ? $page.params.slug : "notes";
	});

    const submitLoginData: SubmitFunction = async ({formData, action, submitter, cancel}) => {
		
		title = "waiting..";
		
		let networkStatus = sessionStorage.getItem('networkStatus');
		if(networkStatus === 'false')
			goto('/fallbackPost');

		const name = submitter?.getAttribute("name");
		const email = formData.get("email")?.toString();
		const password = formData.get("password")?.toString();

		switch(name){

			case 'google':
				formData.append("result", JSON.stringify(await authMethod(name)));
				break;

			case 'signin':
				formData.append("result", JSON.stringify(await authMethod(name, email, password)));
				break;

			case 'signup':
				const result = await fetch(action, {
					method: 'POST',
					body: formData
				});
				
				if(deserialize(await result.text()).type === 'success')
					formData.append("result", JSON.stringify(await authMethod(name, email, password)));
				break;
	
			case 'forgotpassword':
				formData.append("result", JSON.stringify(await authMethod(name, email)));
				break;
		}
		
		return async ({ result, update }) => {

			title = $page.params.slug;

			await applyAction(result);
			
			if(result.type === 'success')
				await update()
		}
	}
</script>

<Bar info={true}/>
<div class="content">
	<form method="POST" action="?/login" use:enhance={submitLoginData}>
		<div class="content-form">
			<div class="content-typing" style="--length: {title ? title.length == 0 ? Infinity : (title.length + 1) : Infinity}; --width: {title ? title.length + 1 : Infinity}ch">
				<div class="typing">{title}.</div>
			</div>
			<div class="content-input">
				{@render children()}
			</div>
		</div>
	</form>
</div>

<style>
	.content {
		position: relative;
		width: 100vw;
		height: 90dvh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content-typing {
		user-select: none;
		padding-bottom: 2%;
		padding-right: 4%;
		display: grid;
		place-items: center;
	}

	.typing {
		color: var(--primary-color);
		width: var(--width);
		animation:
			type 1.7s steps(var(--length)),
			blink 0.5s step-end infinite alternate;
		white-space: nowrap;
		overflow: hidden;
		border-right: 3px solid orange;
		font-family: monospace;
		font-size: calc((1/var(--length))*25em);
	}

	@keyframes type {
		from {
			width: 0;
		}
	}

	@keyframes blink {
		50% {
			border-color: transparent;
		}
	}

	form {
		zoom:120%;
		overflow: hidden;
		position: absolute;
		padding: 3em;
		width: fit-content;
		height: fit-content;
		background: linear-gradient(135deg, var(--content-shadow-color), rgba(255, 255, 255, 0));
		backdrop-filter: blur(9px);
		-webkit-backdrop-filter: blur(9px);
		border-radius: 20px;
		border: .15vw solid white;
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
		background-size: 400% 400%;
		transition: padding .7s;

		.content-input {
			display: flex;
			align-items: center;
			flex-direction: column;
			height: 70%;
			padding-top: 20px;
			padding-right: 5%;
			gap: 1em;
			transition: ease all .5s;
		}
	}

	@media only screen and (max-height: 600px), only screen and (max-width: 450px) {
		form {
			zoom:normal;
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			transform: translateY(-5%);
			width: 100%;
			height: 100dvh;
			overflow: hidden;
			padding: 0;
			border-top: 0;
			border-left: 0;
			border-radius: 0;
			border: none;
			box-shadow: none;

			.content-form {
				position: relative;
				width: fit-content;
				height: fit-content;
				top: 5dvh;

				@media only screen and (max-height: 400px) {
					display: flex;
					gap: 40px;
					justify-content: center;
					.content-input {
						padding-top: 0;
						gap: 5dvh;
					}
				}
			}

			@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
				transform: translateY(-15%);

				.content-form{
					top: 12dvh;
				}
			}
		}
	}

	@media only screen and (max-height: 350px) {
		.typing {
			font-size: calc((1/var(--length))*50vw)
		}
	}
</style>
