/** @type {import('./$types').LayoutLoad} */

import { initializeFirebase, auth } from '$lib/firebase.client';
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { logged } from '$lib/state/session';

export async function load({ url }: { url: URL }) {
	if (browser) {
		try {
			initializeFirebase();
		} catch (ex) {
			console.error(ex);
		}
	}

	function getAuthUser() {
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

	return {
		getAuthUser: getAuthUser,
		url: url.pathname,
		invokeProtected
	};
}
