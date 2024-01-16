export const createResponse = ({
	status,
	body,
	error
}: {
	status: number;
	body?: Record<string, unknown>;
	error?: Record<string, unknown>;
}) => {
	return new Response(JSON.stringify({ body, error }), {
		headers: {
			'Content-Type': 'application/json'
		},
		status
	});
};
