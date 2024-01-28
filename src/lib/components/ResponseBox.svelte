<script lang="ts">
	import { printRelativeTime } from '$lib/utils/date';
	import { onMount, type ComponentType } from 'svelte';

	export let content: string;

	export let likes = 0;
	export let replies = 0;
	export let createdAt = new Date();
	export let user: { displayName: string; photoURL: string } = {
		displayName: 'Anonymous',
		photoURL: 'https://avatars.githubusercontent.com/u/54907004?v=4'
	};

	export let components:
		| {
				component: ComponentType;
				props: {
					likes: number;
					replies: number;
					date: Date;
					displayName: string;
					photoURL: string;
					text: string;
					components?: {
						component: ComponentType;
						props: {
							likes: number;
							replies: number;
							date: Date;
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

			console.log(moreRepliesElement.clientHeight);
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
				<p class="text-sm opacity-90">{printRelativeTime(createdAt)}</p>
			</div>
		</div>
		<div class="flex gap-4">...</div>
	</div>
	<div class="dark:text-black mt-4">
		<p class="mb-2" bind:this={textElement}>
			{content}
		</p>
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
			<div>
				<span><i class="fa-solid fa-heart mr-2"></i></span>
				<span>{likes} Likes</span>
			</div>
			<button
				on:click={() => {
					if (!components || replies == 0) return;

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
				<span>{replies} Replies</span>
			</button>
		</div>
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
	</div>
	<div class="dark:text-black flex items-start h-fit" bind:this={moreRepliesElement}>
		<div bind:this={verticalLineElement} class="w-4 border-l-4 border-green-500 min-h-full"></div>
		<div class="flex flex-col gap-2 w-full">
			<div class="hidden" bind:this={replyFieldElement}>
				<textarea class="w-full p-4 rounded-md shadow-md" rows="1" placeholder="What's your thoughs"
				></textarea>
				<div class="flex justify-end">
					<button class="px-4 py-2 rounded-md shadow-md bg-green-600 text-white">Reply</button>
				</div>
			</div>
			<div bind:this={moreRepliesWrapperElement} class="flex flex-col gap-2 w-full">
				{#if components}
					{#each components as component}
						<svelte:component this={component.component} {...component.props} />
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
