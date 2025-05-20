import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/css/global.css";
import GeneralDrawer from "@/components/drawers/GeneralDrawer";
import Navbar from "@/components/ui/Navbar";

//

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Xapien Tech Challenge - Lead FE Position",
	description: "By Bruce Royce",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} main-layout`}>
				<Navbar />
				<div className="main-content">
					{children}
					<aside>
						<GeneralDrawer />
					</aside>
				</div>
			</body>
		</html>
	);
}
