import { XapError } from "./xapError";
import { type XapResponse } from "@/types";

export function responseSuccess<T>({
	data,
	statusCode = 200,
}: Omit<XapResponse<T>, "success" | "error">): Response {
	const res = {
		data,
		success: true,
		error: null,
	};

	return new Response(JSON.stringify(res), {
		status: statusCode,
		headers: { "Content-Type": "application/json" },
	});
}

export function responseError({
	error,
}: Omit<XapResponse<never>, "success" | "data" | "statusCode">): Response {
	const res = {
		data: null,
		success: false,
		error: error instanceof XapError ? error : new XapError(error! as Error),
	};

	return new Response(JSON.stringify(res), {
		status: res.error.statusCode ?? 500,
		headers: { "Content-Type": "application/json" },
	});
}
