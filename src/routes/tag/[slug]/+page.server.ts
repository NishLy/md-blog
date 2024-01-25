import { getAllBlogByTag } from '../../../lib/repository/blog';
import { getTag } from '../../../lib/repository/tags';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	if (!params.slug) {
		return { status: 404 };
	}

	const posts = await getAllBlogByTag(params.slug);
	const tag = await getTag(params.slug);

	if (!tag) {
		return { status: 404 };
	}

	return {
		props: {
			tag,
			posts
		}
	};
}
