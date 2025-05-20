import cm from "@/utils/styleMixer";
import Image from "next/image";
import Chip from "@/components/badges/Chip";

type SignboardProps = {
	className?: string;
	name: string;
	imageUrl?: string;
	credit?: {
		remaining: number;
		allocated: number;
		unallocated: number;
	};
	planName?: string;
	isNotSaved?: boolean;
};

export default function AccountSignboard({
	className = "",
	name,
	imageUrl,
	credit,
	planName,
	isNotSaved = false,
}: SignboardProps) {
	return (
		<div className={cm("card", "signboard", className)}>
			<div className="signboard-layout">
				<div className="signboard-logo">
					{imageUrl && (
						<Image
							src={imageUrl}
							alt={`${name}'s logo`}
							width={160}
							height={160}
							loading="lazy"
							className="signboard-image"
						/>
					)}
				</div>
				<div className="signboard-content">
					<h2 className="signboard-name">{name}</h2>
					<div className="signboard-details">
						{planName && (
							<div className="flex-row">
								<span className="key">Plan:</span>
								<span className="value">{planName}</span>
							</div>
						)}

						{credit && (
							<>
								<div className="flex-row">
									<span className="key">Remaining Credits:</span>
									<span className="value">{credit.remaining}</span>
								</div>

								<div className="flex-row">
									<Chip
										keyString="allocated"
										valueString={credit.allocated}
									/>
									<Chip
										keyString="unallocated"
										valueString={credit.unallocated}
										variant="secondary"
									/>
								</div>
							</>
						)}
					</div>
					{isNotSaved && <div className="warning">You got unsaved changes!</div>}
				</div>
			</div>
		</div>
	);
}
