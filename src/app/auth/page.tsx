import type { AuthReqPayload, AuthResponsePayload } from "@/api/v1/auth/route";

import { NEXT_PUBLIC_API_URL as API_URL } from "@/../env";
import fetchData from "@/utils/fetchData";

import Main from "@/components/structure/Main";
import Container from "@/components/structure/Container";
import LoginForm from "@/components/ui/LoginForm";
import Everyone from "@/components/ui/Everyone";

export const dynamic = "force-dynamic"; // Opt out of static rendering if needed

export default async function Page() {
	// server action to login
	async function login({ emailAddress, password }: AuthReqPayload) {
		"use server";
		const auth = await fetchData<AuthResponsePayload>({
			apiUrl: API_URL + "/auth",
			method: "post",
			body: { emailAddress, password },
			tag: "auth",
		});

		return auth;
	}

	return (
		<Main>
			<Container>
				<LoginForm onSubmit={login} />
				<Everyone />
				<div className="credit-roll">
					<p>
						Xapien tech test for Lead Frontend Engineer position - by <b>Bruce Royce</b> - May/25
					</p>
					<p>find me here: bruceroyce@yahoo.com</p>
				</div>
			</Container>
		</Main>
	);
}
