<script lang="ts">
	import { onMount } from 'svelte';
	import type { Blog } from '../repository/blog';
	import type { User } from '../repository/user';
	import { printRelativeTime } from '../utils/date';
	import { browser } from '$app/environment';
	import { session, userDataStore, type SessionState } from '$lib/state/session';
	import { goto } from '$app/navigation';

	export let user: {
		uid: string;
		displayName: string;
		photoURL: string;
	};
	export let post: Omit<Blog, 'content'>;
	export let signInInvoker: (message: string) => Promise<boolean>;

	let userData: User;
	let sessionData: SessionState;
	let isOnBookmark: boolean = false;

	session.subscribe((cur: any) => {
		sessionData = cur;
	});

	userDataStore.subscribe((cur: any) => {
		userData = cur;
		isOnBookmark = !!userData?.bookmarks?.includes(post.id);
	});

	async function toggleBookmark(idPost: string) {
		if (!browser) return;

		if (!(await signInInvoker('Sign in to bookmark this post'))) return;

		if (!sessionData.loggedIn || !sessionData.user) {
			return goto('/signin');
		}

		try {
			const res = await fetch('/api/bookmark/post/' + post.id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					uid: sessionData.user.uid
				})
			});

			isOnBookmark = !isOnBookmark;
		} catch (e) {
			console.log(e);
		}
	}
</script>

<div class="flex flex-col gap-3 justify-start">
	<a href={'/blog/' + post.id} class="flex flex-col gap-4">
		<img
			src={post.thumbnailURL || '/images/placeholder.png'}
			alt="Thumbnail"
			class="w-full aspect-video h-48 object-scale-down bg-black dark:bg-white"
		/>
		<div class="flex items-center">
			<img
				src="https://avatars.githubusercontent.com/u/54907004?v=4"
				alt="Svelte Society"
				class="rounded-full w-6 h-6 flex-shrink-0"
			/>
			<div class="flex flex-col justify-center gap-1 ml-2">
				<a href={'/user/' + user.uid} class="text-sm text-gray-300 dark:text-gray-200 font-bold">
					{user.displayName} ·
					<!-- <a href={'/follow/user/' + user.uid} class="opacity-80"> Follow </a> -->
				</a>
			</div>
		</div>
		<h3 class="font-bold mt-2">{post.title}</h3>
		<div class="summary dark:text-neutral-400 text-neutral-800 min-h-8">
			{@html post.summary}
		</div>
	</a>

	<span class="text-sm text-gray-300 dark:text-neutral-200">
		{post.readTime} min read · {printRelativeTime(new Date(post.date))}
	</span>
	<div class=" flex justify-between w-full box-border">
		<div class="flex gap-4 text-sm">
			<div>
				<span><i class="fa-solid fa-heart mr-2"></i></span>
				<span>{post.likesCount}</span>
			</div>
			<div>
				<span><i class="fa-solid fa-comment mr-2"></i></span>
				<span>{post.commentsCount}</span>
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

<style>
	.summary {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
