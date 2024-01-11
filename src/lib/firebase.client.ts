// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { browser } from '$app/environment';
import { type Auth, getAuth, connectAuthEmulator } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export let db: Firestore;
export let app: FirebaseApp;
export let auth: Auth;
export let analytics: Analytics;

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	useEmulator: import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true',
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: 'md-blog-968db',
	storageBucket: 'md-blog-968db.appspot.com',
	messagingSenderId: '922617899521',
	measurementId: 'G-WH6LYV2FSL'
};

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		app = initializeApp(firebaseConfig);
		auth = getAuth(app);
		analytics = getAnalytics(app);

		if (firebaseConfig.useEmulator) {
			connectAuthEmulator(auth, 'http://127.0.0.1:9099');
		}
	}
};
