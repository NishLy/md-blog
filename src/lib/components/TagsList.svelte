<script lang="ts">
	export let tags: string[] = [];

	let tagsWrapper: HTMLDivElement;
</script>

<div class="relative z-0 w-full">
	<button
		on:click={() => {
			tagsWrapper.scrollLeft -= 100;
		}}
		class="rounded-2xl flex-shrink-0 px-2 absolute left-[-2rem] top-[50%] translate-y-[-50%] radial-background"
		><i class="fa-solid fa-angle-left"></i>
	</button>
	<button
		on:click={() => {
			tagsWrapper.scrollLeft += 100;
		}}
		class="rounded-2xl flex-shrink-0 py-1 px-2 absolute right-[-2rem] top-[50%] translate-y-[-50%] radial-background"
		><i class="fa-solid fa-angle-right"></i>
	</button>
	<div bind:this={tagsWrapper} class="flex gap-2 justify-start w-full overflow-x-auto">
		<a href="/tags" class="rounded-2xl py-1 px-4 dark:bg-white dark:text-black flex-shrink-0">
			<span>
				<i class="fa-solid fa-magnifying-glass"></i>
			</span>
			<span>Explore </span>
		</a>
		{#each tags as tag}
			<a
				href={`/tag/${tag}`}
				class="rounded-2xl py-1 px-4 dark:bg-white dark:text-black flex-shrink-0"
			>
				<span>{tag}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.radial-background {
		background: radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 100%);
	}
</style>
