import cm from "@/utils/styleMixer";
type ChipProps = {
	keyString: string;
	valueString: string | number;
	variant?: "primary" | "secondary";
};

export default function Chip({ keyString, valueString, variant }: ChipProps) {
	return (
		<div className={cm("badge-chip", variant || "primary")}>
			<span className="key-string">{keyString}:</span>
			<span className="value-string">{valueString}</span>
		</div>
	);
}
