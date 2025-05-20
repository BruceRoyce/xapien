import defs, { type IconDefaultsT } from "@/components/icons/defaults";
export default function Close(p: IconDefaultsT) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height={p.h || defs.h}
			viewBox="0 -960 960 960"
			width={p.w || defs.w}
			fill={p.fill || defs.fill}
		>
			<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
		</svg>
	);
}
