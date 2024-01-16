import { writable } from 'svelte/store';

export const sidemenu = writable({
	isOpen: false
});
