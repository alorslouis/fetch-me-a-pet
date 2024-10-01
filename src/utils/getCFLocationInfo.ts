import { cloudflareGeoParser, } from "@typedef/apiTypes";
import type { APIContext, AstroGlobal } from "astro";
import type { ActionAPIContext } from "astro:actions";

export const getCFLocationInfo = (context: AstroGlobal | APIContext | ActionAPIContext) => {

	const cfGeoObject = cloudflareGeoParser.safeParse({
		lat: context.locals.runtime.cf?.latitude,
		long: context.locals.runtime.cf?.longitude,
		city: context.locals.runtime.cf?.city,
		state: context.locals.runtime.cf?.regionCode,
		zip: context.locals.runtime.cf?.postalCode,
	})


	return cfGeoObject?.data ?? null
}
