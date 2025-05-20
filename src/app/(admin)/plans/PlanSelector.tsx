"use client";
import { type Plan } from "@/types/";
import PlansTable from "@/components/tables/PlansTable";
import useStore from "@/store/useStore";
import InfoCard from "@/components/cards/InfoCard";
import Button from "@/components/buttons/Button";
import ArrowForward from "@/components/icons/ArrowForward";
import RowActions from "@/components/tables/RowAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useDrawer from "@/hooks/useDrawer";
import Oops from "@/components/ui/oops";

export default function PlanSelector({ plans }: { plans: Plan[] }) {
	const router = useRouter();
	const drawer = useDrawer();
	const { setSelectedPlan, selectedPlan, selectedClient } = useStore();

	function findPlanById({ plans, planId }: { plans: Plan[]; planId: number }) {
		return plans.find((plan) => plan.id === planId) || null;
	}

	function handleSelectPlan(planId: number) {
		const plan = findPlanById({ plans, planId: planId });
		if (!plan) {
			console.error("Plan not found for ID:", planId);
			return;
		}
		setSelectedPlan({ id: planId, name: plan.name, credits: plan.credit });
	}

	function handleNext() {
		if (!selectedPlan) {
			drawer({
				drawerChild: (
					<Oops title="Too early, but no worms here?">
						<p>
							Please <b>select a plan first</b> and then click next!
						</p>
					</Oops>
				),
				drawerTitle: "Plan is not selected",
			});
			return;
		}
		router.push("/set-plan");
	}

	const isClientSelected = Boolean(selectedClient);
	const message = isClientSelected
		? `Selected a plan for <b>${selectedClient!.name}</b> and hit Next`
		: "No client selected";

	return (
		<>
			{isClientSelected && <InfoCard info={message} />}
			{!isClientSelected && (
				<InfoCard info={message}>
					<Link href="/accounts">
						<Button
							label="Select a Client First"
							variant="primary"
						/>
					</Link>
				</InfoCard>
			)}

			<PlansTable
				plans={plans}
				onSelect={isClientSelected ? handleSelectPlan : undefined}
				selectedPlanId={selectedPlan?.id || -1}
			/>
			{isClientSelected && (
				<RowActions className="rounded mt-2">
					<Button
						className="btn btn-primary"
						label={`Next <b>Assign Plan</b>`}
						size="large"
						child={<ArrowForward />}
						onClick={handleNext}
						childrenPosition="right"
					/>
				</RowActions>
			)}
		</>
	);
}
