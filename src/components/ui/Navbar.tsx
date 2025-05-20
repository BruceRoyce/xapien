import ArrowBack from "@/components/icons/ArrowBackward";
import Logout from "../icons/Logout";
import Container from "../structure/Container";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="navbar">
			<Container className="nav-row between">
				<Link
					href="/dashboard"
					className="nav-row"
				>
					<ArrowBack fill="#bac1c9" /> Dashboard
				</Link>
				<Link
					href="/auth/signout"
					className="nav-row"
				>
					<div className="nav-row">
						Logout <Logout fill="#bac1c9" />
					</div>
				</Link>
			</Container>
		</nav>
	);
}
