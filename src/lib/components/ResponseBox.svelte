<script lang="ts">
	import { type UserData, userDataStore } from '$lib/state/session';
	import { printRelativeTime } from '$lib/utils/date';
	import { fetchApi } from '$lib/utils/httpWrapper';
	import { onMount, type ComponentType } from 'svelte';
	import { App } from '$lib/state/app';

	export let content: string;

	export let id: string;
	export let likesCount = 0;
	export let repliesCount = 0;
	export let createdAt: Date;
	export let updatedAt: Date;
	export let blogId: string;
	export let authorId: string;
	export let level: number = 1;
	export let parentId: null | string = null;
	export let user: { displayName: string; photoURL: string; uid: string } = {
		displayName: 'Anonymous',
		photoURL: 'https://avatars.githubusercontent.com/u/54907004?v=4',
		uid: ''
	};

	export let children:
		| {
				component: ComponentType;
				props: {
					likes: number;
					replies: number;
					createdAt: Date;
					displayName: string;
					photoURL: string;
					text: string;
					children?: {
						component: ComponentType;
						props: {
							likes: number;
							replies: number;
							createdAt: Date;
							displayName: string;
							photoURL: string;
							text: string;
						};
					}[];
				};
		  }[]
		| undefined = undefined;

	let isExpanded = false;
	let haveMoreText = false;
	let moreText: string | undefined = undefined;

	let moreRepliesElement: HTMLElement | undefined = undefined;
	let verticalLineElement: HTMLElement | undefined = undefined;
	let moreRepliesWrapperElement: HTMLElement | undefined = undefined;
	let replyFieldElement: HTMLElement | undefined = undefined;
	let textElement: HTMLElement | undefined = undefined;

	let showReplyField = false;
	let showReplies = false;

	onMount(() => {
		if (typeof window === 'undefined') return;

		if (content.length > 200) {
			haveMoreText = true;
			moreText = content.slice(200);
			content = content.slice(0, 200) + '...';
		}

		if (!moreRepliesElement || !verticalLineElement || !textElement) return;
		new ResizeObserver(() => {
			if (!moreRepliesElement || !verticalLineElement) return;

			verticalLineElement.style.height = moreRepliesElement.clientHeight + 'px';
		}).observe(moreRepliesElement);
	});

	let onExpand = () => {
		isExpanded = true;
		content = content.slice(0, 200) + moreText;
	};

	let onCollapse = () => {
		isExpanded = false;
		content = content.slice(0, 200) + '...';
	};

	let siginInInvoker: (m: string) => Promise<boolean>;

	let userSession: UserData | undefined = undefined;

	userDataStore.subscribe((cur) => {
		if (!cur) return;
		userSession = cur;
	});

	console.log(updatedAt?.getTime(), createdAt?.getTime());

	App.subscribe((app) => {
		siginInInvoker = app.methods.invokeProtected;
	});

	async function postComment(ev: SubmitEvent) {
		ev.preventDefault();
		console.log(!(await siginInInvoker('You need to sign in to reply')) || !userSession);
		try {
			if (!(await siginInInvoker('You need to sign in to reply')) || !userSession) {
				return;
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
					parentId: id,
					level: level + 1,
					blogId: blogId
				})
			});

			(ev.currentTarget as HTMLFormElement)?.reset();

			alert('Comment posted successfully');
		} catch (error) {
			console.error(error);
		}
	}

	async function updateComment(ev: SubmitEvent) {
		try {
			const data = new FormData(ev.currentTarget as HTMLFormElement);

			const comment = data.get('comment') as string;

			if (!comment) return;

			const res = await fetchApi(`/api/blog/${blogId}/comment`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: comment,
					id: id,
					uid: userSession?.uid
				})
			});

			(ev.currentTarget as HTMLFormElement)?.reset();

			content = comment;
			showEditField = false;
			alert('Comment updated successfully');
		} catch (error) {
			console.error(error);
		}
	}

	let showMenu = false;
	let showEditField = false;

	let isLiked = false;

	async function toggleLike() {
		try {
			if (!(await siginInInvoker('You need to sign in to like')) || !userSession) {
				return;
			}

			const res = await fetchApi(`/api/blog/${blogId}/comment/${id}/like`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					uid: userSession.uid
				})
			});

			likesCount = likesCount + res.body.likesCount;
			isLiked = res.body.likesCount > 0 ? true : false;
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="flex flex-col">
	<div class="flex justify-between items-center dark:text-black">
		<div class="flex gap-4 items-center">
			<img
				src={user.photoURL ?? 'https://avatars.githubusercontent.com/u/54907004?v=4'}
				alt=""
				class="rounded-full w-10 h-10 flex-shrink-0"
			/>
			<div>
				<h6>{user.displayName}</h6>
				<p class="text-sm opacity-90 flex gap-2">
					{printRelativeTime(new Date(createdAt ?? Date.now()))}

					{#if updatedAt?.getTime() !== createdAt?.getTime()}
						<span>
							<span class=" bg-yellow-300 px-1 rounded-sm">Edited</span>
						</span>
					{/if}

					{#if user.uid == authorId}
						<span class=" bg-green-300 px-1 rounded-sm">Author</span>
					{/if}
				</p>
			</div>
		</div>
		<div class="flex gap-4 relative">
			<button
				on:click={() => {
					showMenu = !showMenu;
				}}
			>
				<i class="fa-solid fa-ellipsis"></i>
			</button>

			{#if showMenu}
				<div class="absolute w-36 top-8 right-0 bg-white rounded-md shadow-md overflow-hidden z-50">
					{#if userSession?.uid !== user.uid}
						<button
							on:click={() => {
								showMenu = false;
							}}
							class="flex items-center w-full gap-2 hover:bg-yellow-400 p-4"
						>
							<i class="fa-solid fa-circle-exclamation"></i>
							<span class="ml-2">Report</span>
						</button>
					{/if}
					{#if userSession?.uid == user.uid}
						<button
							on:click={() => {
								showEditField = true;
								showMenu = false;
							}}
							class="flex w-full items-center gap-2 hover:bg-blue-400 p-4"
						>
							<i class="fa-solid fa-pen-to-square"></i>
							<span class="ml-2">Edit</span>
						</button>
						<!-- <button
							on:click={() => {
								showMenu = false;
							}}
							class="flex w-full items-center gap-2 hover:bg-red-400 p-4"
						>
							<i class="fa-solid fa-trash fa-sm"></i>
							<span class="ml-2">Delete</span>
						</button> -->
					{/if}
				</div>
			{/if}
		</div>
	</div>
	<div class="dark:text-black mt-4">
		{#if showEditField}
			<form on:submit={updateComment}>
				<textarea
					class="w-full p-4 rounded-md shadow-md"
					name="comment"
					rows="4"
					value={content}
					placeholder="What's your thoughs"
				></textarea>
				<div class="flex justify-between items-center">
					<button
						on:click={() => {
							showEditField = false;
						}}
						class="text-red-400"
					>
						<i class="fa-solid fa-xmark fa-lg"></i>
						Cancel
					</button>
					<button type="submit" class="px-4 py-2 rounded-md shadow-md bg-green-600 text-white"
						>Edit</button
					>
				</div>
			</form>
		{:else}
			<p class="mb-2 whitespace-pre" bind:this={textElement}>
				{content}
			</p>
		{/if}
		{#if haveMoreText}
			{#if isExpanded}
				<button class="text-green-600" on:click={onCollapse}>Read less</button>
			{:else}
				<button class="text-green-600" on:click={onExpand}>Read more</button>
			{/if}
		{/if}
	</div>
	<div class="flex justify-between dark:text-black mb-4">
		<div class="flex gap-4 text-sm my-2">
			<button on:click={toggleLike} class={isLiked ? 'text-pink-400' : ''}>
				<span><i class="fa-solid fa-heart mr-2"></i></span>
				<span>{likesCount} Likes</span>
			</button>
			<button
				on:click={() => {
					if (!children || repliesCount == 0) return;

					showReplies = !showReplies;

					if (showReplies) {
						moreRepliesWrapperElement?.classList.remove('hidden');
					}

					if (!showReplies) {
						if (!verticalLineElement || !moreRepliesWrapperElement) return;
						verticalLineElement.style.height =
							verticalLineElement.clientHeight - moreRepliesWrapperElement.clientHeight + 'px';
						moreRepliesWrapperElement?.classList.add('hidden');
					}
				}}
			>
				<span><i class="fa-solid fa-comment mr-2"></i></span>
				<span>{repliesCount} Replies</span>
			</button>
		</div>
		{#if level !== 3}
			<button
				on:click={() => {
					showReplyField = !showReplyField;

					if (showReplyField) {
						replyFieldElement?.focus();
						replyFieldElement?.scrollIntoView({ behavior: 'smooth' });
						replyFieldElement?.classList.remove('hidden');
					}

					if (!showReplyField) {
						if (!verticalLineElement || !replyFieldElement) return;
						verticalLineElement.style.height =
							verticalLineElement.clientHeight - (replyFieldElement.clientHeight + 8) + 'px';
						replyFieldElement?.blur();
						replyFieldElement?.classList.add('hidden');
					}
				}}>Reply</button
			>
		{/if}
	</div>
	<div class="dark:text-black flex items-start h-fit" bind:this={moreRepliesElement}>
		<div bind:this={verticalLineElement} class="w-4 border-l-4 border-green-500 min-h-full"></div>
		<div class="flex flex-col gap-2 w-full">
			<div class="hidden" bind:this={replyFieldElement}>
				<form on:submit={postComment}>
					<textarea
						class="w-full p-4 rounded-md shadow-md"
						rows="1"
						name="comment"
						placeholder="What's your thoughs"
					></textarea>
					<div class="flex justify-end">
						<button type="submit" class="px-4 py-2 rounded-md shadow-md bg-green-600 text-white"
							>Reply</button
						>
					</div>
				</form>
			</div>
			<div bind:this={moreRepliesWrapperElement} class="flex flex-col gap-2 w-full">
				{#if children}
					{#each children as component}
						<svelte:component this={component.component} {...component.props} />
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
