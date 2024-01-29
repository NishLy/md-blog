<script lang="ts">
	import 'bytemd/dist/index.css';
	import gfm from '@bytemd/plugin-gfm';
	import { browser } from '$app/environment';
	import { Editor, Viewer } from 'bytemd';
	import { onMount } from 'svelte';
	import Tags from '../../lib/components/tags.svelte';
	import type { ChangeEventHandler, FormEventHandler } from 'svelte/elements';
	import { session, type User } from '$lib/state/session';
	import { goto } from '$app/navigation';
	import { fetchApi } from '$lib/utils/httpWrapper';

	let editor: any;
	let user: User | null = null;

	let content: string;
	let title: string = '';
	let readTime: number;
	let summary: string = '';
	let tags: string[] = [];
	let blobThumbnail: Blob | null = null;

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
				tags,
				summary
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
				summary = data.summary;
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

			const image = document.getElementById('image') as HTMLImageElement;
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

		if (!title || !readTime || !tags || !content || !user?.uid || !summary || !blobThumbnail)
			return;
		const userId = user?.uid;

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('readTime', readTime.toString());
			formData.append('tags', tags.join(','));
			formData.append('content', content);
			formData.append('userId', userId);
			formData.append('summary', summary);
			formData.append('thumbnail', blobThumbnail);

			await fetchApi('/api/blog', {
				method: 'POST',
				body: formData
			});

			localStorage.removeItem('content-unsaved');

			goto(`/user/${user.uid}`);
		} catch (e) {
			console.log(e);
		}
	};

	const resizeImage: ChangeEventHandler<HTMLInputElement> = (ev) => {
		const element = ev.currentTarget;
		if (!element.files) return;
		const file = element.files[0];
		if (!file) return;

		if (file.type !== 'image/png' && file.type !== 'image/jpeg')
			return alert('Please upload a png or jpeg file');

		const reader = new FileReader();

		reader.onload = (ev) => {
			if (!ev.target) return;
			const canvas = document.getElementById('thumbnail-canvas') as HTMLCanvasElement;
			const ctx = canvas.getContext('2d')!;
			const img = new Image();
			img.src = ev.target!.result as string;
			img.onload = () => {
				canvas.width = img.width * 0.5;
				canvas.height = img.height * 0.5;
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				ctx.font = '50px sans-serif';
				ctx.fillText(title, 50, 90);
				canvas.toBlob(
					(blob) => {
						if (!blob) return;
						blobThumbnail = blob;
					},
					'image/png',
					0.95
				);
			};
		};

		reader.readAsDataURL(file);
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
					min="3"
					max="50"
					on:input={(e) => (title = e.currentTarget.value)}
					placeholder="Page Title"
					class="w-full p-2 border-2 dark:text-black mb-2"
				/>
				<label for="readTime" class="dark:text-black">Page Summary</label>
				<input
					type="text"
					name="summary"
					required
					min="30"
					max="200"
					value={summary}
					on:input={(e) => (summary = e.currentTarget.value)}
					placeholder="Summary to be displayed on list page"
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
				<Tags
					allTags={['svelte']}
					initialTags={[]}
					onChange={(updatedTags) => {
						tags = updatedTags;
						console.log(tags);
					}}
				/>
				<label for="tags" class="dark:text-black">Thumbnail Image</label>
				<canvas id="thumbnail-canvas" class="aspect-video max-w-full mb-2"> </canvas>
				<input on:change={resizeImage} required type="file" name="thumbnail" id="thumbnail-file" />
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
