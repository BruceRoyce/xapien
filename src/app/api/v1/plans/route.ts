import { type Plan } from "@/types";
import { XapError } from "@/api/lib/xapError";
import { responseSuccess, responseError } from "@/api/lib/http";
import { getPlans } from "@/api/lib/utils";

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const planId = url.searchParams.get("plan_id");

		const plans = await getPlans({ planId: planId ? parseInt(planId) : undefined });

		return responseSuccess<Plan[]>({ data: plans });
	} catch (error: unknown) {
		return responseError({ error: error as XapError });
	}
}
