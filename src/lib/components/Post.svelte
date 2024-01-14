<script lang="ts">
	import type { Blog } from '../../repository/blog';
	import type { User } from '../../repository/user';

	export let user: User;
	export let post: Blog;
</script>

<div class="flex flex-col gap-3 justify-start">
	<img
		src="https://avatars.githubusercontent.com/u/54907004?v=4"
		alt="Thumbnail"
		class="w-full aspect-video h-48 object-cover rounded-2xl"
	/>
	<div class="flex items-center">
		<img
			src="https://avatars.githubusercontent.com/u/54907004?v=4"
			alt="Svelte Society"
			class="rounded-full w-6 h-6 flex-shrink-0"
		/>
		<div class="flex flex-col justify-center gap-1 ml-2">
			<span class="text-sm text-gray-300 dark:text-gray-200 font-bold">
				{user.displayName} · <a href={'./follow/user/' + user.uid} class="opacity-80"> Follow </a>
			</span>
		</div>
	</div>
	<h3 class="font-bold mt-2">{post.title}</h3>
	<div class="summary dark:text-neutral-400 text-neutral-800">
		{@html post.content}
	</div>
	<span class="text-sm text-gray-300 dark:text-neutral-200">
		{post.readTime} min read · {post.date} day ago
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
