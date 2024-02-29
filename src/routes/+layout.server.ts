import { initializeFirebase } from '$lib/firebaseApp';

export async function load() {
	try {
		initializeFirebase();
	} catch (e) {
		console.log(e);
	}
}
