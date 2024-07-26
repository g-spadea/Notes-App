<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Bar from '../bar.svelte';
	import { authMethod } from '$lib/firebase/auth';
	import { page } from '$app/stores';
	
	let title:string = $state('');
	$effect( () => {
		title = $page.params.slug ? $page.params.slug : "notes";
	});

	// Use:enhance ci permette di aggiungere logica lato client alla form in maniera tale
	// da poter chiamare i metodi Firebase e gestirli server-side
    const submitLoginData: SubmitFunction = async ({formData, action, submitter}) => {
		title = "waiting..";
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
				// Inviamo prima i dati per la verifica della password server-side
				await fetch(action, {
					method: 'POST',
					body: formData
				});
				formData.append("result", JSON.stringify(await authMethod(name, email, password)));
				break;
			case 'forgotpassword':
				formData.append("result", JSON.stringify(await authMethod(name, email)));
				break;
		}
		
		return async ({ result, update }) => {

			title = $page.params.slug;

			// Ripristina parte del comportamento di default (tranne InvalidateAll)
			// Questo mi permette di aggiornare la proprietà form
			await applyAction(result);
			
			// Ripristiniamo interamente comportamento di default
			// Questo mi permette di ricaricare la load del layout server
			if(result.type === 'success')
				await update()
		}
	}
</script>

<Bar />
<div class="content">
	<form method="POST" action="?/login" use:enhance={submitLoginData}>
		<div class="content-form">
			<div class="content-typing" style="--length: {title.length == 0 ? Infinity : (title.length + 1)}; --width: {title.length + 1}ch">
				<div class="typing">{title}.</div>
			</div>
			<div class="content-input">
				<slot />
			</div>
		</div>
	</form>
</div>

<style>
	.content {
		position: relative;
		width: 100vw;
		height: 90vh;
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
		position: absolute;
		padding: 3em;
		width: fit-content;
		height: fit-content;
		background: linear-gradient(135deg, var(--content-shadow-color), rgba(255, 255, 255, 0));
		backdrop-filter: blur(9px);
		-webkit-backdrop-filter: blur(9px);
		border-radius: 20px;
		border: 1.5px solid white;
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

	@media only screen and (max-height: 500px), only screen and (max-width: 450px) {
		form {
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			transform: translateY(-5%);
			width: 100%;
			height: 100vh;
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
				top: 5vh;

				@media only screen and (max-height: 400px) {
					display: flex;
					gap: 40px;
					justify-content: space-between;
					.content-input {
						padding-top: 0;
						gap: 2.7vw;
					}
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
