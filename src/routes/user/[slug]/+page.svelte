<script lang="ts">
	import PostLong from '$lib/components/PostLong.svelte';
	import { fetchApi } from '$lib/utils/httpWrapper';

	export let data;

	let observer: IntersectionObserver | undefined = undefined;
	let isEnd = false;

	let postsWrapper: HTMLDivElement | undefined = undefined;
	let fetchedPosts = data.userPosts || [];

	async function fetchPage(after: string) {
		try {
			const res = await fetchApi(`/api/user/${data.userData?.uid}/page?after=${after}`);
			fetchedPosts = [...fetchedPosts, ...res.body.data];

			if (res.body.data.length < 10) {
				observer?.disconnect();
				observer = undefined;
				isEnd = true;
			}
		} catch (e) {}
	}

	$: {
		if (postsWrapper && fetchedPosts.length > 0 && !observer && !isEnd) {
			observer = new IntersectionObserver(
				(entries) => {
					console.log(entries[0].isIntersecting);
					if (entries[0].isIntersecting) {
						const after = fetchedPosts[fetchedPosts.length - 1].date;
						fetchPage(after);
					}
				},
				{
					root: null,
					rootMargin: '0px',
					threshold: 1.0
				}
			);

			observer.observe(postsWrapper.lastElementChild!);
		}
	}
</script>

<div class="p-4 flex flex-col gap-6 overflow-y-auto" bind:this={postsWrapper}>
	{#if data.userData && data.userPosts}
		{#each fetchedPosts as post}
			<PostLong {post} user={data.userData} />
		{/each}
	{/if}
</div>
