import type { User } from 'firebase/auth';
import { type Writable, writable } from 'svelte/store';

export type AppState = {
	name: string;
	description: string;
	version: string;
	baseUrl: string;
	methods: {
		getAuthUser: () => Promise<User | false>;
		invokeProtected: (message: string) => Promise<boolean>;
	};
};
export const App = <Writable<AppState>>writable();
