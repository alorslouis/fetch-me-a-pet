import type { CloudflareGeo } from "@typedef/apiTypes";
import { isServer } from "@utils/isServer";
import { actions } from "astro:actions";
import { atom, onMount } from "nanostores";
import { searchTermsStore } from "./search";

export const geo = atom<CloudflareGeo | null>(null);

if (!isServer) {
	onMount(geo, () => {
		const getGeo = async () => {
			const { data, error } = await actions.geo.getLocationInfo();

			if (data?.location) {
				console.log({ dl: data.location })
				const { location } = data
				geo.set(location)
			}
		};

		getGeo();

		return () => {
		};
	});

	//
	//geo.listen(newVal => {
	//	const getSearchParams = searchTermsStore.get()
	//
	//	if (newVal?.zip) {
	//		searchTermsStore.set({
	//			...getSearchParams,
	//			zipCodes: [newVal?.zip]
	//		})
	//	}
	//
	//})
}

