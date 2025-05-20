import Main from "@/components/structure/Main";
import Container from "@/components/structure/Container";
import Signboard from "@/components/cards/Signboard";

export default function OrderConfirmationLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Main>
			<Container>
				<Signboard
					title="Order successfully placed"
					message="The credits have been added to the account. Order is now fulfilled."
				/>
				{children}
			</Container>
		</Main>
	);
}
