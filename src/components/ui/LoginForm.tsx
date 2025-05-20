"use client";
import { useState } from "react";
import type { AuthReqPayload, AuthResponsePayload } from "@/api/v1/auth/route";
import type { FetchReturnType } from "@/types";
import type { AccessLevel } from "@/store/authSlice";

import Button from "@/components/buttons/Button";
import FancyCard from "@/components/cards/FancyCard";

import useStore from "@/store/useStore";
import useDrawer from "@/hooks/useDrawer";

import { useRouter } from "next/navigation";

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
		console.log("+*+ auth", auth);
		if (!auth) {
			drawer({
				drawerTitle: "Login Failed",
				drawerChild: <div>Invalid email or password</div>,
			});
			return;
		} else if ("error" in auth) {
			drawer({
				drawerTitle: "Failed to save users",
				drawerChild: <div>{auth?.code || ""}</div>,
			});
			return;
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
