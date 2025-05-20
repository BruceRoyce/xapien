import type { Order } from "@/types/";
import type { OrderReqPayload_POST } from "@/api/v1/orders/route";
import SetPlan from "./SetPlan";
import fetchData from "@/utils/fetchData";
import Main from "@/components/structure/Main";
import Container from "@/components/structure/Container";
import Signboard from "@/components/cards/Signboard";
// import { redirect } from "next/navigation";

import { NEXT_PUBLIC_API_URL } from "@/../env";

export default async function Page() {
	// server action to place an order
	// set to be on the server to avoid client-side security concerns

	async function placeOrder({
		accountId,
		planId,
		topup,
		failCode = 0,
	}: OrderReqPayload_POST & { failCode?: number }) {
		"use server";
		const response = await fetchData<Order>({
			apiUrl: NEXT_PUBLIC_API_URL + "/orders",
			method: "post",
			body: { accountId, planId, topup, failCode },
			tag: "orders",
		});

		return response;
	}

	return (
		<Main>
			<Container>
				<Signboard
					title="Purchase confirmation"
					message="There would be a payment/shopping process here, but this is a demo. Please just confirm."
				/>
				<SetPlan placeOrder={placeOrder} />
			</Container>
		</Main>
	);
}
