/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

const OFFLINE_PAGE = 'offlinePage.html'
const ASSETS = [
	...build,
	...files,
];

const sw = self as unknown as ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', async (event) => {
    if (event.request.method !== 'GET')
		return;
	
	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);
		const currentUrl: string | undefined = (await sw.clients.get(event.clientId))?.url;

		if(currentUrl && currentUrl?.includes('/auth') && url.origin === sw.origin){
			try{
				const response = await fetch(event.request)
				if(response.ok)
					return response;
			} catch {
				return await cache.match(OFFLINE_PAGE)
			}
		}
		
		if (ASSETS.includes(url.pathname)){
            const response = await cache.match(url.pathname);
            
			if (response) {
                return response;
			}
		}
        
		try {
			const response = await fetch(event.request);

			if (!(response instanceof Response))
				throw new Error('invalid response from fetch');

			if (response.status === 200)
				cache.put(event.request, response.clone());

			return response;
            
		} catch (err) {

			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			if (event.request.mode === "navigate"){
				const response = await cache.match(OFFLINE_PAGE);
				return response;
			}

			throw err;
		}
	}

	event.respondWith(respond());
});