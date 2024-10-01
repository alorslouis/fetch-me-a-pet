import { useStore } from "@nanostores/react"
import { $matches } from "@stores/matches"
import MatchedDog from "./MatchedDog";

export default function MatchesDisplay() {

	const $dogMatches = useStore($matches)

	const matchedDogs = Object.values($dogMatches);

	//console.log({ matchedDogs })

	return (
		<div className="flex flex-col gap-2">
			<details open={matchedDogs?.length ? true : false}>
				<summary className="text-start font-bold text-xl">
					my matches
				</summary>
				<div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 my-4"
				>
					{
						matchedDogs?.map((dog) =>
							dog ? (
								<MatchedDog
									key={dog.matchedDog.matchId}
									matchedDog={
										dog.matchedDog
									}
								/>
							) : null,
						)
					}
				</div>
			</details>
		</div>
	)
}
