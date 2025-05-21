import type { User } from "@/types";
import { db } from "@/api/lib/db";
import { XapError } from "@/api/lib/xapError";
import { responseSuccess, responseError } from "@/api/lib/http";
import { XapRequestPayload } from "@/types";
import {
	handleSimulatedFailure,
	updateUserCredit,
	updateAccountUsersCreditsByUsers,
	getUserByEmailAddress,
	getUsersByAccountId,
	getAccountCreditRemaining,
	updateAccountCreditRemaining,
} from "@/api/lib/utils";

import { checkTotalCredits } from "@/utils/credits";

export type UserResponsePayload = {
	userEmailAddress: string;
	remainingCredit: number;
};

export type UserReqPayload = { email_address: string; credit: number };

export async function GET(request: Request) {
	// Only use query parameters, no request body
	try {
		const url = new URL(request.url);
		const accountId = url.searchParams.get("account_id");
		if (!accountId) {
			throw new XapError(new Error("Missing account_id query parameter"), {
				code: "MISSING_ACCOUNT_ID",
				statusCode: 400,
			});
		}
		const stmt = db.prepare("SELECT * FROM users WHERE account_id = ?");
		const users = stmt.all(accountId);
		if (users.length === 0) {
			throw new XapError(new Error("No users found for the given account_id"), {
				code: "NO_USERS_FOUND",
				statusCode: 404,
			});
		}
		return responseSuccess({ data: users });
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}

//
// used for updating all account users credits
//

export type UsersUpdateRequestPayload = {
	users: User[];
	failCode?: number;
};
export type UsersUpdateResponsePayload = {
	users: User[];
	remainingCredit: number;
};

export async function PUT(request: Request) {
	try {
		const { users, failCode = 0 }: XapRequestPayload<UsersUpdateRequestPayload> =
			await request.json();

		if (!users || users.length === 0) {
			throw new XapError(new Error("Missing users"), {
				code: "MISSING_FIELDS",
				statusCode: 400,
			});
		}

		// Demo failure handling if needed
		const simulatedFailure = handleSimulatedFailure(failCode);
		if (simulatedFailure) {
			throw simulatedFailure;
		}
		const accountId = users[0].account_id;
		if (!accountId) {
			throw new XapError(new Error("Bad user format"), {
				code: "BAD_USER_FORMAT",
				statusCode: 400,
			});
		}
		const accountPreviousUsers = await getUsersByAccountId({ accountId });

		// TODO in prod check to usee if usesrs are from the same account

		const accountCredit = await getAccountCreditRemaining({ accountId: accountId });
		const totalRemainingCredits =
			accountCredit + accountPreviousUsers.reduce((acc, user) => acc + user.credit, 0);
		// checking if the account (user's company) has enough credit
		const { isExceeding, diff: accountNewRemainingCredit } = checkTotalCredits({
			users,
			totalRemainingCredits,
		});

		if (isExceeding) {
			throw new XapError(new Error("Insufficient account credit"), {
				code: "INSUFFICIENT_CREDIT",
				statusCode: 403,
			});
		}

		//
		// please see the comment in the updateAccountUsersCreditsByUsers function
		const update = await updateAccountUsersCreditsByUsers({
			users,
			accountId,
			reminingCredit: accountNewRemainingCredit,
		});

		if (!update) {
			// here I revert the entire remaining credit for the demo purposes.
			// ina real life we should revert only equvalant to the failed ones
			// I am not going to spend time for it now iun this demo in the interest of time
			//
			// reverting the account credit update if user credit update fails
			await updateAccountCreditRemaining({ accountId, credit: accountCredit });
			throw new XapError(new Error("Couldn't update user's credit"), {
				code: "USER_CREDIT_UPDATE_FAILED",
				statusCode: 500,
			});
		}

		return responseSuccess<UsersUpdateResponsePayload>({
			data: { users, remainingCredit: accountNewRemainingCredit },
		});
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}

// used for update credit
export async function PATCH(request: Request) {
	try {
		const {
			email_address,
			credit,
			failCode = 0,
		}: XapRequestPayload<UserReqPayload> = await request.json();

		if (!email_address || !credit) {
			throw new XapError(new Error("Missing email_address or credit"), {
				code: "MISSING_FIELDS",
				statusCode: 400,
			});
		}

		// Demo failure handling if needed
		const simulatedFailure = handleSimulatedFailure(failCode);
		if (simulatedFailure) {
			throw simulatedFailure;
		}

		// checking if user exists
		const user = await getUserByEmailAddress({ userEmailAddress: email_address });
		if (!user) {
			throw new XapError(new Error("User not found"), {
				code: "USER_NOT_FOUND",
				statusCode: 404,
			});
		}

		// checking if the account (user's company) has enough credit
		const accountCredit = await getAccountCreditRemaining({ accountId: user.account_id });
		if (accountCredit < credit) {
			throw new XapError(new Error("Insufficient account credit"), {
				code: "INSUFFICIENT_CREDIT",
				statusCode: 400,
			});
		}

		const accountNewCredit = accountCredit - credit;
		// updating the account's remaining credit
		const accountUpdate = await updateAccountCreditRemaining({
			accountId: user.account_id,
			credit: accountNewCredit,
		});
		if (!accountUpdate) {
			throw new XapError(new Error("Failed to deduct from user's parent account credit"), {
				code: "USER_PARENT_ACCOUNT_UPDATE_FAILED",
				statusCode: 500,
			});
		}
		// preforming the actual update
		const update = await updateUserCredit({
			userEmailAddress: email_address,
			credit,
		});

		if (!update) {
			// reverting the account credit update if user credit update fails
			await updateAccountCreditRemaining({ accountId: user.account_id, credit: accountCredit });
			throw new XapError(new Error("Couldn't update user's credit"), {
				code: "USER_CREDIT_UPDATE_FAILED",
				statusCode: 500,
			});
		}

		return responseSuccess<UserResponsePayload>({
			data: { userEmailAddress: email_address, remainingCredit: credit },
		});
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}
