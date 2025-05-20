import { type Plan } from "@/types/";
import fetchData from "@/utils/fetchData";
import { NEXT_PUBLIC_API_URL as API_URL } from "@/../env";
import PlanSelector from "./PlanSelector";
import Main from "@/components/structure/Main";
import Container from "@/components/structure/Container";
import Signboard from "@/components/cards/Signboard";
import PlansTable from "@/components/tables/PlansTable";
import Oops from "@/components/ui/oops";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string }>;
}) {
	const params = await searchParams;

	let isList = false;
	if (params && "list" in params) {
		isList = params.list === "true";
	}
	const plans = await fetchData<Plan[]>({
		apiUrl: API_URL + "/plans",
		method: "get",
		tag: "plans",
	});

	if (!plans || "error" in plans) {
		const msg =
			plans && plans?.code
				? plans.code
				: "We couldn't load the plans at this moment. Please try again later.";
		return (
			<Oops
				title="Error loading users"
				message={`Something went wrong! 
					${msg} 
					- In this Xapien demo, I can cause intentional fails to demostrate the resiliance of the app. Where thi sis available I placed a check box to activate manual failure.`}
			/>
		);
	}

	return (
		<Main>
			<Container>
				<Signboard title={isList ? "List of Xapien plans" : "Select a plan"} />
				{isList && <PlansTable plans={plans} />}
				{!isList && <PlanSelector plans={plans} />}
			</Container>
		</Main>
	);
}
