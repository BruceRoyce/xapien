import { db } from "@/api/lib/db";
import type * as Types from "@/types";
import { XapError } from "./xapError";

export function handleSimulatedFailure(failCode: number, callback?: () => void) {
	let returnable: false | XapError = false;
	if (failCode > 0) {
		if (callback) callback();
		returnable = new XapError(new Error("Simulated failure"), {
			code: "SIMULATED_FAILURE",
			statusCode: failCode,
		});
	}
	return returnable;
}

// plans

export async function getPlans({ planId }: { planId?: number }): Promise<Types.Plan[]> {
	const query = planId ? `SELECT * FROM plans WHERE id = ?;` : "SELECT * FROM plans;";
	const stmt = db.prepare(query);
	if (planId) {
		const plan = stmt.get(planId) as Types.Plan | undefined;
		if (!plan) {
			throw new XapError(new Error("No plan found for the given plan_id"), {
				code: "NO_PLAN_FOUND",
				statusCode: 404,
			});
		}
		return [plan];
	} else {
		const plans = stmt.all() as Types.Plan[];
		if (!plans || plans.length === 0) {
			throw new XapError(new Error("No plans found"), {
				code: "NO_PLANS_FOUND",
				statusCode: 404,
			});
		}
		return plans;
	}
}

// queries
export async function updateQuery({
	queryId,
	query,
	result,
	status,
}: {
	queryId: number;
	query: string;
	result: string;
	status: "draft" | "pending" | "processing" | "completed" | "failed" | "abandoned";
}) {
	const stmt = db.prepare("UPDATE queries SET query = ?, result= ?, status=? WHERE id = ?");
	const transaction = stmt.run(query, result, status, queryId);
	if (transaction.changes === 0) {
		throw new XapError(new Error("Failed updating query"), {
			code: "QUERY_UPDATE_FAILED",
			statusCode: 503,
		});
	}
	return transaction;
}

// users

export async function getUsersByAccountId({
	accountId,
}: {
	accountId: number;
}): Promise<Types.User[]> {
	const stmt = db.prepare("SELECT * FROM users WHERE account_id = ?");
	const users = stmt.all(accountId) as Types.User[];
	if (!users || users.length === 0) {
		throw new XapError(new Error("No users found for the given account_id"), {
			code: "NO_USERS_FOUND",
			statusCode: 404,
		});
	}
	return users;
}

export async function getUserByEmailAddress({
	userEmailAddress,
}: {
	userEmailAddress: string;
}): Promise<Types.User> {
	const stmt = db.prepare("SELECT * FROM users WHERE email_address = ?");
	const user = stmt.get(userEmailAddress) as Types.User | undefined;
	if (!user) {
		throw new XapError(new Error("User not found"), {
			code: "USER_NOT_FOUND",
			statusCode: 404,
		});
	}
	return user;
}

export async function getUserById({ userId }: { userId: number }): Promise<Types.User> {
	const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
	const user = stmt.get(userId) as Types.User | undefined;
	if (!user) {
		throw new XapError(new Error("User not found"), {
			code: "USER_NOT_FOUND",
			statusCode: 404,
		});
	}
	return user;
}

export async function getUserCredit({ userId }: { userId: number }): Promise<number> {
	const stmt = db.prepare("SELECT credit FROM users WHERE id = ?");
	const user = stmt.get(userId) as Types.User | undefined;
	if (!user) {
		throw new XapError(new Error("User not found"), {
			code: "USER_NOT_FOUND",
			statusCode: 404,
		});
	}
	return user.credit;
}

// update account remaining credit
type updateAccountCreditParams = {
	accountId: number;
	credit: number;
};

// Update user credit by either userId or userEmailAddress
type UpdateUserCreditParams =
	| {
			userId: number;
			userEmailAddress?: never;
			credit: number;
	  }
	| {
			userId?: never;
			userEmailAddress: string;
			credit: number;
	  };

