import { type DogWithFavorite } from "@typedef/apiTypes";
import { isServer } from "@utils/isServer";
import { actions } from "astro:actions";
import { map, onMount } from "nanostores";

export const $dogFavorites = map<Record<string, DogWithFavorite | null>>({});

if (!isServer) {
	onMount($dogFavorites, () => {
		const fetchFavoriteDogs = async () => {
			const { data, error } = await actions.listKvs.list()
			if (data?.kvMetadata) {
				data.kvMetadata.forEach(f => $dogFavorites.setKey(f.id, f))
			}
		};

		fetchFavoriteDogs();

		return () => {
		};
	});

	$dogFavorites.listen(async (newValue, _, changed) => {
		const changedValue = newValue[changed]

		if (changedValue) {
			const { data, error } = await actions.putFavoriteKVs({
				dog: {
					...changedValue
				}
			})
		} else {
			const { data, error } = await actions.deleteKV({
				dogId: changed
			})
		}

	})
} else {

}
