type XapErrorProps = {
	statusCode?: number;
	code?: string;
};
export class XapError extends Error {
	public statusCode?: number;
	public code?: string;

	constructor(public error: Error, { statusCode, code }: XapErrorProps = {}) {
		super(error.message);
		this.name = "XapError";
		this.code = code;

		this.statusCode = statusCode ?? 500;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
