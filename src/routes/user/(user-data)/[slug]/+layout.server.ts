import { getAllBlogByUserId } from '$lib/repository/blog';
import { getUser } from '$lib/repository/user';

export async function load({ params }) {
	const { slug } = params;

	if (!slug || slug.length === 0) {
		return {
			status: 404
		};
	}

	try {
		const userPosts = await getAllBlogByUserId(slug);
		const userData = await getUser(slug);

		console.log(userData);

		return {
			userData,
			userPosts
		};
	} catch (e) {
		return {
			status: 500,
			body: {
				error: e
			}
		};
	}
}
