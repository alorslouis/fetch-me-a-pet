import { type Dog } from "@typedef/apiTypes";
import { map } from "nanostores";
import { searchTermsStore } from "./search";
import { actions } from "astro:actions";
import { searchExtras } from "./fetchExtras";

export const $fetchedDogs = map<Record<string, Dog | null>>({});

searchTermsStore.subscribe(async (change) => {
	const { data, error } = await actions.getDogs.getDogsFromSearch({
		searchParams: change
	})

	if (error) {
		console.error(error)
		return {}
	}

	if (data?.dogs) {
		$fetchedDogs.set(data.dogs.reduce((acc, dog) => {
			acc[dog.id] = dog;
			return acc;
		}, {} as Record<string, Dog>));
	}

	if (data?.total) {
		//console.log({ dataTotal: data.total })
		searchExtras.set({
			total: data.total,
		})
	} else {

		searchExtras.set({
			total: 0,
		})
	}
})
