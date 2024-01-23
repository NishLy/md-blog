<script lang="ts">
	export let onChange: ((e: string[]) => void) | null = null;

	export let allTags: string[] = [];
	export let initialTags: string[] = [];

	let tags: string[] = initialTags;

	let showTags: boolean = false;

	function addTag(tag: string) {
		if (tags.includes(tag)) return;
		tags = [...tags, tag];
		onChange && onChange(tags);
	}

	function removeTag(tag: string) {
		tags = tags.filter((t) => t !== tag);
		onChange && onChange(tags);
	}
</script>

<div>
	<button
		type="button"
		class="w-full p-2 border-2 dark:text-black mb-2 flex flex-col"
		on:click={() => (showTags = !showTags)}
	>
		<div class="min-h-6">
			{#each tags as tag}
				<span class="bg-gray-200 rounded-2xl px-2 py-1 text-sm font-semibold text-gray-700 mr-2">
					{tag}
					{' '}
					<button type="button" on:click={() => removeTag(tag)}
						><i class="fa-solid fa-times"></i></button
					>
				</span>
			{/each}
		</div>
		{#if showTags}
			<hr class="mt-2" />
			<div class="mt-2 max-h-52 overflow-y-auto w-full">
				{#each allTags as tag}
					<p class="dark:text-black relative text-start">
						{tag}
						<button
							type="button"
							on:click={() => addTag(tag)}
							class="absolute top-0 right-0 px-2 rounded-full bg-gray-200">ADD</button
						>
					</p>
				{/each}
			</div>
		{/if}
	</button>
</div>
