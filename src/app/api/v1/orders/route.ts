import { db } from "@/api/lib/db";
import { XapError } from "@/api/lib/xapError";
import { responseSuccess, responseError } from "@/api/lib/http";
import {
	handleSimulatedFailure,
	updateOrderStatus,
	updateAccountCreditRemaining,
	updateAccountUsersCreditsByAccountId,
	addSubscription,
	getPlans,
	getAccounts,
} from "@/api/lib/utils";
import type * as Types from "@/types";

// used for get
export async function PATCH() {
	// This is a placeholder for the GET method
	// You can implement your logic here if needed
	return responseSuccess({ data: "GET method not implemented" });
}

// this is for adding a new plan to a client account
export type OrderReqPayload_POST = {
	accountId: number;
	planId: number;
	topup?: number;
};
export async function POST(request: Request) {
	let orderCreated = false;
	let orderId: number | null = null;

	try {
		// Parse and validate request payload
		const {
			accountId,
			planId,
			topup = 1,
			failCode = 0,
		}: Types.XapRequestPayload<OrderReqPayload_POST> = await request.json();

		// Demo failure handling if needed
		const simulatedFailure = handleSimulatedFailure(failCode);
		if (simulatedFailure) {
			throw simulatedFailure;
		}

		if (!accountId || !planId) {
			throw new XapError(new Error("Missing Account ID or Plan ID"), {
				code: "MISSING_IDENTIFIERS",
				statusCode: 400,
			});
		}
		// let's Verify the account and plan exist before creating the order
		// Check if the account exist
		let account: Types.Account | null = null;
		try {
			const accounts = await getAccounts({ accountId });
			account = accounts[0];
		} catch {
			throw new XapError(new Error("Account not found"), {
				code: "ACCOUNT_NOT_FOUND",
				statusCode: 404,
			});
		}

		// Check if the plan exist
		let plan: Types.Plan | null = null;
		try {
			const plans = await getPlans({ planId });
			plan = plans[0];
		} catch {
			throw new XapError(new Error("Plan not found"), {
				code: "PLAN_NOT_FOUND",
				statusCode: 404,
			});
		}

		// Create a new order with the given planId

		const stmnt = db.prepare("INSERT INTO orders (account_id, plan_id) VALUES (?, ?);");
		const result = stmnt.run(accountId, planId);
		if (!result) {
			throw new XapError(new Error("Failed to place new order"), {
				code: "CREATE_FAILED",
				statusCode: 500,
			});
		}
		orderCreated = true;
		orderId = result.lastInsertRowid as number;

		// Charge for subscription
		let { creditsToBeAdded } = await addSubscription({
			accountId,
			planId,
			orderId,
		});

		if (plan.name.toLowerCase() === "top-up" || plan.name.toLowerCase() === "topup") {
			creditsToBeAdded = account.credit_remaining + topup;
		} else if (!creditsToBeAdded) {
			throw new XapError(new Error("Failed to charge subscription"), {
				code: "CHARGE_FAILED",
				statusCode: 500,
			});
		}

		// Update order status
		const updatedOrder = await updateOrderStatus({
			orderId,
			status: "placed",
		});
		if (!updatedOrder) {
			throw new XapError(new Error("Failed to update order status"), {
				code: "UPDATE_ORDER_FAILED",
				statusCode: 500,
			});
		}

		// reset all account users credits
		if (
			!(await updateAccountUsersCreditsByAccountId({
				accountId,
				credit: 0,
			}))
		) {
			throw new XapError(new Error("Failed to reset account users credits"), {
				code: "UPDATE_ACCOUNT_USERS_CREDITS_FAILED",
				statusCode: 500,
			});
		}

		// Update account credit (assuming the previous credit will not be transferred to the new plan)
		const updatedAccountCredit = await updateAccountCreditRemaining({
			accountId,
			credit: creditsToBeAdded,
		});
		if (!updatedAccountCredit) {
			throw new XapError(new Error("Failed to update account credit"), {
				code: "UPDATE_ACCOUNT_CREDIT_FAILED",
				statusCode: 500,
			});
		}

		// Fetch and return the created order
		const orderStmt = db.prepare("SELECT * FROM orders WHERE id = ?");
		const createdOrder = orderStmt.get(orderId) as Types.Order;
		return responseSuccess<Types.Order>({ data: createdOrder });
	} catch (error: unknown) {
		// If order was created but another operation failed, update the order to 'failed' status
		if (orderCreated && orderId) {
			try {
				await updateOrderStatus({ orderId, status: "failed" });
			} catch {
				// Ignore errors in cleanup
			}
		}

		// Add more detailed error information for debugging
		console.error("Order creation error:", error);

		// If it's not already an XapError, wrap it
		if (!(error instanceof XapError)) {
			const sqliteError = error as Error & { code?: string };
			if (sqliteError && sqliteError.code && sqliteError.code.startsWith("SQLITE_")) {
				return responseError({
					error: new XapError(
						new Error(`Database error: ${sqliteError.message || "Unknown error"}`),
						{
							code: sqliteError.code,
							statusCode: 500,
						}
					),
				});
			}

			return responseError({
				error: new XapError(error as Error, {
					code: "UNKNOWN_ERROR",
					statusCode: 500,
				}),
			});
		}

		return responseError({ error: error as XapError });
	}
}
