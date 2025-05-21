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
	const [fail, setFail] = useState(false);
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
	const drawer = useDrawer();
	const { selectedPlan, selectedClient, isTopup } = useStore();

	async function handleConfirm() {
		try {
			if (!selectedPlan || !selectedClient) {
				throw {
					title: "Missing mandatory fields",
					message: "No plan or client selected!",
				};
			}
			const order = await placeOrder({
				accountId: selectedClient.id,
				planId: selectedPlan.id,
				topup,
				failCode: fail ? 500 : 0,
			});

			if (!order) {
				throw {
					title: "Failed to save the order and assign credits!",
					message: "Please try again later.",
				};
			} else if ("error" in order) {
				throw {
					title: order?.code || "",
					message: "Failed to place your order - Credits aren't assigned",
				};
			} else if ("id" in order) {
				router.push(
					`/order-confirmation?orderId=${order.id}&accountId=${selectedClient.id}&planId=${selectedPlan.id}`
				);
			}
		} catch (msg: unknown) {
			const errMsg = msg as { title?: string; message?: string };
			drawer({
				drawerTitle: "Order Failed",
				drawerChild: (
					<Oops
						title={errMsg.title}
						message={errMsg.message}
					/>
				),
			});
			console.error("Error placing order:", errMsg);
		}
	}

	useEffect(() => {
		const isError = !Boolean(selectedClient) || !Boolean(selectedPlan);
		setIsError(isError);
		if (isError) {
			drawer({
				drawerTitle: "Something went wrong!",
				drawerChild: (
					<Oops
						title="Missing mandatory fields"
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

	const showTopupOption = isTopup || selectedPlan?.name.toLowerCase() === "top-up";
	return (
		<div className="flex col">
			<GeneralCard title={selectedClient?.name || ""}>
				<li>Account ID: {selectedClient?.id}</li>
			</GeneralCard>
			<GeneralCard
				title={`${selectedPlan?.name || ""} Plan`}
				text="Here should be some sort of purchase / payyment flow, but for this test we are just going to add credits to the account."
			>
				<li>Plan ID: {selectedPlan?.id}</li>
				{showTopupOption && (
					<TopupInput
						topupCredits={topup}
						onChange={setTopup}
					/>
				)}
			</GeneralCard>

			<Button
				label="Confirm Plan"
				onClick={handleConfirm}
				variant="primary"
				size="large"
			/>
			<DemoFailCheckbox onChange={setFail} />
		</div>
	);
}
