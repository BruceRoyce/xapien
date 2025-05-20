import PlanCard from "@/components/cards/PlanCard";
import Article from "@/components/structure/Article";
import { Plan } from "@/types";
type PlansTableProps = {
	plans: Plan[];
	selectedPlanId?: number;
	onSelect?: (planId: number) => void;
};

export default function PlansTable({ plans, selectedPlanId, onSelect }: PlansTableProps) {
	return (
		<div className="plan-card-wrapper">
			{plans.map((plan) => {
				if (plan.name.toLowerCase() === "top-up") return null;
				return (
					<Article key={plan.id}>
						<PlanCard
							id={`${plan.id}`}
							title={plan.name}
							description={plan.description || ""}
							price={plan.price}
							credit={plan.credit}
							interval={plan.interval}
							isSelected={selectedPlanId === plan.id}
							isInteractive={true}
							onSelect={onSelect ? () => onSelect(plan.id) : undefined}
						/>
					</Article>
				);
			})}
		</div>
	);
}
