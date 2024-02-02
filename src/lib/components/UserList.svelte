<script lang="ts">
	import { simplyfyNumber } from '$lib/utils/number';

	export let users: {
		uid: string;
		displayName: string;
		about: string;
		photoURL: string;
		followersCount: number;
	}[] = [];

	let usersWrapper: HTMLDivElement;
</script>

<div class="relative z-0 w-full">
	{#if users.length === 0}
		<p class="text-center">There's no user found</p>
	{:else}
		<button
			on:click={() => {
				usersWrapper.scrollLeft -= 100;
			}}
			class="rounded-2xl flex-shrink-0 p-2 absolute left-[-2rem] top-[50%] translate-y-[-50%] radial-background"
			><i class="fa-solid fa-angle-left"></i>
		</button>
		<button
			on:click={() => {
				usersWrapper.scrollLeft += 100;
			}}
			class="rounded-2xl flex-shrink-0 p-2 absolute right-[-2rem] top-[50%] translate-y-[-50%] radial-background"
			><i class="fa-solid fa-angle-right"></i>
		</button>
	{/if}
	<div
		bind:this={usersWrapper}
		class="flex gap-2 dark:text-white justify-start w-full overflow-x-auto"
	>
		{#each users as user}
			<a
				href="/tags"
				class="border-[1px] dark:border-white/30 dark:bg-black flex-shrink-0 w-48 h-64 flex flex-col p-4 gap-2 justify-center"
			>
				<img
					src="/images/placeholder.png"
					alt=""
					class="w-12 h-12 rounded-full border-[1px] dark:border-white/40"
				/>
				<div>
					<p class="text-sm font-bold">{user.displayName}</p>
					<p class="text-xs">{simplyfyNumber(user.followersCount)} Followers</p>
				</div>
				<p class="h-14 text-sm overflow-hidden text-ellipsis">
					{user.about}
				</p>
				<a href={`/profile/${user.uid}`}>
					<button class="dark:bg-white dark:text-black py-2 px-4 rounded-2xl"> Follow </button></a
				>
			</a>
		{/each}
	</div>
</div>

<style>
	.radial-background {
		background: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 100%);
	}
</style>
