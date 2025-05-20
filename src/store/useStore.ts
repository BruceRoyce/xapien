import { create } from "zustand";
import { createOSElementSlice, UiSliceT } from "./uiSlice";
import { createAdminSlice, AdminSliceT } from "./adminSlice";
import { createAuthSlice, XapienTestAuthT } from "./authSlice";

export type RootStore = UiSliceT & AdminSliceT & XapienTestAuthT;

export const useStore = create<RootStore>()((...a) => ({
	...createOSElementSlice(...a),
	...createAdminSlice(...a),
	...createAuthSlice(...a),
}));

export default useStore;
