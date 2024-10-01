import { dogBreedsParser, dogSearchBody, dogSearchParams } from "@typedef/apiTypes"
import type { APIContext, AstroGlobal } from "astro"
import type { ActionAPIContext } from "astro:actions"
import { z } from "zod"

const pathChoices = z.enum(["/dogs", "/dogs/match", "/dogs/breeds", "/dogs/search", "/locations", "/locations/search", "/dogs/match"])
const methodChoices = z.enum(["POST", "GET"])


const myUnion = z.discriminatedUnion("path", [
	z.object({ path: z.literal(pathChoices.enum["/dogs"]), data: dogSearchBody, method: z.literal(methodChoices.enum.POST) }),
	z.object({ path: z.literal(pathChoices.enum["/dogs/breeds"]), method: z.literal(methodChoices.enum.GET) }),
	z.object({ path: z.literal(pathChoices.enum["/dogs/search"]), data: dogSearchParams.optional(), method: z.literal(methodChoices.enum.GET) }),
	z.object({ path: z.literal(pathChoices.enum["/locations"]), data: z.string().array(), method: z.literal(methodChoices.enum.POST) }),
	z.object({ path: z.literal(pathChoices.enum["/locations/search"]), data: z.string().array(), method: z.literal(methodChoices.enum.POST) }),
	z.object({ path: z.literal(pathChoices.enum["/dogs/match"]), data: dogBreedsParser, method: z.literal(methodChoices.enum.POST) }),
]);

type MyUnion = z.infer<typeof myUnion>

export const fetchFetch = async (context: AstroGlobal | APIContext | ActionAPIContext, props: MyUnion) => {

	const fetchUrl = new URL("https://frontend-take-home-service.fetch.com");

	fetchUrl.pathname = props.path

	const authCookie = context.cookies.get("fetch-access-token")?.value

	const fetchOptions: RequestInit = {
		method: props.method,
		headers: {
			"Content-Type": "application/json",
			Cookie: `fetch-access-token=${authCookie}`,
			"User-Agent":
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
		},
	};


	if ("data" in props && props.data && props.path === "/dogs") {
		fetchOptions.body = JSON.stringify(props.data);
	} else if ("data" in props && props.data && props.path === "/locations") {
		fetchOptions.body = JSON.stringify(props.data)
	} else if ("data" in props && props.data && props.path === "/dogs/match") {
		fetchOptions.body = JSON.stringify(props.data)
	} else if ("data" in props && props.data && props.path === "/dogs/search") {
		//console.log({ p: props.data })
		const { data } = props
		for (const [k, dataProps] of Object.entries(data)) {
			if (typeof dataProps === "number") {
				//console.log(k, dataProps)
				fetchUrl.searchParams.append(k, dataProps.toString())
			} else if (typeof dataProps === "string") {

				//console.log(k, dataProps)
				fetchUrl.searchParams.append(k, `${dataProps}`)
			} else {
				dataProps?.forEach((x, i) => {

					fetchUrl.searchParams.append(`${k}[${i}]`, x)
				}
				)
			}

		}
	}
	//console.log({ fetchHref: fetchUrl.href })
	return await fetch(fetchUrl.href, fetchOptions);
}
