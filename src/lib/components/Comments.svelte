<script lang="ts">
	import { browser } from '$app/environment';
	import ResponseBox from './ResponseBox.svelte';
	import { App } from '$lib/state/app';
	import { fetchApi } from '$lib/utils/httpWrapper';
	import type { CommentInterface } from '$lib/repository/comment';
	import { session, userDataStore, type SessionState, type UserData } from '$lib/state/session';
	import { onMount } from 'svelte';
	import Loading from './Loading.svelte';

	export let blogId: string;
	export let showResponses: boolean = true;
	export let comments: any[] = [];

	let observer: IntersectionObserver | undefined = undefined;
	let isEnd = false;
	let isLoaded = false;

	let dataWrapper: HTMLDivElement | undefined = undefined;

	async function fetchPage(after: string) {
		isLoaded = false;
		try {
			const res = await fetchApi(`/api/blog/${blogId}/comment?startAfter=${after}`);

			comments = [...comments, ...mapComments(res.body.comments)];

			if (res.body.comments.length < 10) {
				observer?.disconnect();
				observer = undefined;
				isEnd = true;
			}
		} catch (e) {
		} finally {
			isLoaded = true;
		}
	}

	$: (() => {
		if (!dataWrapper) return;
		if (observer) return;
		if (isEnd) return;
		if (comments.length === 0) return;

		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isEnd) {
					const last = dataWrapper!.querySelector('#last');
					if (last) {
						fetchPage(comments[comments.length - 1].createdAt);
					}
				}
			},
			{
				root: dataWrapper,
				threshold: 0.5
			}
		);

		const last = dataWrapper.lastElementChild;
		if (last) {
			observer.observe(last);
		}
	})();

	let siginInInvoker: (m: string) => Promise<boolean>;

	let userSession: UserData | undefined = undefined;

	userDataStore.subscribe((cur) => {
		if (!cur) return;
		userSession = cur;
	});

	App.subscribe((app) => {
		siginInInvoker = app.methods.invokeProtected;
	});

	$: (() => {
		if (!browser) return;
		if (!showResponses) document.body.style.overflow = 'auto';
		else document.body.style.overflow = 'hidden';
	})();

	let onClose = () => {
		showResponses = false;
	};

	async function postComment(ev: SubmitEvent, level: number = 1, parentId: null | string = null) {
		ev.preventDefault();
		try {
			if ((await siginInInvoker('You need to sign in to reply')) || !userSession) {
				(document.querySelector('#post-new-comment') as HTMLAreaElement)?.focus();
			}

			const data = new FormData(ev.currentTarget as HTMLFormElement);

			const comment = data.get('comment') as string;

			if (!comment) return;

			const res = await fetchApi(`/api/blog/${blogId}/comment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: comment,
					user: userSession,
					parentId: level == 1 ? null : parentId,
					level,
					blogId
				})
			});

			(ev.currentTarget as HTMLFormElement)?.reset();

			alert('Comment posted successfully');
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		try {
			const res = await fetchApi(`/api/blog/${blogId}/comment`, {
				method: 'GET'
			});

			comments = mapComments(res.body.comments);
		} catch (error) {
			console.error(error);
		} finally {
			isLoaded = true;
		}
	});

	function mapComments(
		comments: ({
			children?: ({ children?: CommentInterface[] } & CommentInterface)[];
		} & CommentInterface)[]
	): any {
		function parseChildren(
			children: (CommentInterface & { children?: CommentInterface[] })[]
		): any {
			return children.map((child) => {
				return {
					component: ResponseBox,
					props: {
						...child,
						children:
							child.children && child.children.length > 0
								? parseChildren(child.children)
								: undefined,
						createdAt: new Date(child.createdAt),
						updatedAt: new Date(child.createdAt)
					}
				};
			});
		}

		return comments.map((comment) => {
			return {
				...comment,
				children:
					comment.children && comment.children.length > 0 ? parseChildren(comment.children) : []
			};
		});
	}
</script>

{#if showResponses}
	<div
		class="w-screen fixed bottom-0 mobile-responses-height dark:text-black rounded-t-md left-0 p-4 bg-neutral-100 box-border overflow-y-auto"
	>
		<div>
			<div class="dark:text-black flex justify-between items-center">
				<h4>Responses</h4>
				<button on:click={onClose}>X</button>
			</div>
			<form on:submit={postComment}>
				<textarea
					id="post-new-comment"
					name="comment"
					required
					class="w-full mt-4 p-4 rounded-sm shadow-md dark:text-black"
					rows="2"
					on:click={async (ev) => {
						if (await siginInInvoker('You need to sign in to reply')) {
							ev.currentTarget.focus();
						}
					}}
					placeholder="What's your thoughs"
				></textarea>
				<button type="submit" class="px-4 py-2 rounded-md shadow-md bg-green-600 text-white mb-6"
					>Reply</button
				>
			</form>
		</div>
		<hr />
		<div class="flex flex-col gap-4 my-4" bind:this={dataWrapper}>
			{#if comments.length === 0 && isLoaded}
				<div class="text-center">No responses yet</div>
			{:else}
				{#each comments as comment}
					<ResponseBox
						{...comment}
						createdAt={new Date(comment.createdAt)}
						updatedAt={new Date(comment.updatedAt)}
					/>
				{/each}
			{/if}

			{#if !isLoaded}
				<Loading />
			{/if}

			<div id="last"></div>
		</div>
	</div>
{/if}

<style>
	.mobile-responses-height {
		height: calc(100vh - 4rem);
	}
</style>
