import { z } from "zod"

export const dogParser = z.object({
	id: z.string(),
	img: z.string(),
	name: z.string(),
	age: z.number(),
	zip_code: z.string(),
	breed: z.string(),
})

export type Dog = z.infer<typeof dogParser>

export const locationParser = z.object({
	zip_code: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	city: z.string(),
	state: z.string(),
	county: z.string(),
})

export type Location = z.infer<typeof locationParser>

export const coordinatesParser = z.object({
	lat: z.number(),
	lon: z.number(),
})

export type Coordinates = z.infer<typeof coordinatesParser>

export const authLoginParser = z.object({
	name: z.string(),
	email: z.string().email()
})

export type AuthLogin = z.infer<typeof authLoginParser>

export const authCookieParser = z.object({
	cookieName: z.string(),

})
