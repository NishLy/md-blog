import { toggleBookmark } from '../../../../../repository/user';

export async function POST({ params, request }) {
	try {
		const { uid }: { uid: string } = await request.json();
		const { slug }: { slug: string } = params;

		const result = await toggleBookmark(uid, slug);

		return new Response(JSON.stringify({ message: result }), {
			headers: {
				'Content-Type': 'application/json'
			},
			status: 200
		});
	} catch (e) {
		console.log(e);
	}
}
