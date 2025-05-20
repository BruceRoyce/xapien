import Main from "@/components/structure/Main";
import Container from "@/components/structure/Container";
import Oops from "@/components/ui/oops";

export default function NotFound() {
	return (
		<Main>
			<Container>
				<Oops
					title="Sorry reece! This page is not found"
					message="Not everything is implemented in this test. Why? Because you said so yourself!"
					buttonLabel="Go to Dashboard instead!"
					href="/dashboard"
				></Oops>
			</Container>
		</Main>
	);
}
