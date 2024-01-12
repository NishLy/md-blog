<script lang="ts">
	import { onMount } from 'svelte';

	let loggedIn: boolean = false;
</script>

<header
	class="w-screen h-18 p-4 px-6 sticky items-center flex border-b-[.1rem] border-black/50 dark:border-white/50 dark:text-white"
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
					<div class="rounded-full w-10 h-10 bg-white/20">
						<img
							class="rounded-full w-10 h-10"
							src="https://avatars.githubusercontent.com/u/55942632?v=4"
							alt="profile"
						/>
					</div>
				{:else}
					<a href="/write">
						<i class="fa-solid fa-pen-nib"></i>
						<span> write </span>
					</a>
					<div class="p-1 px-3 rounded-2xl bg-white/10">
						<a href="/signin"> Log in </a>
					</div>
				{/if}
			</li>
		</ul>
	</nav>
</header>
