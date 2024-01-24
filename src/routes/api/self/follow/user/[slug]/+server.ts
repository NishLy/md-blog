import { BadRequestError } from '$lib/error/errors.js';
import handler from '$lib/error/httpErrorHandler.js';
import { getFollowing, toggleFollowUser } from '$lib/repository/user';
import { createResponse } from '$lib/utils/httpResponse.js';

export async function POST({ params, request }) {
	try {
		const { uid }: { uid: string } = await request.json();
		const { slug }: { slug: string } = params;

		if (!uid || !slug || slug === '' || uid === '')
			throw new BadRequestError('Invalid request body');

		const isFollowing = await toggleFollowUser(uid, slug);

		return createResponse({ status: 200, body: { isFollowing } });
	} catch (e) {
		return createResponse(handler(e));
	}
}

export async function GET({ params, url }) {
	try {
		const uid = url.searchParams.get('uid');
		const { slug }: { slug: string } = params;

		if (!uid || !slug || slug === '' || uid === '')
			throw new BadRequestError('Invalid request body');

		const isFollowing = await getFollowing(uid, slug);

		return createResponse({ status: 200, body: { isFollowing } });
	} catch (e) {
		return createResponse(handler(e));
	}
}
