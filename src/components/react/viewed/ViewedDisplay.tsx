import { useStore } from "@nanostores/react"
import { $viewedDog } from "@stores/seenDog"
import ViewedDog from "./ViewedDog";

export default function ViewedDisplay() {

	const $viewed = useStore($viewedDog)
	const viewedDogs = Object.values($viewed)
		.filter((x) => x !== null).sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime());

	console.log({ $viewed })
	return (

		<div className="flex flex-col">
			<details>
				<summary className="text-start font-bold text-xl">
					recently viewed
				</summary>
				<div
					id="matchedDogsDisplay"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 my-4"
				>
					{
						viewedDogs?.map((dog) =>
							dog ? (
								<ViewedDog viewedDog={dog} key={dog.id} />
							) : null,
						)
					}
				</div>
			</details>
		</div>
	)
}
