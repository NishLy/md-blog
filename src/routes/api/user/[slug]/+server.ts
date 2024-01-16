import { getUser } from '../../../../lib/repository/user';
import type { RequestEvent } from '../../page/$types';

export async function GET({ params }: RequestEvent) {
	try {
		if (!params) {
			return new Response(JSON.stringify({ message: 'User Not Found' }), {
				headers: { 'content-type': 'application/json' },
				status: 404
			});
		}

		const user = await getUser(params.slug);

		return new Response(JSON.stringify(user), {
			headers: { 'content-type': 'application/json' },
			status: 200
		});
	} catch (e) {
		return new Response(JSON.stringify({ message: 'Error In Creating Page', error: e }), {
			headers: { 'content-type': 'application/json' },
			status: 500
		});
	}
}
