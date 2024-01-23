import { BadRequestError } from '$lib/error/errors.js';
import handler from '$lib/error/httpErrorHandler.js';
import { getAllBlogByUserId } from '$lib/repository/blog.js';
import { createResponse } from '$lib/utils/httpResponse.js';

export async function GET({ params, url }) {
	try {
		const { slug } = params;
		const after = url.searchParams.get('after');

		if (!url) {
			throw new BadRequestError('Invalid request');
		}

		if (!after || !slug || slug === '' || after === '') {
			throw new BadRequestError('Invalid request');
		}

		const results = await getAllBlogByUserId(slug, after);

		return createResponse({
			status: 200,
			body: {
				data: results
			}
		});
	} catch (error) {
		return createResponse(handler(error));
	}
}
