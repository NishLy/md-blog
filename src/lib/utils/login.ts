import { auth } from '$lib/firebaseApp';
import { session } from '$lib/state/session';
import type { FirebaseError } from 'firebase/app';
import {
	FacebookAuthProvider,
	GithubAuthProvider,
	GoogleAuthProvider,
	TwitterAuthProvider,
	signInWithPopup,
	type UserCredential,
	type User
} from 'firebase/auth';
import { fetchApi } from './httpWrapper';

export async function loginWith(providerName: Provider) {
	const provider = getProvider(providerName);
	await signInWithPopup(auth, provider)
		.then((result) => {
			if (!result) return;
			// eslint-disable-next-line prefer-const
			let { displayName, email, photoURL, uid } = result.user;

			const user: User & {
				reloadUserInfo?: {
					screenName: string;
				};
			} = result.user;

			if (providerName === Provider.Github && user.reloadUserInfo) {
				displayName = user.reloadUserInfo?.screenName || displayName;
			}

			fetchApi(`/api/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					displayName,
					email,
					photoURL,
					uid
				})
			})
				.then(() => {
					session.set({
						loggedIn: true,
						user: {
							displayName,
							email,
							photoURL,
							uid
						}
					});
				})
				.catch(() => {
					console.error('Error while creating user');
				});
		})
		.catch((error) => {
			return error;
		});
}

export enum Provider {
	Google,
	Facebook,
	Twitter,
	Github,
	Email
}

function getProvider(provider: Provider) {
	switch (provider) {
		case Provider.Google:
			return new GoogleAuthProvider();
		case Provider.Facebook:
			return new FacebookAuthProvider();
		case Provider.Twitter:
			return new TwitterAuthProvider();
		case Provider.Github:
			return new GithubAuthProvider();
		default:
			return new GoogleAuthProvider();
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCredentialsFromResult(result: UserCredential, provider: Provider) {
	switch (provider) {
		case Provider.Google:
			return GoogleAuthProvider.credentialFromResult(result);
		case Provider.Facebook:
			return FacebookAuthProvider.credentialFromResult(result);
		case Provider.Twitter:
			return TwitterAuthProvider.credentialFromResult(result);
		case Provider.Github:
			return GithubAuthProvider.credentialFromResult(result);
		default:
			return GoogleAuthProvider.credentialFromResult(result);
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCredentialsFromError(error: FirebaseError, provider: Provider) {
	switch (provider) {
		case Provider.Google:
			return GoogleAuthProvider.credentialFromError(error);
		case Provider.Facebook:
			return FacebookAuthProvider.credentialFromError(error);
		case Provider.Twitter:
			return TwitterAuthProvider.credentialFromError(error);
		case Provider.Github:
			return GithubAuthProvider.credentialFromError(error);
		default:
			return GoogleAuthProvider.credentialFromError(error);
	}
}
