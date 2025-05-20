import useStore from "@/store/useStore";

export default function useDrawer() {
	const { setDrawerChildren, setIsDrawerOpen, setDrawerTitle } = useStore();
	return ({ drawerTitle, drawerChild }: { drawerTitle: string; drawerChild: React.ReactNode }) => {
		setDrawerChildren(drawerChild);
		setDrawerTitle(drawerTitle);
		setIsDrawerOpen(true);
	};
}
