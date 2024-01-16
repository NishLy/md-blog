import { toggleFollow } from '$lib/repository/tags';
import { BadRequestError } from '../../../../error/errors';
import handler from '../../../../error/httpErrorHandler';
import { createResponse } from '../../../../utils/httpResponse';
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
