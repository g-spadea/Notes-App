import cookie from 'cookie';
import { onIdTokenChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/clientFirebaseConf';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const userStore = writable<User | null>(null);

if(browser){

	onIdTokenChanged(auth, async (user) => {
		//Aggiorna lo store
		userStore.set(user);

		//Se esiste un utente loggato, aggiorna il suo token (visto che è cambiato)
		const token = user ? await user?.getIdToken() : undefined;

		// Impostiamo il cookie di nome token con il valore del token se c'è e con le opzioni che
		// cookie sia valido in tutto il sito e abbia una durata indefinita (se esiste) o altrimenti
		// che scada immediatamente.
		document.cookie = cookie.serialize('__session', token ?? '', {
			path: '/',
			maxAge: token ? undefined : 0,
			// httpOnly: true,
            // secure: true
		});
	});

	// aggiorno ogni 10min il token prima che scada (default 1h)
	setInterval(
		async () => {
			if (auth.currentUser) {
				await auth.currentUser.getIdToken(true);
			}
		},
		10 * 60 * 1000
	);
}