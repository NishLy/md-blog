import { getFollowerList } from '$lib/repository/user';

export async function load({ params }) {
	try {
		const { slug } = params;

		const followers = await getFollowerList(slug);

		if (!followers) {
			return {
				isPrivate: true,
				followers: []
			};
		}

		return {
			isPrivate: false,
			followers
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
