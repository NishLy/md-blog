<script>
	// @ts-nocheck

	import PostLong from '$lib/components/PostLong.svelte';

	export let data;
</script>

<div class="p-4 flex flex-col gap-6">
	{#if data}
		{#each data.userPosts as post}
			<PostLong {post} user={data.userData} />
		{/each}
	{/if}
</div>
