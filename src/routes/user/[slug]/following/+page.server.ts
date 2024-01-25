import { getFollowingList } from '$lib/repository/user';

export async function load({ params }) {
	try {
		const { slug } = params;

		const following = await getFollowingList(slug);

		if (!following) {
			return {
				isPrivate: true,
				following: []
			};
		}

		return {
			isPrivate: false,
			following
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
