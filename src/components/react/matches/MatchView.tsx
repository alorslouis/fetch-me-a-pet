import { useStore } from "@nanostores/react"
import { $matches } from "@stores/matches"
import ViewedDog from "../viewed/ViewedDog"
import GenericDogView from "../GenericDogView"
import type { UspsZipLookupParser } from "@typedef/apiTypes"

interface MatchViewProps {
	matchId: string
	dogZipUsps?: UspsZipLookupParser
}

export default function MatchView({ matchId }: MatchViewProps) {

	const match = useStore($matches)

	const matchedDogObject = match[matchId]

	if (matchedDogObject) {
		const { matchedDog, matchInputs } = matchedDogObject
		return (
			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h2 className="text-xl font-bold my-2">
							matched with:
						</h2>
						<GenericDogView dog={matchedDog} />
					</div>
					<div className="flex flex-col gap-4">
						<h3 className="text-xl font-bold my-2">
							you favorited:
						</h3>

						<ul className="flex flex-col gap-2">
							{matchInputs.map(faveDog => {
								return (
									<li key={faveDog.id}>
										<ViewedDog viewedDog={{ ...faveDog, viewedAt: new Date(Date.now()) }} />
									</li>
								)
							})}
						</ul>

					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div>
				<h2>
					no match found!
				</h2>
			</div>
		)
	}

}
