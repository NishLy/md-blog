import { BadRequestError } from '$lib/error/errors.js';
import handler from '$lib/error/httpErrorHandler';
import { createComment, getComments, updateCommentContent } from '$lib/repository/comment';
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

export async function GET({ params, url }) {
	const slug = params.slug;
	const startAfter = url.searchParams.get('startAfter');

	try {
		if (!slug || slug === '') {
			throw new BadRequestError('Invalid comment data');
		}

		const comments = await getComments(slug, startAfter ?? undefined);

		return createResponse({
			status: 200,
			body: {
				comments: comments
			}
		});
	} catch (e) {
		return createResponse(handler(e));
	}
}

const updateCommentSchema = object({
	id: string().required(),
	content: string().required(),
	uid: string().required()
});

export async function PUT({ params, request }) {
	const data = await request.json();
	const slug = params.slug;

	try {
		if (!slug || slug === '') {
			throw new BadRequestError('Invalid comment data');
		}

		await updateCommentSchema.validate(data);

		await updateCommentContent(data.id, data.content, data.uid);

		return createResponse({
			status: 200,
			body: {
				message: 'Comment updated successfully'
			}
		});
	} catch (e) {
		return createResponse(handler(e));
	}
}
