<script lang="ts">
	import { browser } from '$app/environment';
	import Post from '$lib/components/Post.svelte';
	import { userDataStore } from '$lib/state/session';
	import { onMount } from 'svelte';
	export let data;

	let isFollowing = false;

	console.log(isFollowing);

	onMount(async () => {
		const user: any = await data.getAuthUser();
		try {
			const res = await fetch(`/api/tag/${data.props?.tag.id}?uid=${user?.uid}`);
			const json = await res.json();

			isFollowing = json.body.isFollowing;
		} catch (error) {
			isFollowing = false;
		}
	});

	async function toogleFollow() {
		if (!browser) return;
		if (!(await data.invokeProtected(`Never miss a story about ${data.props?.tag.name}`))) return;
		try {
			const user: any = await data.getAuthUser();

			await fetch(`/api/tag/${data.props?.tag.id}`, {
				method: 'POST',
				body: JSON.stringify({
					uid: user.uid
				})
			});

			isFollowing = !isFollowing;
			console.log(isFollowing);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<svelte:head>
	<title>All Page about {data.props?.tag.name}</title>
</svelte:head>

<div class="flex flex-col gap-6 p-8 max-w-6xl items-center">
	<h1 class="text-3xl font-bold text-center">All Page about {data.props?.tag.name}</h1>
	<h6 class="dark:text-neutral-300">
		Topic - {data.props?.tag.followers} Followers - {data.props?.tag.count} Posts
	</h6>
	<button on:click={toogleFollow} class="rounded-2xl dark:bg-white dark:text-black p-2 px-4">
		{!isFollowing ? 'Follow' : 'Unfollow'}
	</button>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
		{#if data.props}
			{#each data.props?.posts as post}
				<Post user={post.user} post={post.post} />
			{/each}
		{/if}
	</div>
</div>
