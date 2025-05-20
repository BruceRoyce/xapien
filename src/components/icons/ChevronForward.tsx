import defs, { type IconDefaultsT } from "@/components/icons/defaults";
export default function ChevronForward(p: IconDefaultsT) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height={p.h || defs.h}
			viewBox="0 -960 960 960"
			width={p.w || defs.w}
			fill={p.fill || defs.fill}
		>
			<path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
		</svg>
	);
}
