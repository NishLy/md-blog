/** @type {import('./$types').LayoutLoad} */

import { initializeFirebase, auth } from '$lib/firebaseApp';
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { logged } from '$lib/state/session';
import { App } from '$lib/state/app';

export async function load({ url }: { url: URL }) {
	if (browser) {
		try {
			initializeFirebase();
		} catch (ex) {
			console.error(ex);
		}
	}

	function getAuthUser(): Promise<false | import('firebase/auth').User> {
		return new Promise((resolve) => {
			onAuthStateChanged(auth, (user) => resolve(user ? user : false));
		});
	}

	async function invokeProtected(message: string) {
		const user = await getAuthUser();

		logged.update((state) => {
			state.isLogged = user ? true : false;
			state.isInvokingProtected = true;
			state.lastMessage = message;
			return state;
		});

		return user ? true : false;
	}

	const app = {
		name: 'SvelteKit',
		description: 'SvelteKit with Firebase',
		version: '0.0.1',
		baseUrl: 'http://localhost:3000',
		methods: {
			getAuthUser,
			invokeProtected
		}
	};

	App.set(app);

	return {
		app,
		getAuthUser: getAuthUser,
		url: url.pathname,
		invokeProtected
	};
}
