<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"
	/>
</svelte:head>

<div class="flex justify-center">
	<div class="p-10 flex flex-col gap-6 w-full lg:max-w-4xl">
		<h1 class="text-4xl font-bold">{data.page.title}</h1>
		<div class="flex">
			<img
				src={data.page.author.avatar}
				alt={data.page.author.name}
				class="rounded-full w-12 h-w-12"
			/>
			<div class="flex flex-col justify-center gap-1 ml-2">
				<span class="text-basess text-gray-300 dark:text-gray-200 font-bold">
					{data.page.author.name} ·{' '} <a href="./follow" class="opacity-80"> Follow </a>
				</span>
				<span class="text-sm text-gray-300 dark:text-gray-200">
					Published in {new Date(data.page.date).toLocaleDateString()} ·{' '}
					{data.page.readingTime} min read
				</span>
			</div>
		</div>
		<div class=" flex justify-between w-full p-4 box-border">
			<div class="flex gap-4 text-sm">
				<div>
					<span><i class="fa-solid fa-heart"></i></span>
					<span>{data.page.likes}</span>
				</div>
				<div>
					<span><i class="fa-solid fa-comment"></i></span>
					<span>{data.page.likes}</span>
				</div>
			</div>
		</div>
		<div class="flex gap-2">
			{#each data.page.tags as tag}
				<span class="text-sm text-gray-500 dark:text-gray-200 rounded-2xl bg-white/20 p-1 px-2"
					>{tag}</span
				>
			{/each}
		</div>
		<article class="flex flex-col gap-2">
			{@html data.page.content}
		</article>
	</div>
</div>
