<script lang="ts">
	import 'bytemd/dist/index.css';
	import gfm from '@bytemd/plugin-gfm';
	import { browser } from '$app/environment';
	import { Editor, Viewer } from 'bytemd';
	import { onMount } from 'svelte';
	import Tags from '../_component/tags.svelte';

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
</script>

<div class="flex flex-col justify-center bg-white p-10 gap-2">
	<form>
		<h5 class="dark:text-black font-semibold">Metadata</h5>
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
		<h5 class="dark:text-black font-semibold">Content</h5>
		<div id="editor" class="flex flex-col gap-6 w-full lg:max-w-4x box-border mb-4"></div>
		<button class="w-full p-2 border-2 dark:text-black mb-2">Publish</button>
	</form>
</div>
