<script lang="ts">
	import { auth } from '$lib/firebase.client';
	import { session, type User, type UserData } from '$lib/state/session';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { sidemenu } from '$lib/state/sidemenu';

	let loggedIn: boolean = false;
	let photoURL: string = '';
	export let signInInvoker: (message: string) => Promise<boolean>;

	let navbarEl: HTMLElement;

	onMount(() => {
		if (!browser) return;
		session.subscribe((s) => {
			if (!s) return;
			loggedIn = !!s.loggedIn;
			photoURL = s.user?.photoURL ?? '';
		});

		document.addEventListener('scroll', (ev) => {
			if (window.scrollY === 0) {
				navbarEl?.classList.add('fixed');
			} else {
				navbarEl?.classList.remove('fixed');
			}
		});
	});
</script>

<header
	bind:this={navbarEl}
	class="z-50 dark:bg-dark-primary top-0 left-0 w-full h-18 p-4 px-6 sticky items-center flex border-b-[.1rem] border-black/50 dark:border-white/50 dark:text-white"
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
					<div class="rounded-full w-10 h-10 bg-white/20 md:relative lg:relative">
						<button
							on:click={() => {
								sidemenu.update((s) => {
									s.isOpen = !s.isOpen;
									return s;
								});
							}}
						>
							<img class="rounded-full w-10 h-10" src={photoURL} alt="profile" />
						</button>
					</div>
				{:else}
					<button
						on:click={async () => {
							if (!(await signInInvoker('Create an account to start writting'))) return;
						}}
					>
						<i class="fa-solid fa-pen-nib"></i>
						<span> write </span>
					</button>
					<div class="p-1 px-3 rounded-2xl bg-white/10">
						<button
							on:click={async () => {
								if (!(await signInInvoker('Sign in to explore more'))) return;
							}}
						>
							Sign in
						</button>
					</div>
				{/if}
			</li>
		</ul>
	</nav>
</header>
