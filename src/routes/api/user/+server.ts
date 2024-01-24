import { BadRequestError } from '$lib/error/errors.js';
import handler from '$lib/error/httpErrorHandler.js';
import { addUser } from '$lib/repository/user.js';
import { createResponse } from '$lib/utils/httpResponse.js';

export async function POST({ request }) {
	try {
		const body = await request.json();

		if (!body.displayName || !body.email || !body.uid || !body.photoURL) {
			throw new BadRequestError('Invalid Request Body');
		}

		const user = await addUser(body);

		return createResponse({
			body: user,
			status: 200
		});
	} catch (e) {
		return createResponse(handler(e));
	}
}
