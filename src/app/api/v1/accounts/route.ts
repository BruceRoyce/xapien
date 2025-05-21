import { XapError } from "@/api/lib/xapError";
import { responseSuccess, responseError } from "@/api/lib/http";
import {
	getAccountCreditRemaining,
	getAccounts,
	getLastPlacedOrder,
	getPlans,
	getUsersByAccountId,
} from "@/api/lib/utils";
import type * as Types from "@/types";

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const accountId = url.searchParams.get("account_id");
		const accounts = await getAccounts({ accountId: accountId ? parseInt(accountId) : undefined });
		return responseSuccess<Types.Account[]>({ data: accounts });
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}

// super user get account
export type SuperUserAccountResponsePayload = {
	account: Types.Account;
	users: Types.User[];
	totalRemainingCredits: number;
	planName: string;
};

export async function PATCH(request: Request) {
	try {
		const { accountId } = await request.json();
		const responseData = [] as SuperUserAccountResponsePayload[];
		const accounts = accountId
			? await getAccounts({ accountId: parseInt(accountId) })
			: await getAccounts({});

		for (const account of accounts) {
			const users = await getUsersByAccountId({ accountId: account.id });
			const credits = await getAccountCreditRemaining({ accountId: account.id });
			const totalRemainingCredits = credits + users.reduce((acc, user) => acc + user.credit, 0);

			let planName = "None";

			try {
				const order = await getLastPlacedOrder(account.id);
				if (order && order?.plan_id) {
					planName = (await getPlans({ planId: order.plan_id }))[0]?.name || "Unknown Plan";
				}
			} catch (error: unknown) {
				if (error instanceof XapError) {
					if (error?.statusCode === 404) {
						console.info("Some data not found:", error);
					} else {
						// retrhow the serious ones
						throw error;
					}
				}
			}

			responseData.push({
				account,
				users,
				totalRemainingCredits,
				planName,
			});
		}

		return responseSuccess<SuperUserAccountResponsePayload[]>({ data: responseData });
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}
