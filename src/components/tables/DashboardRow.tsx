"use client";
import cm from "@/utils/styleMixer";

export type DashboardRowProps = {
	name: string;
	id?: string;
	className?: string;
	tabIndex?: number;
	icon?: React.ReactNode;
};

export default function DashRow({
	id,
	name,
	className = "",
	tabIndex = 0,
	icon,
}: DashboardRowProps) {
	return (
		<div
			id={id}
			className={cm("row", "generic-row", className)}
			tabIndex={tabIndex}
		>
			<div className="dash-row-layout">
				<div className="generic-row-avatar">X</div>
				<h3 className="generic-row-name">{name}</h3>
				<div className="dash-row-actions">{icon}</div>
			</div>
		</div>
	);
}
