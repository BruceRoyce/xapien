export default function RowActions({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={`row-buttons ${className}`.trim()}>{children}</div>;
}
