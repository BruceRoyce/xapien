import useStore from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuth() {
	const router = useRouter();
	const { accessLevel, user, account, isAuthenticated, signout } = useStore();

	useEffect(() => {
		if (!isAuthenticated) {
			signout();
			router.push("/auth");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);
	return { accessLevel, user, account, isAuthenticated };
}
