"use client";
import Image from "next/image";
import cm from "@/utils/styleMixer";

import Input from "@/components/forms/Input";

export type UserCardProps = {
	emailAddress: string;
	credit: number;
	name?: string;
	notes?: string;
	id?: string;
	className?: string;
	tabIndex?: number;
	avatarUrl?: string;
	isInputBad?: boolean;
	onCreditChange: (credit: number) => void;
	isListOnly?: boolean;
};

export default function UserCard({
	id,
	emailAddress,
	credit,
	name,
	className = "",
	avatarUrl,
	tabIndex = 0,
	isInputBad = false,
	isListOnly = true,
	onCreditChange,
}: UserCardProps) {
	return (
		<div
			id={`id-${emailAddress}-${id}`}
			className={cm("row", "generic-row", className)}
		>
			<div className="generic-row-layout">
				<div className="generic-row-avatar">
					<Image
						src={avatarUrl || "/people/user.png"}
						alt="User Avatar"
						width={120}
						height={120}
					/>
				</div>
				<h3 className="generic-row-name">{name}</h3>
				<div className="generic-row-email">{emailAddress}</div>
				<div className="generic-row-credit">
					{isListOnly && <div>{credit}</div>}
					{!isListOnly && (
						<Input
							type="number"
							value={credit}
							placeholder="0"
							tabIndex={tabIndex}
							isBad={isInputBad}
							onChange={onCreditChange}
						/>
					)}
					<span>credits</span>
				</div>
			</div>
		</div>
	);
}
