<script lang="ts">
	import 'bytemd/dist/index.css';
	import gfm from '@bytemd/plugin-gfm';
	import { browser } from '$app/environment';
	import { Editor, Viewer } from 'bytemd';
	import { onMount } from 'svelte';
	import Tags from '../_component/tags.svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	let editor: any;
	let value = '# Hello, Worlld!';

	onMount(() => {
		if (browser) {
			editor = new Editor({
				target: document.getElementById('editor')!,
				props: {
					value,
					plugins: [gfm()]
				}
			});

			editor.$on('change', (e: any) => {
				editor.$set({ value: e.detail.value });
			});
		}
	});

	const onFileUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (!e.target) return;
		const target = e.target as HTMLInputElement;
		const file = target.files![0];

		if (!file) return;
		console.log(file);
		if (file.type !== '') return alert('Please upload a markdown file');

		const reader = new FileReader();

		reader.onload = (ev) => {
			if (!ev.target) return;
			editor.$set({ value: ev.target!.result });
		};

		reader.readAsText(file);
	};
</script>

<div class="flex w-full justify-center">
	<div class="flex flex-col justify-center bg-white p-10 gap-2 w-full">
		<h1 class="text-black text-center font-bold mb-4">WRITE YOUR PAGE HERE</h1>
		<form>
			<h3 class="dark:text-black font-semibold mx-0 m-2">Metadata</h3>
			<div>
				<label for="title" class="dark:text-black">Title</label>
				<input
					type="text"
					name="title"
					placeholder="title"
					class="w-full p-2 border-2 dark:text-black mb-2"
				/>
				<label for="readTime" class="dark:text-black">Read Time</label>
				<input
					type="number"
					name="readTime"
					placeholder="in minutes"
					class="w-full p-2 border-2 dark:text-black mb-2"
				/>
				<label for="tags" class="dark:text-black">Tags</label>
				<Tags initialTags={['svelte']} />
			</div>
			<h3 class="dark:text-black font-semibold mx-0 m-2">Content</h3>
			<div id="editor" class="flex flex-col gap-6 w-full lg:max-w-4x box-border mb-4"></div>
			<label for="title" class="dark:text-black">Upload Markdown Content</label>
			<input
				type="file"
				name="md-file"
				placeholder="in minutes"
				class="w-full p-2 border-2 dark:text-black mb-10"
				on:change={onFileUpload}
			/>
			<button class="w-full p-2 border-2 dark:text-black mb-2">Publish</button>
		</form>
	</div>
</div>
