<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase.client';
	import { session } from '$lib/state/session';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let loggedIn: boolean = false;
	let photoURL: string = '';

	onMount(() => {
		if (!browser) return;
		session.subscribe((s) => {
			if (!s) return;
			loggedIn = !!s.loggedIn;
			photoURL = s.user?.photoURL ?? '';
		});
	});

	async function loginWithGoogle() {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider)
			.then((result) => {
				const { displayName, email, photoURL, uid } = result?.user;

				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;

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
			.catch((error) => {
				return error;
			});
	}
</script>

<header
	class="w-full h-18 p-4 px-6 sticky items-center flex border-b-[.1rem] border-black/50 dark:border-white/50 dark:text-white"
>
	<nav class="w-full">
		<ul class="flex items-center gap-x-4 w-full h-10">
			<li class="flex items-center">
				<a href="/" class="flex items-center">
					<span class="text-xl font-bold">Svelte</span>
				</a>
			</li>
			<li>
				<div class="flex justify-around items-center">
					<i class="fa-solid fa-magnifying-glass"></i>
					<input
						class="p-2 bg-transparent outline-none hidden lg:block"
						type="text"
						placeholder="Search..."
					/>
				</div>
			</li>
			<li class="flex items-center ml-auto gap-x-4">
				{#if loggedIn}
					<a href="/editor">
						<i class="fa-solid fa-pen-nib"></i>
						<span> write </span>
					</a>
					<div class="rounded-full w-10 h-10 bg-white/20">
						<img class="rounded-full w-10 h-10" src={photoURL} alt="profile" />
					</div>
				{:else}
					<a href="/editor">
						<i class="fa-solid fa-pen-nib"></i>
						<span> write </span>
					</a>
					<div class="p-1 px-3 rounded-2xl bg-white/10">
						<button on:click={loginWithGoogle}> Log in </button>
					</div>
				{/if}
			</li>
		</ul>
	</nav>
</header>
