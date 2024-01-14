<script>
	import Post from '$lib/components/Post.svelte';
	export let data;
</script>

<svelte:head>
	<title>All Page about {data.props?.tag.name}</title>
</svelte:head>

<div class="flex flex-col gap-6 p-8 max-w-6xl items-center">
	<h1 class="text-3xl font-bold text-center">All Page about {data.props?.tag.name}</h1>
	<h6 class="dark:text-neutral-300">
		Topic - {data.props?.tag.followers} Followers - {data.props?.tag.count} Posts
	</h6>
	<button class="rounded-2xl dark:bg-white dark:text-black p-2 px-4"> Follow </button>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
		{#if data.props}
			{#each data.props?.posts as post}
				<Post user={post.user} post={post.post} />
			{/each}
		{/if}
	</div>
</div>
