import type { DogSearchParams } from "@typedef/apiTypes";
import { actions } from "astro:actions";
import { atom } from "nanostores";
import { geo } from "./geoLocate";

const userGeo = geo.get()?.zip

//console.log({ userGeo })

export const searchTermsStore = atom<DogSearchParams>({
	sort: "breed:asc",
	size: 25,
	from: 0,
});

