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
		<form className="topup-form">
			<p>
				Here should be some sort of purchase / payyment flow, but for this test we are just going to
				add credits to the account.
				<br />
				You know Xapien credits (unlike Nectar points) are not free. Right!?
			</p>

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
	);
}
