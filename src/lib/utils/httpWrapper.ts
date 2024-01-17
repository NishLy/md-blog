export const fetchApi = async (url: string, options: RequestInit = {}) => {
	const response = await fetch(url, options);
	const data = await response.json();

	if (!response.ok) {
		throw new ApiError(data.message, response.status, response);
	}

	return {
		status: response.status,
		body: data
	};
};

class ApiError extends Error {
	status: number;
	response: Response;
	constructor(message: string, status: number, response: Response) {
		super(message);
		this.status = status;
		this.response = response;
	}
}
