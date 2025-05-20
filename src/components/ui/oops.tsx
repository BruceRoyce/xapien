import Button from "@/components/buttons/Button";
import Link from "next/link";
import GeneralCard from "@/components/cards/GeneralCard";
import Container from "@/components/structure/Container";

type OopsProps =
	| {
			title?: string;
			message?: string;

			children?: React.ReactNode;
			buttonLabel?: string;
			className?: string;
	  } & ({ onClick?: () => void; href?: never } | { onClick?: never; href?: string });

export default function Oops({
	title = "",
	message,

	buttonLabel = "Contact Us",
	onClick,
	href,
	children,
	className = "",
}: OopsProps) {
	return (
		<Container>
			<GeneralCard className={`oops ${className}`}>
				<h2>{title}</h2>
				{message && <p>{message}</p>}
				{children && <div className="children">{children}</div>}
				<div className="">
					{(onClick || true) && (
						<Button
							variant="primary"
							type="button"
							label={buttonLabel}
							onClick={onClick}
						></Button>
					)}
					{href && (
						<Link href={href}>
							<Button
								variant="textual"
								type="button"
								label={buttonLabel}
							/>
						</Link>
					)}
				</div>
			</GeneralCard>
		</Container>
	);
}
