import { initializeFirebase } from '$lib/firebase.client';

export async function load() {
	try {
		initializeFirebase();
	} catch (e) {
		console.log(e);
	}
}
