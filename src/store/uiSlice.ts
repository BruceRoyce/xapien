import React from "react";
import { type StateCreator } from "zustand";
type CurrentDrawerNameT = "general" | null;
interface XapienUiSliceState {
	isMenuOpen: boolean;
	isDrawerOpen: boolean;
	currentDrawer: CurrentDrawerNameT;
	drawerRef: React.RefObject<HTMLDialogElement | null>;
	drawerChildren: React.ReactNode;
	drawerTitle: string;
	drawerCloseHandler?: () => void;
}

interface XapienUiSliceActions {
	setIsMenuOpen: (isMenuOpen: boolean) => void;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
	setCurrentDrawer: (currentDrawer: CurrentDrawerNameT) => void;
	toggleIsMenuOpen: () => void;
	toggleIsDrawerOpen: () => void;
	setDrawerRef: (drawerRef: React.RefObject<HTMLDialogElement>) => void;
	setDrawerChildren: (drawerChildren: React.ReactNode) => void;
	setDrawerTitle: (drawerTitle: string) => void;
	setDrawerCloseHandler?: (drawerCloseHandler: () => void) => void;
}

export type UiSliceT = XapienUiSliceState & XapienUiSliceActions;

export const createOSElementSlice: StateCreator<UiSliceT> = (set) => ({
	isMenuOpen: false,
	isDrawerOpen: false,
	currentDrawer: null,
	drawerRef: React.createRef<HTMLDialogElement>(),
	drawerChildren: null,
	drawerTitle: "",
	drawerCloseHandler: () => set({ isDrawerOpen: false }), // default drawer close handler
	setIsMenuOpen: (isMenuOpen: boolean) => set({ isMenuOpen }),
	setIsDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
	setCurrentDrawer: (currentDrawer: CurrentDrawerNameT) => set({ currentDrawer }),
	toggleIsMenuOpen: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
	toggleIsDrawerOpen: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
	setDrawerRef: (drawerRef: React.RefObject<HTMLDialogElement>) => set({ drawerRef }),
	setDrawerChildren: (children: React.ReactNode) => set({ drawerChildren: children }),
	setDrawerTitle: (drawerTitle: string) => set({ drawerTitle }),
	setDrawerCloseHandler: (drawerCloseHandler: () => void) => set({ drawerCloseHandler }),
});
