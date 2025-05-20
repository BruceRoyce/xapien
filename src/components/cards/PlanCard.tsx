import Button from "@/components/buttons/Button";
import cm from "@/utils/styleMixer";

export default function PlanCard({
	title,
	description,
	className = "",
	id,
	price,
	credit,
	interval,
	isSelected = false,
	isInteractive = false,
	onSelect,
}: {
	title: string;
	description: string;
	className?: string;
	id?: string;
	price?: number;
	credit?: number;
	interval?: "monthly" | "one-off" | "trial";
	isSelected?: boolean;
	isInteractive?: boolean;
	onSelect?: () => void;
}) {
	return (
		<div
			id={id}
			className={cm("card", "plan-card", className, {
				selected: isSelected,
				interactive: isInteractive,
			})}
			onClick={onSelect}
		>
			<div className="plan-card-layout">
				<h3 className="plan-card-title">{title}</h3>
				<div className="plan-card-content">
					<div>{description}</div>
					<div className="plan-card-price">
						{price ? (
							<span className="plan-card-price-value">
								£{price.toFixed(2)} {interval}
							</span>
						) : (
							<span className="plan-card-price-value">Free</span>
						)}
						{credit && <span className="plan-card-credit">{credit} credits</span>}
					</div>
				</div>
				{onSelect && (
					<div className="plan-card-footer">
						<Button
							label="Select Plan"
							variant="ghost"
							className="plan-card-button"
							onClick={onSelect}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
