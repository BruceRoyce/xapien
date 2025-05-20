import type { User } from "@/types";

export function equaliseCredit({
	totalRemainingCredits,
	totalUsers,
}: {
	totalRemainingCredits: number;
	totalUsers: number;
}) {
	const creditsPerUser = Math.floor(totalRemainingCredits / totalUsers);
	const newRemainingCredits = totalRemainingCredits % totalUsers;

	return { creditsPerUser, newRemainingCredits };
}

//

export function checkTotalCredits({
	users,
	totalRemainingCredits,
}: {
	users: User[];
	totalRemainingCredits: number;
}) {
	const totalAllocatedCredits = users.reduce((acc, user) => acc + user.credit, 0);
	const diff = totalRemainingCredits - totalAllocatedCredits;

	console.log("** totalAllocatedCredits", totalAllocatedCredits);
	console.log("** totalRemainingCredits", totalRemainingCredits);
	console.log("** diff", diff);
	return { isExceeding: diff < 0, diff };
}
