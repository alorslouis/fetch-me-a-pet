import { isServer } from "@utils/isServer";
import { actions } from "astro:actions";
import { atom, onMount } from "nanostores";

export const breedsStore = atom<string[] | null>(null);


if (!isServer) {
	onMount(breedsStore, () => {
		const fetchBreeds = async () => {
			const { data, error } = await actions.getDogs.getBreeds();

			if (error) return

			if (data?.breeds) {
				breedsStore.set(data.breeds);
			}
		};

		fetchBreeds();

		return () => {
		};
	});
}
