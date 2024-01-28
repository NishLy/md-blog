import { BadRequestError } from '$lib/error/errors';
import handler from '$lib/error/httpErrorHandler';
import { toggleCommentLike } from '$lib/repository/comment.js';
import { createResponse } from '$lib/utils/httpResponse';

export async function POST({ params, request }) {
	const slug = params.slug;
	const data = await request.json();

	try {
		if (!slug || slug === '' || !data || !data.uid || data.uid === '') {
			throw new BadRequestError('Invalid comment data');
		}

		const result = await toggleCommentLike(slug, data.uid);

		return createResponse({
			status: 200,
			body: {
				message: 'Comment like toggled successfully',
				likesCount: result.likesCount
			}
		});
	} catch (e) {
		return createResponse(handler(e));
	}
}
