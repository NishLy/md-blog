import { createBlog } from '../../../repository/blog';

export async function POST(event) {
	const data = await event.request.json();

	try {
		const blog = {
			title: data.title,
			date: new Date().toISOString(),
			tags: data.tags.split(',') || [],
			content: data.content,
			readTime: data.readTime,
			userId: data.userId,
			isPublished: true,
			likesCount: 0,
			commentsCount: 0
		};

		await createBlog(blog);

		return new Response(JSON.stringify({ message: 'Page Published' }), {
			headers: { 'content-type': 'application/json' },
			status: 201
		});
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ message: 'Error In Creating Page', error: e }), {
			headers: { 'content-type': 'application/json' },
			status: 500
		});
	}
}
