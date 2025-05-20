"use client";
import cm from "@/utils/styleMixer";
import Button from "@/components/buttons/Button";
import Chip from "@/components/badges/Chip";
import Image from "next/image";

export type AccountRowCardProp = {
	accountId: number;
	emailAddress: string;
	name?: string;
	id?: string;
	className?: string;
	tabIndex?: number;
	logoUrl?: string;
	planName?: string;
	qtyUsers?: number;
	qtyRemainingCredit: number;
	onSelect?: (id: number) => void;
	isSelected?: boolean;
};

export default function AccountRowCard({
	id,
	accountId,
	emailAddress,
	name,
	className = "",
	logoUrl,
	tabIndex = 0,
	planName = "None",
	qtyRemainingCredit = 0,
	qtyUsers = 0,
	onSelect,
	isSelected = false,
}: AccountRowCardProp) {
	const handleSelect = () => {
		if (onSelect) {
			onSelect(accountId);
		}
	};

	return (
		<div
			id={id || `${accountId}`}
			className={cm("row", "generic-row", className, { selected: isSelected })}
			onClick={handleSelect}
		>
			<div className="account-row-layout ">
				<div className="generic-row-avatar">
					<Image
						src={logoUrl || "/images/placeholder.png"}
						alt="Account Logo"
						width={160}
						height={160}
						className="generic-row-avatar-image"
					/>
				</div>
				<h3 className="generic-row-name">{name}</h3>
				<div className="generic-row-email">{emailAddress}</div>

				<div className="account-row-credit">
					<Chip
						keyString="Plan"
						valueString={planName}
					/>
					<Chip
						keyString="Unused Credit"
						valueString={qtyRemainingCredit}
					/>
					<Chip
						keyString="No. of Users"
						valueString={qtyUsers}
					/>
				</div>
				{onSelect && (
					<div className="account-row-actions">
						<Button
							label="Select"
							size="normal"
							variant="ghost"
							tabIndex={tabIndex}
							onClick={handleSelect}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
