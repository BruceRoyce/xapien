import { type StateCreator } from "zustand";
import type * as T from "@/types";

export type AccessLevel = "user" | "admin" | "superuser";
type XapAuthAccount = T.Account | Pick<T.Account, "id" | "name" | "image_url">;

interface XapienTestAuthSliceState {
	user: T.User | null;
	account: null | XapAuthAccount;
	isAuthenticated: boolean;
	planName: string;
	accessLevel: AccessLevel;
}

interface XapienTestAuthSliceActions {
	setUser: (u: T.User) => void;
	setIsAuthenticated: (state: boolean) => void;
	setPlanName: (name: string) => void;
	setAccount: (acc: XapAuthAccount) => void;
	setAccessLevel: (level: AccessLevel) => void;
	signout: () => void;
}

export type XapienTestAuthT = XapienTestAuthSliceState & XapienTestAuthSliceActions;

export const createAuthSlice: StateCreator<XapienTestAuthT> = (set) => ({
	user: null,
	account: null,
	planName: "",
	isAuthenticated: false,
	accessLevel: "user",
	setIsAuthenticated: (state: boolean) => set({ isAuthenticated: state }),
	setUser: (user: T.User) => set({ user }),
	setAccount: (account: XapAuthAccount) => set({ account }),
	setPlanName: (name: string) => set({ planName: name }),
	setAccessLevel: (accessLevel: AccessLevel) => set({ accessLevel }),
	signout: () => {
		set({
			user: null,
			account: null,
			isAuthenticated: false,
			planName: "",
			accessLevel: "user",
		});
	},
});
