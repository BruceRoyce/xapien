export default function RowTitle({ title, className = "" }: { title: string; className?: string }) {
	return <div className={`row-title ${className}`.trim()}>{title}</div>;
}
