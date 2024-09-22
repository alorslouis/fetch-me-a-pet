import type { APIContext, AstroGlobal } from "astro";
import { z } from "zod"

export const getCFLocationInfo = (context: AstroGlobal | APIContext) => {

	const parseString = z.string()
	const parseFloat = z.coerce.number()

	return {
		lat: parseFloat.parse(context.locals.runtime.cf?.latitude),
		long: parseFloat.parse(context.locals.runtime.cf?.longitude),
		city: parseString.parse(context.locals.runtime.cf?.city),
		state: parseString.parse(context.locals.runtime.cf?.regionCode),
		zip: parseString.parse(context.locals.runtime.cf?.postalCode),
	}
}
