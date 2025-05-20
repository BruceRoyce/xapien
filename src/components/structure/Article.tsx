import cm from "@/utils/styleMixer";
type ArticleProps = {
	children: React.ReactNode;
	className?: string;
	id?: string;
};

export default function Article({ id, children, className = "" }: ArticleProps) {
	return (
		<article
			id={id}
			className={cm("article", className)}
		>
			{children}
		</article>
	);
}
