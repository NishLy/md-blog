import handler from '$lib/error/httpErrorHandler';
import { createResponse } from '$lib/utils/httpResponse';
import { createBlog } from '../../../lib/repository/blog';

export async function POST(event) {
	const data = await event.request.json();

	try {
		const blog = {
			title: data.title,
			date: new Date().toISOString(),
			tags: data.tags || [],
			summary: data.summary,
			content: data.content,
			readTime: data.readTime,
			userId: data.userId,
			isPublished: true,
			likesCount: 0,
			commentsCount: 0
		};

		await createBlog(blog);

		return createResponse({
			status: 201,
			body: {
				message: 'Blog created successfully'
			}
		});
	} catch (e) {
		createResponse(handler(e));
	}
}
