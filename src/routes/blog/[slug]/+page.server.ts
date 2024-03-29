import { Marked } from 'marked';
import { error } from '@sveltejs/kit';
import hljs  from 'highlight.js';
import { markedHighlight } from 'marked-highlight';
import { getBlog } from '../../../lib/repository/blog';
import { getUser } from '../../../lib/repository/user';

export const prerender = true;

export async function load({ params }: { params: { slug: string } }) {
	try {
		const blogData = await getBlog(params.slug);
		const author = await getUser(blogData.userId);

		const marked = new Marked(
			markedHighlight({
				langPrefix: 'hljs language-',
				highlight(code, lang) {
				  const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				  return hljs.highlight(code, { language }).value;
				}
			})
		);

		const parsedMarkdown = marked.parse(blogData.content);

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
					thumbnailURL: blogData.thumbnailURL,
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
