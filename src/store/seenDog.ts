import { type Dog, type ViewedKvMetadata } from "@typedef/apiTypes";
import { isServer } from "@utils/isServer";
import { actions } from "astro:actions";
import { map, onMount } from "nanostores";

export const $viewedDog = map<Record<string, ViewedKvMetadata | null>>({});

if (!isServer) {
	onMount($viewedDog, () => {
		const fetchViewedDogs = async () => {
			const { data, error } = await actions.viewedDog.listViewed()
			if (data?.kvMetadata) {
				$viewedDog.set(
					data.kvMetadata.reduce((acc, f) => {
						acc[f.id] = f;
						return acc;
					}, {} as Record<string, ViewedKvMetadata>)
				);
			}
		};

		fetchViewedDogs();

		return () => {
		};
	});
	$viewedDog.listen(async (newValue, _, changed) => {
		const changedValue = newValue[changed]

		if (changedValue) {
			const { data, error } = await actions.viewedDog.putViewed({
				dog: {
					...changedValue
				}
			})
		}

	})
}
