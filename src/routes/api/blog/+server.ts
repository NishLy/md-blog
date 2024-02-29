import handler from '$lib/error/httpErrorHandler';
import { createResponse } from '$lib/utils/httpResponse';
import { array, number, object, string } from 'yup';
import { createBlog, updateBlogThumbnailURL } from '../../../lib/repository/blog';
import { uploadThumbnailFile } from '$lib/storage/images/blog/thumbnail';

const blogSchema = object({
	title: string().required(),
	tags: array().of(string()),
	summary: string().required(),
	content: string().required(),
	readTime: number().required(),
	userId: string().required()
});

export async function POST(event) {
	const data = await event.request.formData();

	try {
		const blog = {
			title: data.get('title') as string,
			date: new Date().toISOString(),
			tags: ((data.get('tags') as string) ?? '').split(','),
			summary: data.get('summary') as string,
			content: data.get('content') as string,
			readTime: Number(data.get('readTime')),
			userId: data.get('userId') as string,
			viewsCount: 0,
			isPublished: true,
			likesCount: 0,
			commentsCount: 0
		};

		await blogSchema.validate(blog);

		const ref = await createBlog(blog);

		uploadThumbnailFile(data.get('thumbnail') as File, ref.id)
			.then((thumbnailURL) => {
				updateBlogThumbnailURL(ref.id, thumbnailURL).catch((e) => {
					console.log(e);
				});
			})
			.catch((e) => {
				console.log(e);
			});

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
