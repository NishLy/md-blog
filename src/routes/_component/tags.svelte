<script lang="ts">
	export let initialTags: string[] = [];
	let tags: string[] = [];

	let showTags: boolean = false;

	function addTag(tag: string) {
		if (tags.includes(tag)) return;
		tags = [...tags, tag];
	}

	function removeTag(tag: string) {
		tags = tags.filter((t) => t !== tag);
	}

	$: (() => {
		const input = document.querySelector('#tags') as HTMLInputElement;
		if (!input) return;
		input.value = tags.join(',');
	})();
</script>

<div>
	<input
		type="text"
		name="tags"
		hidden
		id="tags"
		placeholder="tags"
		class="w-full p-2 border-2 dark:text-black mb-2"
	/>
	<button
		class="w-full p-2 border-2 dark:text-black mb-2 flex flex-col"
		on:click={() => (showTags = !showTags)}
	>
		<div class="min-h-6">
			{#each tags as tag}
				<span class="bg-gray-200 rounded-2xl px-2 py-1 text-sm font-semibold text-gray-700 mr-2">
					{tag}
					{' '} <button on:click={() => removeTag(tag)}><i class="fa-solid fa-times"></i></button>
				</span>
			{/each}
		</div>
		{#if showTags}
			<hr class="mt-2" />
			<div class="mt-2 max-h-52 overflow-y-auto w-full">
				{#each initialTags as tag}
					<p class="dark:text-black relative text-start">
						{tag}
						<button
							on:click={() => addTag(tag)}
							class="absolute top-0 right-0 px-2 rounded-full bg-gray-200">ADD</button
						>
					</p>
				{/each}
			</div>
		{/if}
	</button>
</div>
