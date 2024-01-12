import { Marked } from 'marked';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import hljs from 'highlightjs';
import { markedHighlight } from 'marked-highlight';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const file = fs.readFileSync('src/content/test.md', 'utf-8');

	const marked = new Marked(
		markedHighlight({
			langPrefix: 'hljs language-',
			highlight(code, lang) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(language, code).value;
			}
		})
	);

	const parsedMarkdown = await marked.parse(file);

	if (parsedMarkdown) {
		return {
			page: {
				title: 'Test long title for blog website - Template - SvelteKit Blog Starter Template',
				likes: 0,
				commentsCount: 0,
				tags: ['test', 'blog', 'sveltekit'],
				content: parsedMarkdown,
				date: '2021-01-01',
				readingTime: 1,
				author: {
					name: 'John Doe',
					avatar: 'https://i.pravatar.cc/300'
				}
			}
		};
	}

	error(404, 'Not found');
}
