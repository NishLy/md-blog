import { getAllBlogByTag, getRecomendedBlogByTag } from '../../../lib/repository/blog';
import { getRandomTags, getTag } from '../../../lib/repository/tags';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	if (!params.slug) {
		return { status: 404 };
	}

	const posts = await getAllBlogByTag(params.slug);
	const tag = await getTag(params.slug);
	const recomendedTags = await getRandomTags(10);
	const recomendedBlogs = await getRecomendedBlogByTag(params.slug);

	if (!tag) {
		return { status: 404 };
	}

	return {
		props: {
			tag,
			posts,
			recomendedTags,
			recomendedBlogs
		}
	};
}
