<script lang="ts">
	/** @type {import('./$types').PageData} */
	import './app.css';
	import { onMount } from 'svelte';
	import { logged, session, userDataStore } from '$lib/state/session';
	import Navbar from '$lib/components/navbar.svelte';
	import type { User } from '$lib/repository/user';
	import Sidemenu from '$lib/components/Sidemenu.svelte';
	import Signin from '$lib/components/Signin.svelte';
	import { fetchApi } from '$lib/utils/httpWrapper';

	export let data;

	let loading: boolean = true;
	let loggedIn: boolean = false;
	let userData: User;

	session.subscribe(async (cur) => {
		loading = !!cur?.loading;
		loggedIn = !!cur?.loggedIn;

		if (!cur?.user) return;
		try {
			const data = await fetchApi('/api/user/' + cur.user?.uid);

			userDataStore.update((cur: any) => {
				return {
					...cur,
					...data.body
				};
			});

			logged.update((cur) => {
				return {
					lastMessage: '',
					isInvokingProtected: false,
					isLogged: loggedIn
				};
			});
		} catch (e) {
			console.log(e);
		}
	});

	userDataStore.subscribe((cur: any) => {
		userData = cur;
	});

	onMount(async () => {
		const user: any = await data.getAuthUser();
		const loggedIn = !!user && !user.isAnonymous;

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
		<Navbar signInInvoker={data.invokeProtected} />
		<!-- Logged in: {loggedIn} -->
		<slot />
	</div>
	<Sidemenu />
	<Signin />
{/if}
