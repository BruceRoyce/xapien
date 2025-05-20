export default function DemoFailCheckbox({
	label = "Manually simulate a failure",
	onChange,
}: {
	label?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<label
			className="fail"
			htmlFor="simulate-fail"
		>
			{label}:
			<input
				id="simulate-fail"
				type="checkbox"
				onChange={(e) => onChange(e)}
			></input>
		</label>
	);
}
