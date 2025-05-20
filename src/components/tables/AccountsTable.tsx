"use client";
import { type SuperUserAccountResponsePayload } from "@/app/api/v1/accounts/route";

import AccountRow from "@/components/tables/AccountRow";
import RowTitle from "@/components/tables/RowTitle";
import RowActions from "@/components//tables/RowAction";
import RowTable from "@/components/tables/RowTable";
import Button from "../buttons/Button";
import ArrowForward from "../icons/ArrowForward";

type AccountTableProps = {
	clients: SuperUserAccountResponsePayload[];
	tableTitle?: string;
	onSelectClient?: (accountId: number) => void;
	onCta?: () => void;
	selectedClientId?: number;
	ctaLabel?: string;
};

export default function AccountsTable(props: AccountTableProps) {
	const { clients, tableTitle, onSelectClient, selectedClientId, onCta, ctaLabel } = props;

	return (
		<RowTable>
			{tableTitle && <RowTitle title={tableTitle} />}
			{clients.map((client) => {
				const { account, users, planName, totalRemainingCredits } = client;
				return (
					<AccountRow
						key={account.id}
						accountId={account.id}
						name={account.name || ""}
						emailAddress={account.root_email_address}
						qtyRemainingCredit={totalRemainingCredits || 0}
						qtyUsers={users.length}
						planName={planName}
						tabIndex={account.id}
						logoUrl={account.image_url || ""}
						onSelect={onSelectClient}
						isSelected={selectedClientId === account.id}
					/>
				);
			})}
			{onCta && (
				<RowActions>
					<Button
						label={ctaLabel || "Next"}
						size="large"
						variant="primary"
						onClick={onCta}
						child={<ArrowForward />}
						childrenPosition="right"
					/>
				</RowActions>
			)}
		</RowTable>
	);
}
