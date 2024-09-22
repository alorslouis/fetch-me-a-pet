import { defineMiddleware } from "astro:middleware";
import { userStore } from "src/store/user";
import { breedsStore } from "src/store/allBreeds";
import { fetchFetch } from "./utils/fetchFetch";
import { dogBreedsParser } from "@typedef/apiTypes";

export const onRequest = defineMiddleware(async (context, next) => {

	if (context.url.pathname === "/login") {
		return next()
	}

	const fetchAccessToken = context.cookies?.get("fetch-access-token")

	if (fetchAccessToken) {
		context.locals.loggedIn = true

		const user = userStore.get();

		const breeds = breedsStore.get()

		// INFO: get then cache the breeds on init...
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
		if (user) {
			context.locals.userObject = user
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

