import { dogSearchBody, dogSearchParams } from "@typedef/apiTypes"
import type { APIContext, AstroGlobal } from "astro"
import { z } from "zod"

const pathChoices = z.enum(["/dogs", "/dogs/match", "/dogs/breeds", "/dogs/search"])
const methodChoices = z.enum(["POST", "GET"])


const myUnion = z.discriminatedUnion("path", [
	z.object({ path: z.literal(pathChoices.enum["/dogs"]), data: dogSearchBody, method: z.literal(methodChoices.enum.POST) }),
	z.object({ path: z.literal(pathChoices.enum["/dogs/breeds"]), method: z.literal(methodChoices.enum.GET) }),
	//z.object({ path: z.literal(pathChoices.enum["/dogs/match"]), data: dogSearch }),
	z.object({ path: z.literal(pathChoices.enum["/dogs/search"]), data: dogSearchParams.optional(), method: z.literal(methodChoices.enum.GET) }),
]);

type MyUnion = z.infer<typeof myUnion>

export const fetchFetch = async (context: AstroGlobal | APIContext, props: MyUnion) => {

	const fetchUrl = new URL("https://frontend-take-home-service.fetch.com");

	fetchUrl.pathname = props.path

	const authCookie = context.cookies.get("fetch-access-token")?.value

	const fetchOptions: RequestInit = {
		method: props.method,
		headers: {
			"Content-Type": "application/json",
			Cookie: `fetch-access-token=${authCookie}`,
		},
		credentials: "include",

	};


	if ("data" in props && props.data && props.path === "/dogs") {
		fetchOptions.body = JSON.stringify(props.data);
	}

	if ("data" in props && props.data && props.path === "/dogs/search") {
		//console.log({ p: props.data })
		const { data } = props
		for (const [k, dataProps] of Object.entries(data)) {
			if (typeof dataProps === "number") {
				console.log(k, dataProps)
				fetchUrl.searchParams.set(k, dataProps.toString())
			} else if (typeof dataProps === "string") {

				console.log(k, dataProps)
				fetchUrl.searchParams.set(k, `${dataProps}`)
			} else {
				dataProps.forEach(x => {

					console.log(k, dataProps)
					fetchUrl.searchParams.set(k, x)
				}
				)
			}

			//console.log({ k, dataProps })
		}
	}
	console.log({ fetchHref: fetchUrl.href })
	return await fetch(fetchUrl.href, fetchOptions);
}
