import defs, { type IconDefaultsT } from "@/components/icons/defaults";
export default function ArrowBackward(p: IconDefaultsT) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height={p.h || defs.h}
			viewBox="0 -960 960 960"
			width={p.w || defs.w}
			fill={p.fill || defs.fill}
		>
			<path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
		</svg>
	);
}
