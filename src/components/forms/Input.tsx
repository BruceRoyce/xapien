import cm from "@/utils/styleMixer";
type InputProps = {
	type?: "number" | "text" | "email" | "password";
	placeholder?: string;
	defaultValue?: string | number;
	value?: string | number;
	className?: string;
	tabIndex?: number;
	id?: string;
	isBad?: boolean;
	onChange?: (credit: number) => void;
};

export default function Input({
	type = "number",
	placeholder = "0",
	defaultValue,
	value,
	onChange,
	className = "",
	tabIndex = 0,
	id,
	isBad = false,
}: InputProps) {
	const handleCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			const newCredit = e.target.value;
			onChange(Number(newCredit));
		}
	};

	return (
		<input
			id={id}
			className={cm({ bad: isBad }, className)}
			type={type}
			defaultValue={defaultValue}
			value={value}
			placeholder={placeholder}
			min="0"
			step="1"
			tabIndex={tabIndex}
			onChange={handleCreditChange}
		/>
	);
}
