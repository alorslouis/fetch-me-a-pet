import { useStore } from "@nanostores/react";
import { $dogFavorites } from "@stores/favorites";
import FavoriteDog from "./FavoriteDog";
import MatchGenerationButton from "./MatchGenerateButton";

export default function FavoriteDisplay() {

	const $favoriteDogs = useStore($dogFavorites)


	const faves = Object.values($favoriteDogs).filter(x => !!x)
	return (
		<div className="flex flex-col gap-2">
			<details open>
				<summary className="text-start font-bold text-xl">
					favorite dogs
				</summary>
				<div
					id="favoriteDogsDisplay"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 my-4"
				>
					{Object.values($favoriteDogs).filter(x => !!x).map(dog => {
						return <FavoriteDog favoriteDog={dog} key={dog.id} />
					})}
				</div>
				<MatchGenerationButton favesLength={faves?.length} faveDogs={faves} />
			</details>
		</div>
	)
}
