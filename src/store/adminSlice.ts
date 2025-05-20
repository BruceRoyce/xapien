import { type StateCreator } from "zustand";

type SelectedClient = {
	id: number;
	name: string;
};

type SelectedPlan = {
	id: number;
	name: string;
	credits: number;
};

type AdminState = {
	selectedClient: SelectedClient | null;
	selectedPlan: SelectedPlan | null;
	isTopup: boolean;
};

type AdminActions = {
	setSelectedClient: (client: SelectedClient | null) => void;
	setSelectedPlan: (plan: SelectedPlan | null) => void;
	setIsTopup: (isTopup: boolean) => void;
	resetAdminState: () => void;
};

export type AdminSliceT = AdminState & AdminActions;

export const createAdminSlice: StateCreator<AdminSliceT> = (set) => ({
	selectedClient: null,
	selectedPlan: null,
	isTopup: false,
	setSelectedClient: (client) => set({ selectedClient: client }),
	setSelectedPlan: (plan) => set({ selectedPlan: plan }),
	setIsTopup: (isTopup) => set({ isTopup }),
	resetAdminState: () =>
		set({
			selectedClient: null,
			selectedPlan: null,
			isTopup: false,
		}),
});

export type { SelectedClient, SelectedPlan, AdminState, AdminActions };
