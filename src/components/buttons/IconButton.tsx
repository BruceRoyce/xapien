import { memo, type ReactNode } from "react";
import styleMixer from "@/utils/styleMixer";

export type ButtonPrimaryProps = {
	id?: string;
	onClick?: () => void;
	children: ReactNode;
	variant?: "primary" | "secondary" | "cta" | "ghost" | "textual";
	size?: "normal" | "large" | "small";
	isDisabled?: boolean;
	className?: string;
	type?: "button" | "submit" | "reset";
	ref?: React.Ref<HTMLButtonElement>;
	"data-testid"?: string;
};
const IconButtonBff = (p: ButtonPrimaryProps) => {
	const { ref } = p;
	const classes = styleMixer(
		{
			"btn-primary": p.variant === "primary" || !p.variant,
			"btn-secondary": p.variant === "secondary",
			"btn-large": p.size === "large",
			"btn-small": p.size === "small",
			"btn-ghost": p.variant === "ghost",
			"btn-textual": p.variant === "textual",
			"btn-cta": p.variant === "cta",
			isDisabled: !!p.isDisabled,
			[p.className || ""]: true,
		},
		"icon-button"
	);
	return (
		<button
			id={p.id || `icon-btn-${p.variant || "icon-btn-primary"}`}
			ref={ref}
			className={classes}
			onClick={p.onClick}
			disabled={!!p.isDisabled}
			type={p.type || "button"}
		>
			{p.children}
		</button>
	);
};

export default memo(IconButtonBff);
