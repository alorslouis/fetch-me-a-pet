import { defineMiddleware } from "astro:middleware";
import { userStore } from "src/store/user";
import { breedsStore } from "src/store/allBreeds";
import { $dogFavorites } from "@stores/favorites";
import { actions } from "astro:actions"
import { $viewedDog } from "@stores/seenDog";
import type { APIContext } from "astro";
import { $matches } from "@stores/matches";

export const onRequest = defineMiddleware(async (context, next) => {


	const { pathname } = context.url

	// INFO: handle for login routes and image files (sourced via _image path)
	if (pathname === "/login" || pathname.includes("_image")) {
		return next()
	}

	const fetchAccessToken = context.cookies?.get("fetch-access-token")

	if (fetchAccessToken) {
		context.locals.loggedIn = true

		const user = userStore.get();

		if (user) {
			context.locals.userObject = user
		} else {
			return context.redirect("/login")
		}

		const { breedsData, favoritesData, viewedData, matchesData } = await fetchLatestData(context)

		//console.log({ breedsData, favoritesData, viewedData })

		breedsStore.set(breedsData)
		$dogFavorites.set(favoritesData)
		$viewedDog.set(viewedData)
		$matches.set(matchesData)

	} else {
		context.locals.loggedIn = false
		return context.redirect("/login")
	}

	return next();
})


async function fetchLatestData(context: APIContext) {
	const breedsPromise = fetchBreeds(context)
	const favoritesPromise = fetchFavorites(context)
	const viewedPromise = fetchViewed(context)
	const matchesPromise = fetchMatches(context)

	const [breedsData, favoritesData, viewedData, matchesData] = await Promise.all([
		breedsPromise,
		favoritesPromise,
		viewedPromise,
		matchesPromise
	])

	return { breedsData, favoritesData, viewedData, matchesData }
}

async function fetchBreeds(context: APIContext) {
	const { data, error } = await context.callAction(actions.getDogs.getBreeds, {})

	if (error) {
		console.error(error)
		return null
	}

	return data.breeds
}

async function fetchFavorites(context: APIContext) {
	const { data, error } = await context.callAction(actions.listKvs.list, {})

	if (error) {
		console.error(error)
		return {}
	}

	return data ? Object.fromEntries(data.kvMetadata.map(f => [f.id, f])) : {}
}

async function fetchViewed(context: APIContext) {
	const { data, error } = await context.callAction(actions.viewedDog.listViewed, {})

	if (error) {
		console.error(error)
		return {}
	}

	return data ? Object.fromEntries(data.kvMetadata.map(f => [f.id, f])) : {}
}

async function fetchMatches(context: APIContext) {
	const { data, error } = await context.callAction(actions.matches.listMatches, {})

	if (error) {
		console.error(error)
		return {}
	}

	//console.log({ fetchMatchTestData: data })

	return data.matches ?? {}
}
