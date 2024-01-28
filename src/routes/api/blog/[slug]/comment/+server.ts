import { BadRequestError } from '$lib/error/errors.js';
import handler from '$lib/error/httpErrorHandler';
import { createComment } from '$lib/repository/comment';
import { createResponse } from '$lib/utils/httpResponse';
import { object, string, number } from 'yup';

const commentSchema = object({
	content: string().required(),
	user: object({
		displayName: string().required(),
		photoURL: string().required(),
		uid: string().required()
	}).required(),
	level: number().required(),
	parentId: string().nullable(),
	blogId: string().required()
});

export async function POST({ params, request }) {
	const data = await request.json();
	const slug = params.slug;

	try {
		if (!slug || slug === '') {
			throw new BadRequestError('Invalid comment data');
		}

		await commentSchema.validate(data);

		const comment = {
			content: data.content,
			user: data.user,
			level: data.level,
			parentId: data.parentId,
			blogId: slug
		};

		await createComment(comment);

		return createResponse({
			status: 201,
			body: {
				message: 'Comment created successfully'
			}
		});
	} catch (e) {
		return createResponse(handler(e));
	}
}
