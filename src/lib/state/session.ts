import { writable, type Writable } from 'svelte/store';

export type User = {
	email?: string | null;
	displayName?: string | null;
	photoURL?: string | null;
	uid?: string | null;
};

export type SessionState = {
	user: User | null;
	loading?: boolean;
	loggedIn?: boolean;
};

export const session = <Writable<SessionState>>writable();

export type UserData = {
	email: string;
	displayName: string;
	photoURL: string;
	uid: string;
	bookmarks: string[];
};

export const userDataStore = <Writable<UserData>>writable();
