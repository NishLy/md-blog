import { getFollower, toggleFollow } from '$lib/repository/tags';
import { BadRequestError } from '../../../../lib/error/errors';
import handler from '../../../../lib/error/httpErrorHandler';
import { createResponse } from '../../../../lib/utils/httpResponse';
import type { RequestEvent } from './$types';

export async function POST({ request, params }: RequestEvent) {
	const { slug } = params;
	const { uid } = await request.json();

	if (!uid || !slug || slug === '' || uid === '') {
		throw new BadRequestError('Invalid request');
	}

	try {
		const result = await toggleFollow(slug, uid);
		return createResponse({ status: 200, body: { result } });
	} catch (error) {
		return createResponse(handler(error));
	}
}

export async function GET({ params, url }: RequestEvent) {
	const { slug } = params;
	const uid = url.searchParams.get('uid');

	if (!slug || slug === '' || !uid || uid === '') {
		throw new BadRequestError('Invalid request');
	}

	try {
		const isFollowing = await getFollower(slug, uid);

		return createResponse({ status: 200, body: { isFollowing } });
	} catch (error) {
		return createResponse(handler(error));
	}
}
