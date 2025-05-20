"use client";
import fetchData from "@/utils/fetchData";
import { NEXT_PUBLIC_API_URL as API_URL } from "@/../env";

import type { SuperUserAccountResponsePayload } from "@/api/v1/accounts/route";
import type { User } from "@/types/";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

// const getData = a()=> await fetchData<SuperUserAccountResponsePayload[]>({
// 	apiUrl: `${API_URL}/accounts`,
// 	method: "patch",
// 	tag: "accountData",
// });
export default function Everyone() {
	const [isLoading, setIsLoading] = useState(true);
	const [clients, setClients] = useState<SuperUserAccountResponsePayload[]>([]);

	useEffect(() => {
		const fetchClientData = async () => {
			const data = await fetchData<SuperUserAccountResponsePayload[]>({
				apiUrl: `${API_URL}/accounts`,
				method: "patch",
				body: {},
				tag: "accountData",
			});
			if (!data || "error" in data) {
				setIsLoading(false);
				return;
			}
			setClients(data);
			setIsLoading(false);
		};

		fetchClientData();
	}, []);

	if (isLoading) {
		return <div className="everyone">Loading...</div>;
	}
	return (
		<div className="everyone">
			<h1>List of all demo clients</h1>
			<p>To examine the demo, please feel free to pick any of the email addresses.</p>
			<p>
				Try different access levels. <b>Super</b> is the Xapien super user, who can add credits,
				plans, etc. <b>Admin</b> can do the same only within its own company account. <b>Users</b>
				can only create query and spend credits.
			</p>

			<p>
				Start with <b>super@xapien.com</b> email address (and any password!). Assign some credits.
			</p>
			{clients.map((client) => (
				<div key={client.account.id}>
					<h2># {client.account.name}</h2>
					<p>Plan: {client.planName}</p>

					<h3>Users:</h3>
					<ul>
						{client.users.map((user: User) => (
							<li key={user.id}>
								{user.email_address} ({user.name}) - {user.access_level}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
