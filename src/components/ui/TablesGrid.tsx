export default function TablesGrid({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={`tables-wrapper ${className}`}> {children}</div>;
}
