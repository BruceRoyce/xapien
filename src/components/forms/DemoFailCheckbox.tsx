export default function DemoFailCheckbox({
	label = "Manually simulate a failure",
	onChange,
}: {
	label?: string;
	onChange: (state: boolean) => void;
}) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked);
	};

	return (
		<label
			className="fail"
			htmlFor="simulate-fail"
		>
			{label}:
			<input
				id="simulate-fail"
				type="checkbox"
				onChange={handleChange}
			></input>
		</label>
	);
}
