"use client";
import type { OrderReqPayload_POST } from "@/api/v1/orders/route";
import type { Order, FetchReturnType } from "@/types/";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/buttons/Button";
import GeneralCard from "@/components/cards/GeneralCard";
import useStore from "@/store/useStore";
import useDrawer from "@/hooks/useDrawer";
import DemoFailCheckbox from "@/components/forms/DemoFailCheckbox";
import Oops from "@/components/ui/oops";
import TopupInput from "@/components/ui/TopupInput";

type PlansTableProps = {
	placeOrder: (p: OrderReqPayload_POST & { failCode: number }) => Promise<FetchReturnType<Order>>;
};

export default function SetPlan({ placeOrder }: PlansTableProps) {
	const router = useRouter();
	const [failCode, setFailCode] = useState(0);
	const [isError, setIsError] = useState(false);
	const [topup, $setTopup] = useState(1);
	const setTopup = (value: number) => {
		if (value < 1) {
			value = 1;
		}
		if (value > 100) {
			value = 100;
		}
		$setTopup(() => value);
	};
	console.log("Setting topup", topup);
	const drawer = useDrawer();
	const { selectedPlan, selectedClient } = useStore();

	async function handleConfirm() {
		try {
			if (!selectedPlan || !selectedClient) {
				throw new Error("No plan or client selected");
			}
			const order = await placeOrder({
				accountId: selectedClient.id,
				planId: selectedPlan.id,
				topup,
				failCode,
			});

			if (!order) {
				drawer({
					drawerTitle: "Order Failed",
					drawerChild: <Oops title="Failed to save the order and assign credits!" />,
				});
			} else if ("error" in order) {
				drawer({
					drawerTitle: "Order Failed",
					drawerChild: (
						<Oops
							title="Failed to place your order - Credits aren't assigned"
							message={order?.code || ""}
						/>
					),
				});
			} else if ("id" in order) {
				router.push(
					`/order-confirmation?orderId=${order.id}&accountId=${selectedClient.id}&planId=${selectedPlan.id}`
				);
			}
		} catch (error) {
			drawer({
				drawerTitle: "Failure",
				drawerChild: (
					<Oops
						title="You are early!"
						message="Please select a client and a plan first."
					></Oops>
				),
			});
			console.info("Error placing order:", error);
		}
	}

	useEffect(() => {
		const isError = !Boolean(selectedClient) || !Boolean(selectedPlan);
		setIsError(isError);
		if (isError) {
			drawer({
				drawerTitle: "You are early!",
				drawerChild: (
					<Oops
						title="You are an early person, aren't you?"
						message="Please select a client and a plan first."
					/>
				),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedClient, selectedPlan]);

	if (isError) {
		return (
			<Oops
				title="You should not be here!"
				message={`You should not be here! Please select a client and a plan first.
					- In this Xapien demo, I can cause intentional fails to demostrate the resiliance of the app. Where thi sis available I placed a check box to activate manual failure.`}
			/>
		);
	}
	return (
		<div className="flex col">
			<GeneralCard title={selectedClient?.name || ""}></GeneralCard>
			<GeneralCard title={selectedPlan?.name || ""}>
				<TopupInput
					topupCredits={topup}
					onChange={setTopup}
				/>
			</GeneralCard>
			<Button
				label="Confirm Plan"
				onClick={handleConfirm}
				variant="primary"
				size="large"
			/>
			<DemoFailCheckbox onChange={(e) => setFailCode(e.target.checked ? 500 : 0)} />
		</div>
	);
}
