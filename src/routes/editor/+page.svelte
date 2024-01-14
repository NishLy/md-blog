<script lang="ts">
	import 'bytemd/dist/index.css';
	import gfm from '@bytemd/plugin-gfm';
	import { browser } from '$app/environment';
	import { Editor, Viewer } from 'bytemd';
	import { onMount } from 'svelte';
	import Tags from '../_component/tags.svelte';
	import type { ChangeEventHandler, FormEventHandler } from 'svelte/elements';
	import { session, type User } from '$lib/state/session';
	import { goto } from '$app/navigation';

	let editor: any;
	let user: User | null = null;

	let content: string;
	let title: string;
	let readTime: number;
	let tags: string[] = [];

	session.subscribe((value) => {
		value?.user && (user = value.user);
	});

	$: (() => {
		if (!content || !title || !readTime || !tags) return;
		localStorage.setItem(
			'content-unsaved',
			JSON.stringify({
				content,
				title,
				readTime,
				tags
			})
		);
	})();

	onMount(() => {
		if (browser) {
			if (localStorage.getItem('content-unsaved')) {
				const data = JSON.parse(localStorage.getItem('content-unsaved')!);
				content = data.content;
				title = data.title;
				readTime = data.readTime;
				tags = data.tags;
			}

			editor = new Editor({
				target: document.getElementById('editor')!,
				props: {
					value: content,
					plugins: [gfm()]
				}
			});

			editor.$on('change', (e: any) => {
				content = e.detail.value;
				editor.$set({ value: e.detail.value });
			});

			window.addEventListener('beforeunload', (e) => {
				e.preventDefault();
				e.returnValue = '';
			});
		}
	});

	const onFileUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (!e.target) return;
		const target = e.target as HTMLInputElement;
		const file = target.files![0];

		if (!file) return;
		if (file.type !== '') return alert('Please upload a markdown file');

		const reader = new FileReader();

		reader.onload = (ev) => {
			if (!ev.target) return;
			content = ev.target!.result as string;
			editor.$set({ value: ev.target!.result });
		};

		reader.readAsText(file);
	};

	const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		if (!e.target || !editor) return;

		const data = new FormData(e.target as HTMLFormElement);
		const title = data.get('title');
		const readTime = data.get('readTime');
		const tags = data.get('tags');

		const userId = user?.uid;

		if (!title || !readTime || !tags || !content || !user) return;

		try {
			await fetch('/api/page', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title, readTime, tags, content, userId })
			});

			localStorage.removeItem('content-unsaved');

			goto(`/user/${user.uid}`);
		} catch (e) {
			console.log(e);
		}
	};
</script>

<div class="flex w-full justify-center">
	<div class="flex flex-col justify-center bg-white p-10 gap-2 w-full">
		<h1 class="text-black text-center font-bold mb-4">WRITE YOUR PAGE HERE</h1>
		<form on:submit={onSubmit}>
			<h3 class="dark:text-black font-semibold mx-0 m-2">Metadata</h3>
			<div>
				<label for="title" class="dark:text-black">Title</label>
				<input
					required
					type="text"
					name="title"
					value={title}
					on:input={(e) => (title = e.currentTarget.value)}
					placeholder="title"
					class="w-full p-2 border-2 dark:text-black mb-2"
				/>
				<label for="readTime" class="dark:text-black">Read Time</label>
				<input
					type="number"
					name="readTime"
					required
					value={readTime}
					on:input={(e) => (readTime = parseInt(e.currentTarget.value ?? '0'))}
					placeholder="in minutes"
					class="w-full p-2 border-2 dark:text-black mb-2"
				/>
				<label for="tags" class="dark:text-black">Tags</label>
				<Tags allTags={['svelte']} initialTags={tags} onChange={(tags) => (tags = tags)} />
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
