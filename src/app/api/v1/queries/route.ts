import { db } from "@/api/lib/db";
import { XapError } from "@/api/lib/xapError";
import { responseSuccess, responseError } from "@/api/lib/http";
import {
	handleSimulatedFailure,
	getUserCredit,
	getUserById,
	updateUserCredit,
	updateAccountUsersCreditsByAccountId,
	updateQuery,
	getSubscriptions,
	checkSubscriptionExpired,
} from "@/api/lib/utils";
import { XapRequestPayload } from "@/types";
import preformQuery from "@/api/lib/preformQuery";

type QueryReqPayload = { userId: number; query: string };
export type QueryResponsePayload = {
	queryId: number;
	query: string;
	result: string;
	remainingCredit: number;
};

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const userId = url.searchParams.get("user_id");
		if (!userId) {
			throw new XapError(new Error("user_id parameter is needed"), {
				code: "MISSING_USER_ID",
				statusCode: 400,
			});
		}
		const stmt = db.prepare("SELECT * FROM queries WHERE user_id = ?");
		const users = stmt.all(userId);
		if (users.length === 0) {
			throw new XapError(new Error("No query found for the given user_id"), {
				code: "NO_QUERY_FOUND",
				statusCode: 404,
			});
		}
		return responseSuccess({ data: users });
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}

// when user preforms a query
export async function POST(request: Request) {
	try {
		const {
			userId,
			query,
			failCode = 0,
		} = (await request.json()) as XapRequestPayload<QueryReqPayload>;

		if (!userId) {
			throw new XapError(new Error("Missing userId"), {
				code: "MISSING_MANDATORY_FIELDS",
				statusCode: 400,
			});
		}
		if (!query) {
			throw new XapError(new Error("No query supplied"), {
				code: "MISSING_QUERY",
				statusCode: 400,
			});
		}

		// add query to the table
		const stmnt = db.prepare("INSERT INTO queries (user_id, query, status) VALUES (?, ?, ?)");
		const addResult = stmnt.run([userId, query, "pending"]);
		if (!addResult || addResult.changes === 0) {
			throw new XapError(new Error("Failed to insert query"), {
				code: "INSERT_FAILED",
				statusCode: 500,
			});
		}
		const queryId = addResult.lastInsertRowid as number;

		// Demo failure handling if needed
		const simulatedFailure = handleSimulatedFailure(failCode, () => {
			updateQuery({ queryId, query, result: "", status: "failed" });
		});
		if (simulatedFailure) {
			throw simulatedFailure;
		}

		// check user's parent account subscription is not expired
		const user = await getUserById({ userId });
		const userAccountSubscription = await getSubscriptions({
			accountId: user.account_id,
		});

		if (!userAccountSubscription || userAccountSubscription.status !== "succeeded") {
			await updateQuery({ queryId, query, result: "", status: "failed" });
			throw new XapError(new Error("User account subscription not found"), {
				code: "SUBSCRIPTION_NOT_FOUND",
				statusCode: 402,
			});
		}

		const isSubscriptionExpired = checkSubscriptionExpired({
			subscription: userAccountSubscription,
		});

		if (isSubscriptionExpired) {
			// 1st I fail the query
			await updateQuery({ queryId, query, result: "", status: "failed" });
			// then I reset account and all account's user credits to 0
			await updateAccountUsersCreditsByAccountId({ accountId: user.account_id, credit: 0 });
			throw new XapError(new Error("User account subscription expired"), {
				code: "SUBSCRIPTION_EXPIRED",
				statusCode: 402,
			});
		}

		// check whther user has enough credit
		const queryCost = 1;
		const userAvailableCredit = await getUserCredit({ userId });
		const newCredit = userAvailableCredit - queryCost;

		if (newCredit < 0) {
			await updateQuery({ queryId, query, result: "", status: "failed" });
			throw new XapError(new Error("Insufficient credit"), {
				code: "INSUFFICIENT_CREDIT",
				statusCode: 402,
			});
		}

		// Simulate processing the query and getting a result
		const result = (await preformQuery(query)).result;
		if (!result) {
			await updateQuery({ queryId, query, result: "", status: "failed" });
			throw new XapError(new Error("Failed to process query"), {
				code: "QUERY_PROCESSING_FAILED",
				statusCode: 500,
			});
		}

		// Update the query with the result and status
		const updateNewCredit = await updateUserCredit({ userId, credit: newCredit });
		if (!updateNewCredit) {
			await updateQuery({ queryId, query, result: "", status: "failed" });
			throw new XapError(new Error("Failed to update user credit"), {
				code: "CREDIT_UPDATE_FAILED",
				statusCode: 500,
			});
		}
		const completeQuery = await updateQuery({ queryId, query, result, status: "completed" });
		if (!completeQuery || completeQuery.changes === 0) {
			throw new XapError(new Error("Failed to update query"), {
				code: "QUERY_UPDATE_FAILED",
				statusCode: 500,
			});
		}
		return responseSuccess<QueryResponsePayload>({
			data: { queryId, query, result, remainingCredit: newCredit },
		});
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}
