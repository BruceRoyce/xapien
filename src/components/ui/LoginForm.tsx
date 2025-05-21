"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthReqPayload, AuthResponsePayload } from "@/api/v1/auth/route";
import type { FetchReturnType } from "@/types";
import type { AccessLevel } from "@/store/authSlice";

import Button from "@/components/buttons/Button";
import FancyCard from "@/components/cards/FancyCard";
import Oops from "@/components/ui/oops";

import useStore from "@/store/useStore";
import useDrawer from "@/hooks/useDrawer";

//
const LoginForm = ({
	onSubmit,
}: {
	onSubmit: (args: AuthReqPayload) => Promise<FetchReturnType<AuthResponsePayload>>;
}) => {
	//
	const router = useRouter();
	const drawer = useDrawer();
	const [emailAddress, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { setUser, setIsAuthenticated, setPlanName, setAccount, setAccessLevel } = useStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const auth = await onSubmit({ emailAddress, password });
		// this is all unsafe, but we are using it for demo purposes
		try {
			if (!auth) {
				throw { title: "Failed to Login", message: "No response from server" };
			} else if ("error" in auth) {
				throw { title: auth?.code || "", message: "Failed to save users" };
			} else if ("user" in auth) {
				const accessLevel = auth.user.access_level as AccessLevel;
				setUser(auth.user);
				setIsAuthenticated(true);
				setPlanName(auth.planName);
				setAccount(auth.account);
				setAccessLevel(accessLevel);

				// super unsafe 😊, but we are merely using it for demo purposes
				// Never in real life situations
				router.push("/dashboard");
				return;
			}
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
	};

	return (
		<FancyCard>
			<h1>Login</h1>
			<form
				onSubmit={handleSubmit}
				style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 320 }}
			>
				<div className="form-row">
					<label>Email Address</label>
					<input
						type="email"
						value={emailAddress}
						onChange={(e) => setEmail(e.target.value)}
						required
						placeholder="Enter your email"
					/>
				</div>

				<div className="form-row">
					<label>
						Password <span className="small">(any password will work 😁)</span>
					</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						placeholder="Enter your password"
					/>
				</div>

				<div className="form-row center">
					<Button
						type="submit"
						label="Login"
						variant="primary"
						size="large"
					/>
				</div>
			</form>
		</FancyCard>
	);
};

export default LoginForm;
