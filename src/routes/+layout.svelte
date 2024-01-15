<script lang="ts">
	/** @type {import('./$types').PageData} */
	import './app.css';
	import { onMount } from 'svelte';
	import { session, userDataStore } from '$lib/state/session';
	import Navbar from '$lib/components/navbar.svelte';
	import type { User } from '../repository/user';

	export let data;

	let loading: boolean = true;
	let loggedIn: boolean = false;
	let userData: User;

	session.subscribe((cur: any) => {
		loading = cur?.loading;
		loggedIn = cur?.loggedIn;
	});

	userDataStore.subscribe((cur: any) => {
		userData = cur;
	});

	onMount(async () => {
		const user: any = await data.getAuthUser();
		const loggedIn = !!user && user?.emailVerified;

		session.update((cur: any) => {
			loading = false;
			return {
				...cur,
				user,
				loggedIn,
				loading: false
			};
		});

		try {
			const data = await fetch('/api/user/' + user?.uid);

			const res = await data.json();

			userDataStore.update((cur: any) => {
				return {
					...cur,
					...res
				};
			});
		} catch (e) {
			console.log(e);
		}
	});
</script>

{#if loading}
	<div>Loading...</div>
{:else}
	<div class="dark:bg-dark-primary dark:text-white min-h-screen">
		<Navbar />
		<!-- Logged in: {loggedIn} -->
		<slot />
	</div>
{/if}
