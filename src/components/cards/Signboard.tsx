import cm from "@/utils/styleMixer";
import Image from "next/image";

type SignboardProps = {
	title: string;
	className?: string;
	name?: string;
	imageUrl?: string;
	isUnsaved?: boolean;
	message?: string;
};

export default function Signboard({
	className = "",
	name = "",
	message,
	imageUrl = "/sings/ai_01.jpg",
	title,
	isUnsaved = false,
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
					<h2 className="signboard-name">{title}</h2>
					<div className="signboard-details">{name}</div>
					{message && <div className="signboard-message">{message}</div>}
					{isUnsaved && <div className="info">You got unsaved changes!</div>}
				</div>
			</div>
		</div>
	);
}
