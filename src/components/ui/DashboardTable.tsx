import { type DashSection } from "@/app/dashboard/page";
import DashRow from "@/components/tables/DashboardRow";
import RowTitle from "@/components/tables/RowTitle";
import ChevronForward from "@/components/icons/ChevronForward";
import Link from "next/link";

type DashSectionProp = { sectionTitle: string; sections: Omit<DashSection, "level"> };

export default function DashboardTable({ sectionTitle, sections }: DashSectionProp) {
	return (
		<div className="table-of-rows">
			<RowTitle title={sectionTitle} />
			{sections.map((sec, idx) => {
				const Row = () => {
					return (
						<DashRow
							className="interactive"
							name={sec.name}
							tabIndex={idx}
							icon={<ChevronForward />}
						/>
					);
				};

				if (sec.path) {
					return (
						<Link
							href={sec.path}
							key={sec.name}
						>
							<Row />
						</Link>
					);
				} else return <Row key={sec.name} />;
			})}
		</div>
	);
}
