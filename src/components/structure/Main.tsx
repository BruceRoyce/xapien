import cm from "@/utils/styleMixer";
type MainProps = {
	children: React.ReactNode;
	className?: string;
	id?: string;
};

export default function Main({ id, children, className = "" }: MainProps) {
	return (
		<main
			id={id}
			className={cm("main", className)}
		>
			{children}
		</main>
	);
}
