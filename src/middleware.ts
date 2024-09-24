import { defineMiddleware } from "astro:middleware";
import { userStore } from "src/store/user";
import { breedsStore } from "src/store/allBreeds";
import { fetchFetch } from "./utils/fetchFetch";
import { dogBreedsParser } from "@typedef/apiTypes";
import { $dogFavorites } from "@stores/favorites";
import { actions } from "astro:actions"
import { $viewedDog } from "@stores/seenDog";

export const onRequest = defineMiddleware(async (context, next) => {

	if (context.url.pathname === "/login") {
		return next()
	}

	const fetchAccessToken = context.cookies?.get("fetch-access-token")

	if (fetchAccessToken) {
		context.locals.loggedIn = true

		const user = userStore.get();

		const breeds = breedsStore.get()
		const favorites = $dogFavorites.get()
		const viewed = $viewedDog.get()


		// INFO: get then ssr/client cache the breeds on init...
		// its ~static, so saves hitting constantly
		if (!breeds) {
			const getBreeds = await fetchFetch(context, {
				path: "/dogs/breeds",
				method: "GET"
			})

			const breeds = dogBreedsParser.parse(await getBreeds.json())

			console.log({ breeds })

			breedsStore.set(breeds)
		}

		// INFO: this gets insantiated in /login post route (SSR)
		// set in locals so we can access in /_actions easily
		// and handle for cookie is still active but nanostores cache is stale/wiped
		// neat solve for locals (is per-route)
		// but we'd go for a more roubst/secure solution for a *real* product (JWT, etc)
		if (user) {
			context.locals.userObject = user




			// INFO: hit KV for prev results
			// login clears local state

			if (Object.keys(favorites).length === 0) {
				console.log("no favorites!")
				const { data, error } = await context.callAction(actions.listKvs.list, {})

				if (error) console.error(error)

				if (data) {
					console.log("fetched favorites", { data })
					data.kvMetadata.forEach(f => $dogFavorites.setKey(f.id, f))
				} else {
					$dogFavorites.set({})
				}
			}

			if (Object.keys(viewed).length === 0) {
				console.log("no previously viewed!")
				const { data, error } = await context.callAction(actions.viewedDog.listViewed, {})

				if (error) console.error(error)

				if (data) {
					console.log("fetched favorites", { data })
					console.log({ viewedData: data })
					data.kvMetadata.forEach(f => $viewedDog.setKey(f.id, f))
				} else {
					$viewedDog.set({})
				}
			} else {
				console.log("no length on previously viewed!")
				console.log({ viewedKeys: Object.keys(viewed) })
			}

		} else {
			return context.redirect("/login")
		}

		console.log({ layoutUser: user });
	} else {
		context.locals.loggedIn = false
		return context.redirect("/login")
	}

	return next();
})

