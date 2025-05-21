import type { SuperUserAccountResponsePayload } from "@/api/v1/accounts/route";
import type { UsersUpdateRequestPayload, UsersUpdateResponsePayload } from "@/api/v1/users/route";

import fetchData from "@/utils/fetchData";
import { NEXT_PUBLIC_API_URL as API_URL } from "@/../env";

import UsersTable from "@/components/tables/UsersTable";
import Main from "@/components/structure/Main";
import Container from "@/components/structure/Container";
import AccountSignboard from "@/components/cards/AccountSignboard";
import Oops from "@/components/ui/oops";

export default async function Page({
	params,
	searchParams,
}: {
	params: Promise<unknown>;
	searchParams: Promise<{ [key: string]: string }>;
}) {
	const { accountId } = (await params) as { accountId: string };
	const { list } = (await searchParams) as { list: string };
	const isList = list === "true";

	const data = await fetchData<SuperUserAccountResponsePayload[]>({
		apiUrl: `${API_URL}/accounts`,
		method: "patch",
		body: { accountId },
		tag: "accountData",
	});

	if (!data || "error" in data) {
		const msg =
			data && data?.code
				? data.code
				: "We couldn't load the users of this account at this moment. Please try again later.";
		return (
			<Oops
				title="Error loading users"
				message={`Oops! Something went wrong! 
					${msg} 
					- In this Xapien demo, I can cause intentional fails to demostrate the resiliance of the app. Where thi sis available I placed a check box to activate manual failure.`}
			/>
		);
	}

	//

	const client = data[0];

	async function onSaveChanges({ users, failCode }: UsersUpdateRequestPayload) {
		"use server";
		const data = await fetchData<UsersUpdateResponsePayload>({
			apiUrl: `${API_URL}/users`,
			method: "put",
			body: { users, failCode } as UsersUpdateRequestPayload,
			tag: "accountData",
		});

		return data;
	}

	const creditAllocated = client.users.reduce((acc, user) => {
		return user?.credit ? acc + user.credit : acc;
	}, 0);

	const credit = {
		remaining: client.totalRemainingCredits,
		allocated: creditAllocated,
		unallocated: client.totalRemainingCredits - creditAllocated,
	};

	return (
		<Main>
			<Container>
				<AccountSignboard
					imageUrl={client.account.image_url || "/logos/acme.webp"}
					credit={{ ...credit }}
					planName={client.planName}
					name={client.account.name}
				/>
				<UsersTable
					users={client.users}
					totalRemainingCredits={client.totalRemainingCredits}
					onSave={onSaveChanges}
					isListOnly={isList}
				/>
			</Container>
		</Main>
	);
}
