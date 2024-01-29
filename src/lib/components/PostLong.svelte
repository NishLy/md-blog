<script lang="ts">
	import { onMount } from 'svelte';
	import type { Blog } from '../repository/blog';
	import type { User } from '../repository/user';
	import { printRelativeTime } from '../utils/date';
	import { browser } from '$app/environment';
	import { session, userDataStore, type SessionState } from '$lib/state/session';
	import { goto } from '$app/navigation';
	import { App } from '$lib/state/app';
	import { fetchApi } from '$lib/utils/httpWrapper';

	export let user: User;
	export let post: Omit<Blog, 'content'>;

	let signInInvoker: ((message: string) => Promise<boolean>) | undefined = undefined;

	let userData: User;
	let sessionData: SessionState;
	let isOnBookmark: boolean = false;

	App.subscribe((cur: any) => {
		signInInvoker = cur.methods.invokeProtected;
	});

	session.subscribe((cur: any) => {
		sessionData = cur;
	});

	userDataStore.subscribe((cur: any) => {
		userData = cur;
		isOnBookmark = !!userData?.bookmarks?.includes(post.id);
	});

	$: (() => {
		if (!userData || !userData.bookmarks) return;
	})();

	onMount(async () => {
		if (browser) return;
	});

	async function toggleBookmark(idPost: string) {
		if (!browser) return;

		if (!signInInvoker) throw new Error('Sign in invoker is not defined');

		if (!(await signInInvoker('Sign in to bookmark this post'))) return;

		if (!sessionData.loggedIn || !sessionData.user) {
			return goto('/signin');
		}

		try {
			await fetchApi(`/api/bookmark/post/${idPost}`, {
				method: 'POST',
				body: JSON.stringify({
					uid: sessionData.user.uid
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			isOnBookmark = !isOnBookmark;
		} catch (e) {
			console.log(e);
		}
	}
</script>

<div class="flex flex-col gap-3 justify-start">
	<p class="flex items-center">
		<a
			href="/user/{user.uid}"
			class="inline-block text-sm text-gray-300 dark:text-neutral-200 text-ellipsis overflow-hidden w-60 truncate"
		>
			{user.displayName}
		</a>
	</p>
	<div class="flex justify-between gap-4">
		<div>
			<h1 class="text-lg">
				{post.title}
			</h1>
			<p class="h-11 overflow-hidden text-ellipsis text-sm opacity-80">
				{post.summary}
			</p>
		</div>
		<img
			src={post.thumbnailURL || '/images/placeholder.png'}
			alt="Thumbnail"
			loading="lazy"
			class="w-36 aspect-video object-scale-down dark:bg-white bg-black"
		/>
	</div>
	<div class=" flex justify-between w-full box-border">
		<div class="flex gap-4 text-sm">
			<div class="text-sm opacity-90">
				<div class="mb-2">
					{printRelativeTime(new Date(post.date))} · {post.readTime} Minutes read
				</div>
				<div>
					{#each post.tags as tag}
						<a
							href="/tag/{tag}"
							class="text-sm text-gray-300 py-1 px-2 rounded-2xl dark:bg-white dark:text-neutral-800"
							>{tag}</a
						>
					{/each}
				</div>
			</div>
		</div>
		<button
			type="button"
			on:click={(e) => {
				e.stopPropagation();
				toggleBookmark(post.id);
			}}
		>
			{#if isOnBookmark}
				<i class="fa-solid fa-bookmark"></i>
			{:else}
				<i class="fa-regular fa-bookmark"></i>
			{/if}
		</button>
	</div>
</div>
