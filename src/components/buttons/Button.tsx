import { memo, type ReactNode } from "react";
import styleMixer from "@/utils/styleMixer";

export type ButtonPrimaryProps = {
	id?: string;
	label: string;
	onClick?: () => void;
	child?: ReactNode;
	childrenPosition?: "left" | "right";
	variant?: "primary" | "secondary" | "cta" | "ghost" | "textual" | "danger";
	size?: "normal" | "large" | "small";
	isDisabled?: boolean;
	className?: string;
	type?: "button" | "submit" | "reset";
	ref?: React.Ref<HTMLButtonElement>;
	tabIndex?: number;
	"aria-label"?: string;
};
const ButtonBff = (p: ButtonPrimaryProps) => {
	const { ref } = p;
	const childrenPosition = p.childrenPosition || "left";
	const hasChild = p.child !== undefined;
	const classes = styleMixer("btn", {
		"btn-primary": p.variant === "primary" || !p.variant,
		"btn-secondary": p.variant === "secondary",
		"btn-large": p.size === "large",
		"btn-small": p.size === "small",
		"btn-ghost": p.variant === "ghost",
		"btn-danger": p.variant === "danger",
		"btn-textual": p.variant === "textual",
		"btn-cta": p.variant === "cta",
		"has-icon": hasChild,
		isDisabled: !!p.isDisabled,
		[p.className || ""]: true,
	});
	return (
		<button
			id={p.id || `btn-${p.label}-${p.variant || "primary"}`}
			ref={ref}
			className={classes}
			onClick={p.onClick}
			disabled={!!p.isDisabled}
			type={p.type || "button"}
			tabIndex={p.tabIndex || 0}
			aria-label={p["aria-label"] || p.label}
		>
			{hasChild && childrenPosition === "left" && <div className="btn-icon">{p.child}</div>}
			<div className="btn-label">
				<span dangerouslySetInnerHTML={{ __html: p.label }} />
			</div>
			{hasChild && childrenPosition === "right" && <div className="btn-icon">{p.child}</div>}
		</button>
	);
};

export default memo(ButtonBff);
