export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class BadRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'BadRequestError';
	}
}

export class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UnauthorizedError';
	}
}

export class ForbiddenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ForbiddenError';
	}
}

export class InternalServerError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InternalServerError';
	}
}

export class NotImplementedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotImplementedError';
	}
}

export class ServiceUnavailableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ServiceUnavailableError';
	}
}

export class GatewayTimeoutError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'GatewayTimeoutError';
	}
}

export class HttpError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'HttpError';
	}
}

export class TimeoutError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TimeoutError';
	}
}
