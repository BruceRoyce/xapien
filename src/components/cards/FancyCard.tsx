import cm from "@/utils/styleMixer";

type GeneralCardProps = {
	className?: string;
	title?: string;
	text?: string;
	children?: React.ReactNode;
};

export default function FancyCard({
	className = "",
	text = "",
	title,
	children,
}: GeneralCardProps) {
	return (
		<div className={cm("card", "fancy-card", className)}>
			<div className="general-card-content">
				{title && <h2 className="general-card-title">{title}</h2>}
				<div className="general-card-text">{text}</div>
				{children && <div className="general-card-children">{children}</div>}
			</div>
		</div>
	);
}
