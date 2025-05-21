import React from "react";
import { type StateCreator } from "zustand";
type CurrentDrawerNameT = "general" | null;
interface XapienUiSliceState {
	isDrawerOpen: boolean;
	currentDrawer: CurrentDrawerNameT;
	drawerRef: React.RefObject<HTMLDialogElement | null>;
	drawerChildren: React.ReactNode;
	drawerTitle: string;
	drawerCloseHandler?: () => void;
}

interface XapienUiSliceActions {
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
	setCurrentDrawer: (currentDrawer: CurrentDrawerNameT) => void;
	toggleIsDrawerOpen: () => void;
	setDrawerRef: (drawerRef: React.RefObject<HTMLDialogElement>) => void;
	setDrawerChildren: (drawerChildren: React.ReactNode) => void;
	setDrawerTitle: (drawerTitle: string) => void;
	setDrawerCloseHandler?: (drawerCloseHandler: () => void) => void;
}

export type UiSliceT = XapienUiSliceState & XapienUiSliceActions;

export const createOSElementSlice: StateCreator<UiSliceT> = (set) => ({
	isDrawerOpen: false,
	currentDrawer: null,
	drawerRef: React.createRef<HTMLDialogElement>(),
	drawerChildren: null,
	drawerTitle: "",
	drawerCloseHandler: () => set({ isDrawerOpen: false }), // default drawer close handler
	setIsDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
	setCurrentDrawer: (currentDrawer: CurrentDrawerNameT) => set({ currentDrawer }),
	toggleIsDrawerOpen: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
	setDrawerRef: (drawerRef: React.RefObject<HTMLDialogElement>) => set({ drawerRef }),
	setDrawerChildren: (children: React.ReactNode) => set({ drawerChildren: children }),
	setDrawerTitle: (drawerTitle: string) => set({ drawerTitle }),
	setDrawerCloseHandler: (drawerCloseHandler: () => void) => set({ drawerCloseHandler }),
});
