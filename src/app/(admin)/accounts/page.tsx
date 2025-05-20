import { type SuperUserAccountResponsePayload } from "@/app/api/v1/accounts/route";
import fetchData from "@/utils/fetchData";
import { NEXT_PUBLIC_API_URL as API_URL } from "@/../env";
import Main from "@/components/structure/Main";
import Container from "@/components/structure/Container";
import Signboard from "@/components/cards/Signboard";
import AccountsTable from "@/components/tables/AccountsTable";
import Oops from "@/components/ui/oops";

import AccountsSelector from "./ClientSelector";

export const dynamic = "force-dynamic"; // Opt out of static rendering if needed

// Function now accepts searchParams from Next.js
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

	let selectorTarget = "";
	if (params && "target" in params) {
		selectorTarget = params.target;
	}

	const clients = await fetchData<SuperUserAccountResponsePayload[]>({
		apiUrl: API_URL + "/accounts",
		method: "patch",
		tag: "su_accounts",
		body: {},
	});

	if (!clients || "error" in clients) {
		const msg =
			clients && clients?.code
				? clients.code
				: "We couldn't load clients at this moment. Please try again later.";
		return (
			<Oops
				title="Error loading users"
				message={`Somethin wen wrong! 
					${msg} 
					- In this Xapien demo, I can cause intentional fails to demostrate the resiliance of the app. Where thi sis available I placed a check box to activate manual failure.`}
			/>
		);
	}

	return (
		<Main>
			<Container>
				<Signboard title={isList ? "Clients" : "Select a client"} />
				{isList && (
					<AccountsTable
						clients={clients}
						tableTitle="List of clients"
					/>
				)}
				{!isList && (
					<AccountsSelector
						clients={clients}
						selectorTarget={selectorTarget}
					/>
				)}
			</Container>
		</Main>
	);
}
