import { cloudflareGeoParser, } from "@typedef/apiTypes";
import type { APIContext, AstroGlobal } from "astro";
import type { ActionAPIContext } from "astro:actions";
import { z } from "zod"

export const getCFLocationInfo = (context: AstroGlobal | APIContext | ActionAPIContext) => {

	const cfGeoObject = cloudflareGeoParser.safeParse({
		lat: context.locals.runtime.cf?.latitude,
		long: context.locals.runtime.cf?.longitude,
		city: context.locals.runtime.cf?.city,
		state: context.locals.runtime.cf?.regionCode,
		zip: context.locals.runtime.cf?.postalCode,
	})

	console.log(JSON.stringify(cfGeoObject))

	return cfGeoObject?.data ?? null
}
