import cm from "@/utils/styleMixer";

export default function PlanCard({
	title,
	info,
	className = "",
	children,
}: {
	title?: string;
	info: string;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className={cm("card", "info-card", className)}>
			{!!title && <h3>{title}</h3>}
			<p dangerouslySetInnerHTML={{ __html: info }} />
			<div>{children}</div>
		</div>
	);
}
