import { Link } from "@tanstack/react-router";
import type { MatchKvMetadata } from "@typedef/apiTypes";
interface MatchedDogProps {
	matchedDog: MatchKvMetadata
}

export default function MatchedDog({ matchedDog }: MatchedDogProps) {

	const { img, matchId, name, breed, age, zip_code } = matchedDog;
	return (
		<div
			className="flex items-center gap-4 rounded-lg bg-white/10 backdrop-blur-2xl w-full animate-fadeIn hover:bg-white/20 transition-all duration-150"
		>
			<Link
				to="/matches/$matchId"
				params={{ matchId }}
				className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24"
			>
				<img
					src={img}
					alt={`picture of ${name}, a ${breed}`}
					height={100}
					width={100}
					className="rounded-l-lg w-full h-full object-cover"
				/>
			</Link>
			<Link
				to="/matches/$matchId"
				params={{ matchId }}
				className="grid grid-cols-2 gap-2 px-4 py-2 flex-grow items-center"
			>
				<p className="text-xl font-bold">
					{name}
				</p>
				<p className="font-semibold">
					{age}
					<span className="text-xs italic font-normal">y.o.</span>
				</p>
				<p className="italic text-sm">{breed}</p>
				<p className="text-sm">{zip_code}</p>
			</Link>
		</div>)
}