export async function updateUserCredit({
	userId,
	userEmailAddress,
	credit,
}: UpdateUserCreditParams): Promise<boolean> {
	let sql: string;
	let params: [number, string] | [number, number];
	if (typeof userEmailAddress === "string" && userEmailAddress.length > 0) {
		sql = `UPDATE users SET credit = ? WHERE email_address = ?`;
		params = [credit, userEmailAddress];
	} else if (typeof userId === "number") {
		sql = `UPDATE users SET credit = ? WHERE id = ?`;
		params = [credit, userId];
	} else {
		throw new XapError(new Error("Missing user identifier for credit update"), {
			code: "MISSING_USER_IDENTIFIER",
			statusCode: 400,
		});
	}
	const stmt = db.prepare(sql);
	const result = stmt.run(...params) as { changes: number };
	if (result.changes === 0) {
		throw new XapError(new Error("Failed to update credit"), {
			code: "UPDATE_FAILED",
			statusCode: 500,
		});
	}
	return result.changes > 0;
}

export async function updateAccountUsersCreditsByUsers({
	users,
	reminingCredit,
	accountId,
}: {
	users: Types.User[];
	reminingCredit: number;
	accountId?: number;
}): Promise<boolean> {
	// for this test I am going to update all users in parallel
	// in production we could test each update to make sure it is successful
	// and then update the account credit
	// and is so we then commit the changes
	accountId = accountId || users[0].account_id;
	const collectiveUpdateOPeration = users.map((user) =>
		updateUserCredit({ userId: user.id, credit: user.credit })
	);
	collectiveUpdateOPeration.push(
		updateAccountCreditRemaining({ accountId, credit: reminingCredit })
	);
	// return results.some((result) => !result);
	const update = (await Promise.all(collectiveUpdateOPeration)).every((result) => result);
	return update;
}

// accounts

export async function getAccounts({ accountId }: { accountId?: number }): Promise<Types.Account[]> {
	const query = accountId ? `SELECT * FROM accounts WHERE id = ?;` : "SELECT * FROM accounts;";
	const stmt = db.prepare(query);
	if (accountId) {
		const account = stmt.get(accountId) as Types.Account | undefined;
		if (!account) {
			throw new XapError(new Error("No account found for the given account_id"), {
				code: "NO_ACCOUNT_FOUND",
				statusCode: 404,
			});
		}
		return [account];
	} else {
		const accounts = stmt.all() as Types.Account[];
		if (!accounts || accounts.length === 0) {
			throw new XapError(new Error("No accounts found"), {
				code: "NO_ACCOUNTS_FOUND",
				statusCode: 404,
			});
		}
		return accounts;
	}
}

export async function getAccountCreditRemaining({
	accountId,
}: {
	accountId: number;
}): Promise<number> {
	const stmt = db.prepare(`SELECT credit_remaining FROM accounts WHERE id = ?`);
	const result = stmt.get(accountId) as { credit_remaining: number } | undefined;
	if (!result) {
		throw new XapError(new Error("Failed to get account remaining credit"), {
			code: "FAILD_GET_ACCOUNT_CREDIT",
			statusCode: 500,
		});
	}
	return result.credit_remaining as number;
}

export async function updateAccountCreditRemaining({
	accountId,
	credit,
}: updateAccountCreditParams): Promise<boolean> {
	const stmt = db.prepare(`UPDATE accounts SET credit_remaining = ? WHERE id = ?`);
	const result = stmt.run(credit, accountId) as { changes: number };
	if (result.changes === 0) {
		throw new XapError(new Error("Failed to update credit"), {
			code: "UPDATE_FAILED",
			statusCode: 500,
		});
	}
	return result.changes > 0;
}

export async function updateAccountUsersCreditsByAccountId({
	accountId,
	credit,
}: {
	accountId: number;
	credit: number;
}): Promise<boolean> {
	const users = await getUsersByAccountId({ accountId });
	const updatePromises = users.map((user) => updateUserCredit({ userId: user.id, credit }));
	updatePromises.push(updateAccountCreditRemaining({ accountId, credit }));
	const results = await Promise.all(updatePromises);
	return results.every(Boolean);
}

