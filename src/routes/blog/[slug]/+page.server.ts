import { Marked } from 'marked';
import { error } from '@sveltejs/kit';
import hljs from 'highlightjs';
import { markedHighlight } from 'marked-highlight';
import { getBlog } from '../../../repository/blog';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	try {
		const blogData = await getBlog(params.slug);

		const marked = new Marked(
			markedHighlight({
				langPrefix: 'hljs language-',
				highlight(code, lang) {
					const language = hljs.getLanguage(lang) ? lang : 'plaintext';
					return hljs.highlight(language, code).value;
				}
			})
		);

		const parsedMarkdown = await marked.parse(blogData.content);

		if (parsedMarkdown) {
			return {
				page: {
					title: blogData.title,
					likesCount: blogData.likesCount,
					commentsCount: blogData.commentsCount,
					tags: blogData.tags,
					content: parsedMarkdown,
					date: blogData.date,
					readTime: blogData.readTime,
					author: {
						name: 'John Doe',
						avatar: 'https://i.pravatar.cc/300'
					}
				}
			};
		}
	} catch (e) {
		console.log(e);
		error(404, 'Not found');
	}
}
