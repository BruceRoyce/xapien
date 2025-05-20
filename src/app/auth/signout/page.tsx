"use client";

import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import useStore from "@/store/useStore";

export default function SignOutPage() {
	const { signout, resetAdminState } = useStore();

	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			signout();
			resetAdminState();
		}
	}, [signout, resetAdminState, isAuthenticated]);

	return <div>Signing out...</div>;
}