// orders
export async function getLastPlacedOrder(accountId: number): Promise<Types.Order> {
	const stmt = db.prepare(
		"SELECT * FROM orders WHERE account_id = ? AND status= 'placed' ORDER BY id DESC LIMIT 1"
	);
	const order = stmt.get(accountId) as Types.Order | undefined;
	if (!order) {
		return {} as Types.Order;
	}
	return order;
}

export async function updateOrderStatus({
	orderId,
	status,
}: {
	orderId: number;
	status: Types.Order["status"];
}): Promise<boolean> {
	const stmt = db.prepare("UPDATE orders SET status = ? WHERE id = ?");
	const transaction = stmt.run(status, orderId);
	if (transaction.changes === 0) {
		throw new XapError(new Error("Failed updating order status"), {
			code: "ORDER_UPDATE_FAILED",
			statusCode: 503,
		});
	}
	return transaction.changes > 0;
}

// payment method
export function getDefaultPaymentMethodByAccountId({ accountId }: { accountId: number }): number {
	// Get default payment method for this account
	const paymentMethodStmt = db.prepare(
		"SELECT id FROM payment_methods WHERE account_id = ? AND is_default = TRUE LIMIT 1"
	);
	const paymentMethod = paymentMethodStmt.get([accountId]) as { id: number } | undefined;
	// for this test I will return an id anyway!
	return paymentMethod?.id || 20;
}

/// subscriptions

export async function getSubscriptions({
	accountId,
}: {
	accountId: number;
}): Promise<Types.Subscription | null> {
	const stmt = db.prepare(
		"SELECT * FROM subscriptions WHERE account_id = ? ORDER BY id DESC LIMIT 1"
	);
	const subscription = stmt.get([accountId]) as Types.Subscription | undefined;
	if (!subscription) {
		throw new XapError(new Error("No subscriptions found for the given account_id"), {
			code: "NO_SUBSCRIPTIONS_FOUND",
			statusCode: 404,
		});
	}
	return subscription;
}

export async function addSubscription({
	accountId,
	planId,
	orderId,
}: {
	accountId: number;
	planId: number;
	orderId: number;
}): Promise<{ creditsToBeAdded: number }> {
	const plans = await getPlans({ planId });
	if (!plans) {
		throw new XapError(new Error("No plan found for the given order's plan_id"), {
			code: "NO_PLAN_FOUND",
			statusCode: 404,
		});
	}

	// Get default payment method for this account

	const paymentMethodId = getDefaultPaymentMethodByAccountId({ accountId });

	const charged_amount = plans[0].price;
	const status = "succeeded"; // Assuming the charge is successful

	const interval_start_date = new Date().toISOString();
	const interval = plans[0].interval;
	let interval_end_date = "";

	switch (interval) {
		case "monthly":
		case "one-off":
			interval_end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
			break;
		case "trial":
			interval_end_date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
			break;
		default:
			throw new XapError(new Error("Invalid plan interval"), {
				code: "INVALID_PLAN_INTERVAL",
				statusCode: 400,
			});
	}

	const stmt = db.prepare(`INSERT INTO subscriptions (
		account_id,
		payment_method_id, 
		order_id, 
		charged_amount, 
		status,
		interval_start_date,
		interval_end_date
		)
		VALUES
		(?, ?, ?, ?, ?, ?, ?);`);

	const transaction = stmt.run(
		accountId,
		paymentMethodId,
		orderId,
		charged_amount,
		status,
		interval_start_date,
		interval_end_date
	);

	if (transaction.changes === 0) {
		throw new XapError(new Error("Failed to create subscription"), {
			code: "SUBSCRIPTION_CREATION_FAILED",
			statusCode: 500,
		});
	}
	return { creditsToBeAdded: plans[0].credit };
}

export function checkSubscriptionExpired({
	subscription,
}: {
	subscription: Types.Subscription | null;
}): boolean {
	if (!subscription) return true;

	const currentDate = new Date();
	const planEndDate = new Date(subscription.interval_end_date);
	return planEndDate < currentDate;
}
