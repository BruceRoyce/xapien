export type IconDefaultsT = (
	| {
			h?: number;
			w?: never;
	  }
	| {
			w?: number;
			h?: never;
	  }
) & { fill?: string; className?: string; stroke?: string };

const ICON_DEFAULTS: IconDefaultsT = {
	w: 24,
	className: "",
	fill: "currentColor",
};

export default ICON_DEFAULTS;
