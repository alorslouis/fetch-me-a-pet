import { z } from "zod"


export const dogParser = z.object({
	id: z.string(),
	img: z.string(),
	name: z.string(),
	age: z.number(),
	breed: z.string(),
	zip_code: z.string(),
})

export type Dog = z.infer<typeof dogParser>

export const dogWithFavorite = dogParser.extend({
	isFavorite: z.boolean()
})

export type DogWithFavorite = z.infer<typeof dogWithFavorite>

export const dogBreedsParser = z.string().array()

export type DogBreeds = z.infer<typeof dogBreedsParser>

export const sortDirection = z.enum(["asc", "desc"])

export type SortDir = z.infer<typeof sortDirection>

export const sortableSearchParams = z.object({
	breed: z.string(),
	name: z.string(),
	age: z.number(),
})

export const dogSearchParamsBase = z.object({
	breeds: z.string().array().optional(),
	zipCodes: z.string().array().optional(),
	ageMin: z.number().optional(),
	ageMax: z.number().optional(),
	size: z.number().optional(),
	from: z.number().optional(),
})

export const sortableSearchKeys = sortableSearchParams.keyof()

export type SortableSearchKeys = z.infer<typeof sortableSearchKeys>

export const sortSchema = z.custom<`${z.infer<typeof sortableSearchKeys>}:${z.infer<typeof sortDirection>}`>()

export const dogSearchParams = dogSearchParamsBase.extend({
	sort: sortSchema.optional()
})

export type DogSearchParams = z.infer<typeof dogSearchParams>

export const dogSearchBody = z.string().array()

export const dogSearchFetchParser = z.object({
	next: z.string(),
	resultIds: z.string().array(),
	total: z.number()
})

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

export const formatAuthLoginParser = authLoginParser.transform((data) => {
	return `name:${data.name}:email:${data.email}`;
});


export const authCookieParser = z.object({
	cookieName: z.string(),
	cookieValue: z.string(),
	expires: z.date().optional(),
	sameSite: z.union([z.boolean(), z.enum(["lax", "strict", "none"])]).optional(),
	path: z.string().optional(),
	httpOnly: z.boolean(),
	secure: z.boolean(),

})

export type AuthCookie = z.infer<typeof authCookieParser>
