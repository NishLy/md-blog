<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { showResponseWrapper } from '$lib/state/blog.js';
	import {
		session,
		userDataStore,
		type SessionState,
		type User,
		type UserData
	} from '$lib/state/session';
	import { fetchApi } from '$lib/utils/httpWrapper';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		if (typeof window !== 'undefined') {
			document.querySelectorAll('.hljs').forEach((block) => {
				const div = document.createElement('div');
				div.classList.add(
					'mt-4',
					'flex',
					'justify-end',
					'text-xs',
					'text-gray-500',
					'bg-neutral-300',
					'rounded-t-2xl',
					'p-2'
				);
				div.innerHTML = `<Button class="text-gray-800"><i class="fa-solid fa-copy"></i> Copy</Button>`;
				div.addEventListener('click', () => {
					// @ts-ignore
					navigator.clipboard.writeText(block.innerText);
					console.log(navigator.clipboard);

					div.innerHTML = `<Button class="text-green-500"><i class="fa-solid fa-copy"></i> Copied</Button>`;
					setTimeout(() => {
						div.innerHTML = `<Button class="text-gray-500"><i class="fa-solid fa-copy"></i> Copy</Button>`;
					}, 1000);
				});
				block.insertAdjacentElement('beforebegin', div);
				block.classList.add('mb-4');
			});
		}
	});

	let userData: UserData;
	let sessionData: SessionState;
	let isOnBookmark: boolean = false;

	session.subscribe((cur: any) => {
		sessionData = cur;
	});

	userDataStore.subscribe((cur: any) => {
		userData = cur;
		isOnBookmark = !!userData?.bookmarks?.includes(data.page?.id ?? '');
	});

	async function toggleBookmark(idPost: string) {
		if (!browser || !idPost) return;

		if (!(await data.invokeProtected('Sign in to bookmark this post'))) return;

		if (!sessionData.loggedIn || !sessionData.user) {
			return goto('/signin');
		}

		try {
			const res = await fetchApi('/api/bookmark/post/' + data.page?.id, {
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

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"
	/>
</svelte:head>

<div class="flex justify-center">
	<div class="p-10 flex flex-col gap-6 w-full max-w-4xl lg:max-w-4xl">
		<h1 class="text-4xl font-bold">{data.page?.title}</h1>
		<h3 class="dark:text-neutral-300">{data.page?.summary}</h3>
		<div class="flex items-center">
			<img
				src={data.page?.author.avatar}
				alt={data.page?.author.name}
				class="rounded-full w-12 h-12 flex-shrink-0"
			/>
			<div class="flex flex-col justify-center gap-1 ml-2">
				<span class="text-basess text-gray-300 dark:text-gray-200 font-bold">
					{data.page?.author.name} ·{' '} <a href="./follow" class="opacity-80"> Follow </a>
				</span>
				<span class="text-sm text-gray-300 dark:text-gray-200">
					Published in {new Date(data.page?.date ?? '1970-01-01').toLocaleDateString()} ·{' '}
					{data.page?.readTime} min read
				</span>
			</div>
		</div>
		<div
			class=" flex justify-between w-full p-4 box-border border-y-[1px] dark:border-neutral-400/30"
		>
			<div class="flex gap-4 text-sm justify-between w-full">
				<div class="flex gap-4">
					<div>
						<span><i class="fa-solid fa-heart"></i></span>
						<span>{data.page?.likesCount}</span>
					</div>
					<button
						on:click={() => {
							showResponseWrapper.set(true);
						}}
					>
						<span><i class="fa-solid fa-comment"></i></span>
						<span>{data.page?.commentsCount}</span>
					</button>
				</div>

				<div class="flex gap-4">
					<button
						type="button"
						on:click={(e) => {
							e.stopPropagation();
							toggleBookmark(data.page?.id ?? '');
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
		</div>
		<div class="flex gap-2">
			{#if data.page}
				{#each data.page.tags as tag}
					<a
						href={'/tags/' + tag}
						class="text-sm text-gray-500 dark:text-gray-200 rounded-2xl bg-white/20 p-1 px-2"
						>{tag}</a
					>
				{/each}
			{/if}
		</div>
		<article class="flex flex-col gap-4 break-words">
			{#if data.page}
				{@html data.page.content}
			{/if}
		</article>
	</div>
</div>
