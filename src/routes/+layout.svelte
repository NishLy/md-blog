<script lang="ts">
	/** @type {import('./$types').PageData} */
	import './app.css';
	import { onMount } from 'svelte';
	import { session } from '$lib/state/session';
	import { goto } from '$app/navigation';
	import Navbar from './_component/navbar.svelte';

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

		if (loggedIn) {
			goto('/');
		}
	});
</script>

{#if loading}
	<div>Loading...</div>
{:else}
	<div class="dark:bg-dark-primary min-h-screen">
		<Navbar />
		<div>
			Logged in: {loggedIn}
			<slot />
		</div>
	</div>
{/if}
