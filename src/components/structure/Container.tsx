import cm from "@/utils/styleMixer";
type ContainerProps = {
	children: React.ReactNode;
	className?: string;
	id?: string;
};

export default function Container({ id, children, className = "" }: ContainerProps) {
	return (
		<div
			id={id}
			className={cm("container", className)}
		>
			{children}
		</div>
	);
}
