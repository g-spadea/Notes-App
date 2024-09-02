<script lang="ts">
	import { timeoutError } from "../components/shared";
	
	let {data, form} = $props();

	let timeout: boolean = false;

	$effect(() => {
		timeoutError(form, timeout);
	})

</script>

{#if form?.error}
	<span id="error">{form.error}</span>
{/if}

<input type="email" name="email" placeholder="Email" spellcheck="false" autocomplete='on' required/>

{#if data.slug == 'signin'}

	<input type="password" name= "password" placeholder= "Password" autocomplete="on" required/>
	<input type="submit" name={data.slug} id="submit-button" />
	<a href="forgotpassword" data-sveltekit-reload>Forgot Password?</a>
	
{:else if data.slug == 'signup'}

	<input type="password" name= "password" placeholder="Password" autocomplete="new-password" required/>
	<input 
	type="password" 
	name="confirm-password"
	pattern= "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&.#]{'{8,}'}"
	title = "Minimum of 8 characters. Requires at least: one digits and one uppercase character (Example32). (Optional special characters @$!%*?&.#)"
	placeholder= "Confirm Password"
	required/>
	<input type="submit" name={data.slug} formaction="?/register" id="submit-button" />

{:else if data.slug == 'forgotpassword'}

	<input type="submit" name={data.slug} id="submit-button" />

{/if}

<style>

	span#error {
		color: rgb(127, 0, 0);
		font-size: 1.1rem;
		padding-bottom: 2%;
		text-wrap: nowrap;
	}

	a {
		color: var(--primary-color);
	}

	input {
		background: var(--content-shadow-color);
		width: 13em;
		padding: 5%;
		border: 1px solid white;
		border-radius: 5000px;
		box-shadow: 4px 4px 60px var(--content-shadow-color);
		color: var(--primary-color);
		font-family: 'Courier New', Courier, monospace;
		font-size: 1em;
		text-shadow: 2px 2px 4px var(--content-shadow-color);
		transition:
			color 0.4s,
			box-shadow 1s;

		&::placeholder {
			font-size: 1em;
			color: var(--primary-color);
			opacity: 90%;
		}
	}

	input#submit-button {
		cursor: pointer;
		text-align: center;
	}

	input:-webkit-autofill,
	input:-webkit-autofill:hover, 
	input:-webkit-autofill:focus, 
	input:-webkit-autofill:active{
		-webkit-background-clip: text;
		-webkit-text-fill-color: var(--primary-color);
		background: var(--content-shadow-color);
	}


	@media only screen and (max-height: 400px) {

		span#error {
			font-size: 2.5vw;
		}

		input {
			width: 30vw;
			font-size: 2vw;
		}

		a {
			font-size: 2vw;
		}
		
		@media only screen and (max-device-width: 950px) and (max-device-height: 430px) and (orientation:landscape){
			span#error {
				font-size: 5dvh;
			}

			input {
				width: 60dvh;
				font-size: 5dvh;
			}

			a {
				font-size: 5dvh;
			}
		}
	}
</style>
