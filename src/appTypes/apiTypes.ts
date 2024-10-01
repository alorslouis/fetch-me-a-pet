import { z } from "zod"

// base Dog interface returned from API
export const dogParser = z.object({
	id: z.string(),
	img: z.string(),
	name: z.string(),
	age: z.number(),
	breed: z.string(),
	zip_code: z.string(),
})

export type Dog = z.infer<typeof dogParser>

// extend with our isFavorite
export const dogWithFavorite = dogParser.extend({
	isFavorite: z.boolean()
})

export type DogWithFavorite = z.infer<typeof dogWithFavorite>

// coerce (form passes as string)
export const coercedDogWithFavorite = dogWithFavorite.extend({
	age: z.coerce.number(),
	isFavorite: z.preprocess((val) => val === 'true', z.boolean()).default(false)
})

export const dogSearchBody = z.string().array()

// API returns array of strings for search
export const dogBreedsParser = z.string().array()

export type DogBreeds = z.infer<typeof dogBreedsParser>

export const dogSearchFetchParser = z.object({
	next: z.string(),
	resultIds: dogBreedsParser,
	total: z.number()
})

export const searchExtras = z.object({
	total: z.number(),
	//cursor: z.number()
})

export type SearchExtras = z.infer<typeof searchExtras>

// match KV
// stored as stringified JSON

export const matchKvMetadata = dogParser.extend({
	matchId: z.string()
})

export type MatchKvMetadata = z.infer<typeof matchKvMetadata>;

export const matchParser = z.object({
	matchedDog: matchKvMetadata,
	matchInputs: dogParser.array()
})

export type Match = z.infer<typeof matchParser>;

export const viewedKvMetadata = dogParser.extend({
	viewedAt: z.date()
})

export type ViewedKvMetadata = z.infer<typeof viewedKvMetadata>;

export const parseViewedKvMetadata = dogParser.extend({
	viewedAt: z.coerce.date()
})
//
// helper for columns
// omitting id (!relevant for UX)
export const dogColumns = dogWithFavorite.omit({ id: true }).keyof();

export type DogColumns = z.infer<typeof dogColumns>;

export const dogSearchParamsBase = z.object({
	breeds: z.string().array().optional(),
	zipCodes: z.string().array().optional(),
	ageMin: z.number().optional(),
	ageMax: z.number().optional(),
	size: z.number().optional(),
	from: z.number().optional(),
})

export const sortableSearchParams = z.object({
	breed: z.string(),
	name: z.string(),
	age: z.number(),
})

// sort direction + term
// we submit as sep. form vals
// then construct using z.custom
export const sortDirection = z.enum(["asc", "desc"])

export type SortDir = z.infer<typeof sortDirection>

export const sortableSearchKeys = sortableSearchParams.keyof()

export type SortableSearchKeys = z.infer<typeof sortableSearchKeys>

// constructor for sortingBy
export const sortSchema = z.custom<`${z.infer<typeof sortableSearchKeys>}:${z.infer<typeof sortDirection>}`>()

// solve for edge case
// z.coerce.number() transforms "" to 0
// which is not what we want
const formNumberPipe = z.union([
	z.string().transform(val => val === "" ? undefined : Number(val)),
	z.number()
]).optional()

// coerce for form parsing
export const dogSearchParams = dogSearchParamsBase.extend({
	sort: sortSchema,
	lockedBreeds: dogBreedsParser.optional(),
	ageMin: formNumberPipe,
	ageMax: formNumberPipe,
	size: z.coerce.number().optional(),
})

export type DogSearchParams = z.infer<typeof dogSearchParams>

export const nextSearchParamParser = z.object({
	from: z.coerce.number().gte(0),
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

export const cloudflareGeoParser = z.object({
	lat: z.coerce.number(),
	long: z.coerce.number(),
	city: z.string(),
	state: z.string(),
	zip: z.string(),
})

export type CloudflareGeo = z.infer<typeof cloudflareGeoParser>

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

export const uspsZipLookupParser = z.object({
	resultStatus: z.string(),
	zip5: z.string(),
	defaultCity: z.string(),
	defaultState: z.string(),
	defaultRecordType: z.string(),
	citiesList: z.array(z.object({ city: z.string(), state: z.string() })),
	nonAcceptList: z.array(z.object({ city: z.string(), state: z.string() }))
})

export type UspsZipLookupParser = z.infer<typeof uspsZipLookupParser>
