import {
	NotFoundError,
	BadRequestError,
	UnauthorizedError,
	ForbiddenError,
	InternalServerError,
	NotImplementedError,
	ServiceUnavailableError,
	GatewayTimeoutError
} from './errors';
import { ValidationError } from 'yup';

export default function handler(error: Error | unknown) {
	if (error instanceof ValidationError) {
		return { status: 400, body: { error: error.message } };
	}

	if (error instanceof NotFoundError) {
		return { status: 404, body: { error: error.message } };
	}
	if (error instanceof BadRequestError) {
		return { status: 400, body: { error: error.message } };
	}
	if (error instanceof UnauthorizedError) {
		return { status: 401, body: { error: error.message } };
	}
	if (error instanceof ForbiddenError) {
		return { status: 403, body: { error: error.message } };
	}
	if (error instanceof InternalServerError) {
		return { status: 500, body: { error: error.message } };
	}
	if (error instanceof NotImplementedError) {
		return { status: 501, body: { error: error.message } };
	}
	if (error instanceof ServiceUnavailableError) {
		return { status: 503, body: { error: error.message } };
	}
	if (error instanceof GatewayTimeoutError) {
		return { status: 504, body: { error: error.message } };
	}
	return { status: 500, body: { error: error } };
}
