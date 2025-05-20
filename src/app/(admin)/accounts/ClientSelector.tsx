"use client";
import { type SuperUserAccountResponsePayload } from "@/app/api/v1/accounts/route";
import AccountsTable from "@/components/tables/AccountsTable";
import useStore from "@/store/useStore";
import InfoCard from "@/components/cards/InfoCard";
import { findClientById } from "@/utils/findClientById";
import { useRouter } from "next/navigation";
import useDrawer from "@/hooks/useDrawer";
import Oops from "@/components/ui/oops";
import { useEffect } from "react";

type AccountSelectorProps = {
	clients: SuperUserAccountResponsePayload[];
	selectorTarget?: string;
};

export default function AccountsSelector({ clients, selectorTarget }: AccountSelectorProps) {
	const handleDrawer = useDrawer();
	const router = useRouter();
	const { setIsTopup, setSelectedClient, setSelectedPlan, selectedClient } = useStore();

	function handleSelectClient(accountId: number) {
		const clinet = findClientById({ clients, accountId });
		const clientName = clinet?.account.name || "";
		setSelectedClient({ id: accountId, name: clientName });
	}

	let ctaLabel = "Next";
	let ctaTarget = "/plans";

	switch (selectorTarget) {
		case "userslist":
			ctaLabel = "Next to <b>List of Users</b>";
			ctaTarget = `/users/${selectedClient?.id}?list=true`;
			break;

		case "userscredit":
			ctaLabel = "Next to <b>Users Credit</b>";
			ctaTarget = `/users/${selectedClient?.id}`;
			break;

		case "topup":
			ctaLabel = "Next to <b>Topup</b>";
			ctaTarget = `/set-plan`;
			break;
		case "setplans":
		default:
			ctaLabel = "Next to <b>Select Plan</b>";
			ctaTarget = "/plans";
			break;
	}

	useEffect(() => {
		if (selectorTarget === "topup") {
			setIsTopup(true);
			setSelectedPlan({ id: 6, name: "Top-up", credits: 1 });
		}
	}, [selectorTarget, setSelectedPlan, setIsTopup]);

	function handleNext() {
		console.log("handleNext called");
		console.log("Selected client", selectedClient);
		if (!selectedClient) {
			handleDrawer({
				drawerChild: (
					<Oops title="You are too early">
						<p>
							Please <b>select a client first</b> and then click next!
						</p>
					</Oops>
				),
				drawerTitle: "Client is not selected",
			});
			return;
		}
		router.push(ctaTarget);
	}

	return (
		<>
			<InfoCard info="Select a client and click next" />
			<AccountsTable
				clients={clients}
				onSelectClient={handleSelectClient}
				onCta={handleNext}
				tableTitle="Clients"
				ctaLabel={ctaLabel}
				selectedClientId={selectedClient?.id || -1}
			/>
		</>
	);
}
