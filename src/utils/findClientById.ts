import { type SuperUserAccountResponsePayload } from "@/app/api/v1/accounts/route";

export const findClientById = ({
	clients,
	accountId,
}: {
	clients: SuperUserAccountResponsePayload[];
	accountId: number;
}) => {
	if (!clients || !Array.isArray(clients) || clients.length === 0 || !accountId) {
		return null;
	}
	return clients.find((client) => client.account.id === accountId) || null;
};

export const findClientByEmail = ({
	clients,
	email,
}: {
	clients: SuperUserAccountResponsePayload[];
	email: string;
}) => {
	if (!clients || !Array.isArray(clients) || clients.length === 0 || !email) {
		return null;
	}
	return clients.find((client) => client.account.root_email_address === email) || null;
};
