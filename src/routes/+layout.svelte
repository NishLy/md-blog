<script lang="ts">
	/** @type {import('./$types').PageData} */
	import './app.css';
	import { onMount } from 'svelte';
	import { session } from '$lib/state/session';
	import Navbar from '$lib/components/navbar.svelte';

	export let data;

	let loading: boolean = true;
	let loggedIn: boolean = false;

	session.subscribe((cur: any) => {
		loading = cur?.loading;
		loggedIn = cur?.loggedIn;
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
