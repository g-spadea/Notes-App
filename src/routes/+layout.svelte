<script lang="ts">
	import { browser, version } from "$app/environment";
	import { userStore } from "$lib/store/userStore";
	
	let { children } = $props();

	let networkStatus: boolean|undefined = $state();
	let interval: NodeJS.Timeout;

	function showNotification(status: boolean) {
		Notification.requestPermission().then((result) => {
			if(result === 'granted') {
				navigator.serviceWorker.ready.then((notify) => {
					notify.showNotification(status ? 'Notes is online' : 'Notes is offline', {
						icon: "/pwa-192x192.png",
					});
				})
			}
		})
	}

	async function cacheIsFull(){
		if(!caches.has(`cache-${version}`))
			return;

		const cache = await caches.open(`cache-${version}`);
		if((await cache.keys()).some((request) => request.url.includes('x-sveltekit-invalidated')))
			sessionStorage.setItem('cached', 'true');
		else 
			sessionStorage.setItem('cached', 'false');
	}

	async function checkNetwork() {
		return fetch(window.origin, {
			method: 'HEAD',
		}).then(response => {
			if(response.ok)
				return true;
			throw new Error('Network error');
		}).catch(() => {
			return false;
		})
	}

	async function updateFound(){
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if(newSW.state === 'installed')
					if(confirm('New update! Reload page?')){
						newSW.postMessage({type:'SKIP_WAITING'})
						window.location.reload();
					}
			})
		})
	}

	if(browser)
		updateFound();
	
	$effect(() => {

		const savedState = sessionStorage.getItem('networkStatus');

		if(networkStatus === undefined){

			if(savedState === null)
				sessionStorage.setItem('networkStatus', 'true');
			else 
				networkStatus = savedState === 'true' ? true : false;
			
			interval = setInterval(() => {
				checkNetwork().then(status => {
					networkStatus = status;
				})
				cacheIsFull();
			}, 2000);
			
			window.addEventListener("beforeunload", () => {
				if (interval) clearInterval(interval)
			})
			
			return;

		}

		if(savedState === null || networkStatus != (savedState === 'true' ? true : false)){
			showNotification(networkStatus);
			sessionStorage.setItem('networkStatus', networkStatus ? 'true' : 'false');
		}
	})

</script>

{#snippet circle(name: string, pos:[number, number], dim:number)}
	<div class={name}
		style='
			position: absolute;
			transform: translate({pos[0]}%, {pos[1]}%);
			height: calc({dim}dvh + 2em);
			width: calc({dim}dvh + 2em);
			border-radius: 50%;
		'
	></div>
{/snippet}

<div class="circle">
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
		height: 100dvh;
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
		background: linear-gradient(94deg, light-dark(rgba(181,120,120,1),rgba(181,120,120,.8)) 15%, light-dark(rgba(255,165,0,1), rgba(255,165,0,.8)) 58%, light-dark(rgba(182,47,47,1), rgba(182,47,47,.8)) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(255, 166, 0, 0.315);
	}

    .circle-2 {
		background: linear-gradient(94deg, light-dark(rgba(82,44,181,1), rgba(82,44,181,0.8)) 15%, light-dark(rgba(71,0,255,1), rgba(71,0,255,0.8)) 58%, light-dark(rgba(82,47,182,1), rgba(82,47,182,0.8)) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(71,0,255,0.350);
    }

	.circle-3 {
		background: linear-gradient(94deg, light-dark(rgba(44,59,181,1), rgba(44,59,181,0.8)) 15%, light-dark(rgba(0,84,255,1), rgba(0,84,255,0.8)) 50%, light-dark(rgba(77,83,255,1), rgba(77,83,255,0.8)) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(0,182,255,1);
	}

	.circle-4 {
		background: linear-gradient(94deg, light-dark(rgba(4,167,0,1), rgba(4,167,0,0.8)) 15%, light-dark(rgba(20,130,0,1), rgba(20,130,0,0.8)) 50%, light-dark(rgba(2,112,0,1), rgba(2,112,0,0.8)) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(20,130,0,1);
	}

	.circle-5 {
		background: linear-gradient(94deg, light-dark(rgba(122,0,64,1), rgba(122,0,64,0.8)) 15%, light-dark(rgba(178,16,16,1), rgba(178,16,16,0.8)) 50%, light-dark(rgba(194,0,0,1), rgba(194,0,0,0.8)) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(178,16,16,1);
	}

	.circle-6 {
		background: linear-gradient(94deg, light-dark(rgb(133, 132, 107), rgba(133, 132, 107, 0.8)) 15%, light-dark(rgb(189, 189, 139), rgba(189, 189, 139, 0.8)) 50%, light-dark(rgba(130,130,9,1), rgba(130,130,9,0.8)) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(255,255,188,1);
	}

	.circle-7 {
		background: linear-gradient(94deg, light-dark(rgba(136,5,132,1), rgba(136,5,132,0.8)) 15%, light-dark(rgba(216,48,164,1), rgba(216,48,164,0.8)) 50%, light-dark(rgba(169,82,165,1), rgba(169,82,165,0.8)) 100%);
		box-shadow: 0px 0px 10vw 2vw rgba(216,48,164,1);
	}

	:root {
		color-scheme: light;
		--primary-color: light-dark(#333, #ffffff);
		--content-shadow-color: light-dark(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.03));
		--primary-color-reverse: light-dark(#efefec, #333);
		--google-background: light-dark(rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0.1));
		--signin-backgound: light-dark(rgba(0, 0, 0, 0.50),rgba(255, 255, 255, 0.85));
        --signup-backgound: light-dark(rgba(255, 255, 255, 0.65),rgba(24, 24, 24, .9));

		background-color: rgb(21, 21, 21);
	}
</style>