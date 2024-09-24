import { type DogWithFavorite } from "@typedef/apiTypes";
import { map } from "nanostores";

export const $dogFavorites = map<Record<string, DogWithFavorite | null>>({});

//async function InitDogFaveSub() {
//
//	$dogFavorites.subscribe(async (x) => {
//		const f = Object.values(x)[0]
//		console.log({ newValDogFave: f })
//		const user = userStore.get()
//
//		if (!user) return
//
//		if (f) {
//			const { data, error } = await actions.putFavoriteKVs({ user, dog: { ...f, isFavorite: true } })
//			console.log({ data, error, running: "put" })
//		} else {
//
//			const y = Object.keys(x)[0]
//			console.log({ newValDogKey: y })
//			const { data, error } = await actions.deleteKV({ user: user, dogId: y })
//			console.log({ data, error, running: "delete" })
//		}
//
//		console.log({ x })
//
//	}
//	)
//
//}
//await InitDogFaveSub()
