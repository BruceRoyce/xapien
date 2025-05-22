export default function RowTitle({
	title,
	note,
	className = "",
}: {
	title: string;
	note?: string;
	className?: string;
}) {
	return (
		<div className={`row-title ${className}`.trim()}>
			<span>{title}</span>
			<span className="row-title-info">{note}</span>
		</div>
	);
}
