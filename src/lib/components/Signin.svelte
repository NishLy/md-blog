<script lang="ts">
	import { browser } from '$app/environment';
	import { logged, type Logged } from '$lib/state/session';

	let userLogged: Logged = {
		isLogged: false,
		isInvokingProtected: false,
		lastMessage: ''
	};

	logged.subscribe((cur) => {
		if (!browser) return;
		if (!cur.isLogged && cur.isInvokingProtected) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
		userLogged = cur;
	});
</script>

{#if !userLogged.isLogged && userLogged.isInvokingProtected}
	<div
		class="fixed z-50 top-0 left-0 w-screen h-screen bg-slate-800/20 flex flex-col justify-center items-center"
	>
		<div
			class="relative w-[90%] h-screen bg-white dark:bg-dark-primary gap-2 flex flex-col dark:text-white p-4 items-center justify-center"
		>
			<button
				class="absolute top-6 right-6"
				on:click={() => {
					logged.update((cur) => {
						return {
							...cur,
							isInvokingProtected: false
						};
					});
				}}
			>
				<i class="fa-solid fa-x"></i>
			</button>
			<h1 class="mb-6 font-bold text-center">{userLogged.lastMessage}</h1>
			<div class="flex gap-4 bg-white p-2 px-4 rounded-3xl dark:text-black items-center w-64">
				<i class="fa-brands fa-google"></i>
				<span>Sign In With Google</span>
			</div>
			<div class="flex gap-4 bg-white p-2 px-4 rounded-3xl dark:text-black items-center w-64">
				<i class="fa-brands fa-facebook"></i>
				<span>Sign In With Facebook</span>
			</div>

			<p class="mt-6 text-center text-neutral-300">
				Click “Sign up” to agree to Page Terms of Service and acknowledge that Page Privacy Policy
				applies to you.
			</p>
		</div>
	</div>
{/if}
