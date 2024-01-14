import { marked } from 'marked';
import { getAllBlogByTag } from '../../../repository/blog';
import { getTag } from '../../../repository/tags';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	if (!params.slug) {
		return { status: 404 };
	}

	const posts = await getAllBlogByTag(params.slug);
	const tag = await getTag(params.slug);

	for await (const post of posts) {
		const contentSplit = post.post.content.split('\n');
		post.post.content = contentSplit.slice(0, 2).join('\n');
		post.post.content = await marked(post.post.content);
	}

	return {
		props: {
			tag: {
				name: tag.name,
				followers: tag.followers,
				count: posts.length
			},
			posts
		}
	};
}
