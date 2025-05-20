import { XapError } from "@/api/lib/xapError";
import { responseSuccess, responseError } from "@/api/lib/http";
import {
	handleSimulatedFailure,
	getUserByEmailAddress,
	getAccounts,
	getLastPlacedOrder,
	getPlans,
	getSubscriptions,
	checkSubscriptionExpired,
	updateAccountUsersCreditsByAccountId,
} from "@/api/lib/utils";
import * as Types from "@/types";

// get user, account, plan details

export type AuthReqPayload = {
	emailAddress: string;
	password: string;
};

export type AuthResponsePayload = {
	user: Types.User;
	planName: string;
} & (
	| { account: Types.Account } // for super user and admins
	| {
			account: Pick<Types.Account, "id" | "name" | "image_url">; // for regular users
	  }
);

export async function POST(request: Request) {
	const {
		emailAddress,
		password,
		failCode = 0,
	}: Types.XapRequestPayload<AuthReqPayload> = await request.json();
	try {
		// Simulate failure handling
		const simulatedFailure = handleSimulatedFailure(failCode);
		if (simulatedFailure) {
			throw simulatedFailure;
		}

		// Any none-empty password goes for this demo
		const isPass = !!password;

		if (!isPass) {
			throw new XapError(new Error("Failed to create subscription"), {
				code: "SUBSCRIPTION_CREATION_FAILED",
				statusCode: 500,
			});
		}
		const user = await getUserByEmailAddress({ userEmailAddress: emailAddress });
		const userType = user.access_level;
		const latestOrder = await getLastPlacedOrder(user.account_id);
		const plans = await getPlans({ planId: latestOrder.plan_id });
		let planName = plans[0].name;
		const subscription = await getSubscriptions({ accountId: user.account_id });
		const isExpired = checkSubscriptionExpired({ subscription });
		if (isExpired) {
			user.credit = 0;
			planName = "Plan Expired";
			await updateAccountUsersCreditsByAccountId({ accountId: user.account_id, credit: 0 });
		}
		const accounts = await getAccounts({ accountId: user.account_id });

		const responseData =
			userType === "user"
				? {
						user,
						account: {
							id: accounts[0].id,
							name: accounts[0].name,
							image_url: accounts[0].image_url,
						},
						planName,
				  }
				: {
						user,
						account: accounts[0],
						// For super/admin users, return full account details
						planName,
				  };

		return responseSuccess<AuthResponsePayload>({ data: responseData });
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}
