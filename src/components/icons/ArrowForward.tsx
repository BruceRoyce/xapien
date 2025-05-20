import defs, { type IconDefaultsT } from "@/components/icons/defaults";
export default function ArrowForward(p: IconDefaultsT) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height={p.h || defs.h}
			viewBox="0 -960 960 960"
			width={p.w || defs.w}
			fill={p.fill || defs.fill}
		>
			<path d="M665.08-450H180v-60h485.08L437.23-737.85 480-780l300 300-300 300-42.77-42.15L665.08-450Z" />
		</svg>
	);
}
