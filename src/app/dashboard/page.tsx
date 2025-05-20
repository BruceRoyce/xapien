"use client";
import DashboardTable from "@/components/ui/DashboardTable";
import TablesGrid from "@/components/ui/TablesGrid";
import Main from "@/components/structure/Main";
import Container from "@/components/structure/Container";
import Signboard from "@/components/cards/Signboard";
import useAuth from "@/hooks/useAuth";

export type DashSection = { name: string; path?: string; level?: "super" | "admin" | "user" }[];
export type DashboardItems = {
	[key: string]: { level: string[]; title: string; sections: DashSection };
};

const getDashSections = ({ accountId }: { userId: string; accountId: string }): DashboardItems => ({
	clients: {
		level: ["super"],
		title: "Clients",
		sections: [
			{ name: "List of clients", path: "/accounts?list=true" },
			{ name: "Set a Plan for a client", path: "/accounts?target=setplans" },
			{ name: "Top up client's credit", path: "/accounts?target=topup" },
		],
	},

	users: {
		level: ["super", "admin"],
		title: "Users",
		sections: [
			{ name: "List of users", path: "/accounts?target=userslist", level: "super" },
			{ name: "List of users", path: `/users/${accountId}?list=true`, level: "admin" },
			{ name: "Set Users' Credit Limit", path: "/accounts?target=userscredit", level: "super" },
			{ name: "Set Users' Credit Limit", path: `/users/${accountId}`, level: "admin" },
			{ name: "See Reports", path: "/not-implemented" },
		],
	},
	plans: {
		level: ["super", "admin", "user"],
		title: "Plans",
		sections: [
			{ name: "Shop plans", path: "/plans?target=shopplans", level: "admin" },
			{ name: "See Clients on a plan", level: "super" },
			{ name: "Edit Plans", path: "/plans?list=true", level: "super" },
			{ name: "Plans", path: "/plans?list=true", level: "user" },
		],
	},
	queries: {
		level: ["super", "admin", "user"],
		title: "Queries",
		sections: [
			{ name: "Create a new query", path: "/not-implemented" },
			{ name: "History", path: "/not-implemented" },
		],
	},
});

export default function Page() {
	// check access level
	const { accessLevel, user, account } = useAuth();
	const dashSections = getDashSections({
		userId: `${user?.id}` || "",
		accountId: `${account?.id}` || "",
	});
	const allowedSections = Object.entries(dashSections).reduce((acc, [k, v]) => {
		if (v.level.includes(accessLevel)) {
			const allowedSections = v.sections.filter(
				(sec) => !("level" in sec) || ("level" in sec && sec.level === accessLevel)
			);
			return { ...acc, [k]: { ...v, sections: allowedSections } };
		}
		return acc;
	}, {} as DashboardItems);

	return (
		<Main>
			<Container>
				<Signboard
					title="Dashboard"
					name={user?.name ? `Hi, ${user.name}.` : `Hi!`}
				/>
				<TablesGrid>
					{Object.values(allowedSections).map((v) => {
						return (
							<DashboardTable
								key={v.title}
								sectionTitle={v.title}
								sections={v.sections}
							/>
						);
					})}
				</TablesGrid>
			</Container>
		</Main>
	);
}
