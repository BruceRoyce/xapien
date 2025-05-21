"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { type User, FetchReturnType } from "@/types";
import type { UsersUpdateRequestPayload, UsersUpdateResponsePayload } from "@/api/v1/users/route";

import useDrawer from "@/hooks/useDrawer";
import { equaliseCredit } from "@/utils/credits";

import UserRow from "@/components/tables/UserRow";
import Button from "@/components/buttons/Button";
import RowTitle from "@/components/tables/RowTitle";
import RowAction from "@/components/tables/RowAction";
import RowTable from "@/components/tables/RowTable";
import Oops from "@/components/ui/oops";
import DemoFailCheckbox from "@/components/forms/DemoFailCheckbox";

type UsersTableProps = {
	users: User[];
	totalRemainingCredits: number;
	onSave: (u: UsersUpdateRequestPayload) => Promise<FetchReturnType<UsersUpdateResponsePayload>>;
	isListOnly?: boolean;
};

export default function UserTable({
	users,
	totalRemainingCredits,
	isListOnly = true,
	onSave,
}: UsersTableProps) {
	const drawer = useDrawer();
	const router = useRouter();

	const [fail, setFail] = useState(false);
	const [localUsers, setUsers] = useState(users);
	const [isNotSaved, setIsNotSaved] = useState(false);

	async function onSaveChanges() {
		const saved = await onSave({ users: localUsers, failCode: fail ? 500 : 0 });
		try {
			if (!saved) {
				throw { title: "Failed to save users", message: "No response from server" };
			} else if ("error" in saved) {
				throw { title: saved?.code || "", message: "Failed to save users" };
			} else if ("users" in saved) {
				setIsNotSaved(false);
				router.refresh();
			}
			return;
		} catch (err) {
			const errMsg = err as { title: string; message: string };
			drawer({
				drawerTitle: "Failed to save users",
				drawerChild: (
					<Oops
						title={errMsg.title}
						message={errMsg.message}
					/>
				),
			});
		}
	}

	function handleOnEquliseCredits() {
		const { creditsPerUser, newRemainingCredits } = equaliseCredit({
			totalRemainingCredits,
			totalUsers: users.length,
		});
		console.log("{ creditsPerUser, newRemainingCredits }", { creditsPerUser, newRemainingCredits });
		let changeFlag = false;
		setUsers((prevUsers) => {
			return prevUsers.map((user) => {
				if (user.credit !== creditsPerUser) changeFlag = true;
				return { ...user, credit: creditsPerUser };
				// if (index < newRemainingCredits) {
				// 	user.credit += 1;
				// }
			});
		});
		setIsNotSaved(changeFlag);
		// client.totalRemainingCredits - creditsPerUser * client.users.length - remainingCredits;
	}

	function handleRowCreditChange(userId: number) {
		return function onCreditChange(credit: number) {
			console.log("New credit", credit, "for user", userId);
			credit = Number(credit);
			if (isNaN(credit)) {
				credit = 0;
			}
			if (credit < 0) {
				credit = 0;
			}
			setUsers((prevUsers) => {
				return prevUsers.map((user) => {
					if (user.id === userId && user.credit !== credit) {
						setIsNotSaved(true);
						user.credit = credit;
					}
					return user;
				});
			});
		};
	}

	return (
		<>
			{isNotSaved && <div className="warning">⚠️ You got unsaved changes!</div>}
			<RowTable>
				<RowTitle title="Users" />
				{localUsers.map((user) => {
					return (
						<UserRow
							key={user.id}
							name={user.name || ""}
							emailAddress={user.email_address}
							credit={user.credit}
							tabIndex={user.id}
							avatarUrl={"/people/user.png"}
							onCreditChange={handleRowCreditChange(user.id)}
							isInputBad={false}
							isListOnly={isListOnly}
						/>
					);
				})}

				{!isListOnly && (
					<>
						<RowAction>
							<Button
								label="Distribute Credits Equally"
								size="large"
								variant="ghost"
								onClick={() => handleOnEquliseCredits()}
							/>
						</RowAction>
						<RowAction>
							<Button
								label="Save"
								size="large"
								variant="primary"
								onClick={onSaveChanges}
							/>
						</RowAction>
					</>
				)}
			</RowTable>
			<DemoFailCheckbox onChange={setFail} />
		</>
	);
}
