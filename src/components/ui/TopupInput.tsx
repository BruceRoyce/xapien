"use client";
import Input from "@/components/forms/Input";

export default function TopupInput({
	topupCredits,
	onChange,
}: {
	topupCredits: number;
	onChange: (topupCredits: number) => void;
}) {
	function handleChange(requestedTopup: number) {
		onChange(requestedTopup);
	}

	return (
		<div className="topup-form">
			<form className="topup-form">
				<label htmlFor="requested-topup-credits">
					How many credits to top up? (Min. 1 - Max. 100)
				</label>
				<Input
					id="requested-topup-credits"
					type="number"
					value={topupCredits}
					onChange={handleChange}
				/>
			</form>
		</div>
	);
}
