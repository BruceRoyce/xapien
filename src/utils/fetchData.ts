"use server";

import { type XapError } from "@/app/api/lib/xapError";

const DOES_SHOW_FETCH_LOGS = true;

export default async function fetchData<T>(options: {
	apiUrl: string;
	method?:
		| "get"
		| "post"
		| "put"
		| "delete"
		| "patch"
		| "GET"
		| "POST"
		| "PUT"
		| "DELETE"
		| "PATCH";
	body?: object;
	tag?: string;
	includeCredentials?: boolean;
}): Promise<T | XapError | false> {
	const { apiUrl, method = "get", body, tag = "fetch", includeCredentials = true } = options;
	if (DOES_SHOW_FETCH_LOGS) {
		console.log("fetching data from:", apiUrl);
		console.log("method:", method);
		console.log("body:", body);
	}

	try {
		const fetchOptions = Object.assign(
			{
				method: method.toUpperCase(),
				headers: {
					"Content-Type": "application/json",
				},
				credentials: (includeCredentials ? "include" : "same-origin") as RequestCredentials,
				cache: "no-store" as RequestCache,
				next: {
					tags: [tag],
					revalidate: 0,
				},
			},
			body ? { body: JSON.stringify(body) } : {}
		);

		const res = await fetch(apiUrl, fetchOptions);

		if (DOES_SHOW_FETCH_LOGS) {
			console.log("fetch response:", res);
		}
		const json = await res.json();
		if (json.success) {
			return json.data as T;
		} else {
			return json.error as XapError;
		}
	} catch (error) {
		console.error("Error fetching data:", error);
		return false;
	}
}
