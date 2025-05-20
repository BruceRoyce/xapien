"use client";
import { useRef, useEffect } from "react";
import useStore from "@/store/useStore";
import DrawerHeader from "./DrawerHeader";
import Close from "@/components/icons/Close";

const GeneralDrawer = () => {
	// console.log("Drawer is called");

	const dialogLocalRef = useRef<HTMLDialogElement>(null!);
	const abortControllerRef = useRef<AbortController>(null!);

	const { drawerCloseHandler, setDrawerRef, isDrawerOpen, drawerTitle, drawerChildren } =
		useStore();

	const handleClose = () => {
		if (drawerCloseHandler) {
			drawerCloseHandler();
		}
	};

	useEffect(() => {
		setDrawerRef(dialogLocalRef);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dialogLocalRef]);

	useEffect(() => {
		if (!isDrawerOpen && abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null!;
		}
	}, [isDrawerOpen]);

	return (
		<>
			<dialog
				id="general-drawer-01"
				className="drawer-general"
				ref={dialogLocalRef}
				onClose={handleClose}
				onCancel={handleClose}
				open={isDrawerOpen}
			>
				<div className="drawer-general-content-wrapper">
					<DrawerHeader />
					{drawerCloseHandler && (
						<div
							className="circle-icon-holder interactive absolute-right"
							onClick={handleClose}
						>
							<Close />
						</div>
					)}

					<div className="drawer-general-content">
						{drawerTitle && <div className="ttl my-2">{drawerTitle}</div>}

						<div
							id="general-drawer-children"
							className="general-drawer-children"
						>
							{drawerChildren}
						</div>
					</div>
				</div>
			</dialog>
		</>
	);
};

GeneralDrawer.displayName = "GeneralDrawer";

export default GeneralDrawer;
