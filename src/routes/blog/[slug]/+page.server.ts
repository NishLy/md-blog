import { Marked } from 'marked';
import { error } from '@sveltejs/kit';
import hljs from 'highlightjs';
import { markedHighlight } from 'marked-highlight';
import { getBlog } from '../../../lib/repository/blog';
import { getUser } from '../../../lib/repository/user';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	try {
		const blogData = await getBlog(params.slug);
		const author = await getUser(blogData.userId);

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
					id: blogData.id,
					title: blogData.title,
					likesCount: blogData.likesCount,
					commentsCount: blogData.commentsCount,
					tags: blogData.tags,
					content: parsedMarkdown,
					date: blogData.date,
					readTime: blogData.readTime,
					summary: blogData.summary,
					author: {
						name: author.displayName,
						avatar: author.photoURL
					}
				}
			};
		}
	} catch (e) {
		error(404, 'Not found');
	}
}
