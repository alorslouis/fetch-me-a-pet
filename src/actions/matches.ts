import { authLoginParser, dogParser, dogWithFavorite, matchParser, type DogWithFavorite, type Match } from '@typedef/apiTypes';
import { ActionError, actions, defineAction } from 'astro:actions';
import { z } from "astro:schema"
import { fetchFetch } from '@utils/fetchFetch';
import { $dogFavorites } from '@stores/favorites';
import { nanoid } from 'nanoid';
import { kvPathConstructor } from '@utils/kvPaths';
import { $matches } from '@stores/matches';

export const matches = {
	generateMatch: defineAction({
		input: z.object({
			calledFromReact: z.boolean(),
			optionalMatchObject: dogWithFavorite.array().optional()
		}),
		handler: async (input, ctx) => {

			const { calledFromReact } = input

			const { userObject } = ctx.locals

			let favoriteDogs: DogWithFavorite[] = []
			let favoriteIds: string[] = []

			if (calledFromReact) {
				const { optionalMatchObject } = input


				if (!optionalMatchObject) {
					throw new ActionError({
						code: "UNPROCESSABLE_CONTENT",
						message: `no ids provided`,
					})
				}


				favoriteDogs = optionalMatchObject
				favoriteIds = favoriteDogs.map(dog => dog.id)

			} else {
				const favoritesFromState = $dogFavorites.get()

				favoriteDogs = Object.values(favoritesFromState).filter(x => !!x)
				favoriteIds = favoriteDogs.map(dog => dog.id)
			}

			const userParsed = await authLoginParser.spa(userObject)

			if (!userParsed.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: `User must be logged in. error: ${JSON.stringify(userParsed)}`,
				})
			}

			if (!favoriteIds.length) {
				throw new ActionError({
					code: "UNPROCESSABLE_CONTENT",
					message: `error processing favorite ids`,
				})

			}

			const generateMatch = await fetchFetch(ctx, {
				path: "/dogs/match",
				method: "POST",
				data: favoriteIds,
			});

			if (!generateMatch.ok) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `failed to generate match for ids: ${JSON.stringify(favoriteIds)}`,
				})
			}

			const matchedWith = await generateMatch.json();

			const parseMatch = z
				.object({
					match: z.string(),
				})
				.safeParse(matchedWith);

			if (!parseMatch.success) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `failed to generate match for ids: ${JSON.stringify(favoriteIds)}`,
				})
			}

			const { match } = parseMatch.data;

			const getDog = await fetchFetch(ctx, {
				path: "/dogs",
				method: "POST",
				data: [match],
			});

			if (!getDog.ok) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `getDog failed: ${JSON.stringify(getDog)}`,
				})
			}

			const getDogReturn = await getDog.json();

			console.log({ getDogReturn });

			const matchedDogReturnArray = dogParser.array().safeParse(getDogReturn);

			if (!matchedDogReturnArray.success || !matchedDogReturnArray?.data?.length) {
				console.log("matchedDog fail");
				console.log(JSON.stringify(matchedDogReturnArray.error));
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `failed to generate match for ids: ${JSON.stringify(favoriteIds)}`,
				})
			}

			const matchedDog = matchedDogReturnArray?.data[0]
			const matchId = nanoid();

			const matchObject: Match = {
				matchedDog: {
					...matchedDog,
					matchId
				},
				matchInputs: favoriteDogs
			}


			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const ky = kvPathConstructor("match", userParsed.data, matchId)

			return { matchObject }
		},
	}),
	putMatch: defineAction({
		input: z.object({
			match: matchParser,
		}),
		handler: async (input, ctx) => {

			const { userObject } = ctx.locals

			const { match } = input

			const userParsed = await authLoginParser.spa(userObject)

			if (!userParsed.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: `User must be logged in. error: ${JSON.stringify(userParsed)}`,
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const { matchedDog, matchInputs } = match

			const ky = kvPathConstructor("match", userParsed.data, matchedDog.matchId)


			const prevKvsToDelete = matchInputs.map(x => {
				const kvPath = kvPathConstructor("fav", userParsed.data, x.id)
				return kvBinding.delete(kvPath)

			})

			// 1. stash the match info
			// 2. rm the previous favorites (they're now stored on the match KV)
			try {
				await Promise.all([kvBinding.put(ky, JSON.stringify(match), {
					metadata: matchedDog
				}),
				...prevKvsToDelete
				])
				$matches.setKey(matchedDog.matchId, match)

			} catch (error) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `kv put/delete error: ${error}`,
				})

			}

			return { match }
		},
	}),
	listMatches: defineAction({
		handler: async (_, ctx) => {

			const { userObject } = ctx.locals

			const userParsed = await authLoginParser.spa(userObject)

			if (!userParsed.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: `User must be logged in. error: ${JSON.stringify(userParsed)}`,
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites


			const ky = kvPathConstructor("match", userParsed.data)

			const listMatches = await kvBinding.list({ prefix: ky })

			const toGet = listMatches.keys.map(key => kvBinding.get(key.name, "json"))

			const returnedKvs = await Promise.all(toGet)

			const returnedKvsParsed = returnedKvs.map(x => matchParser.parse(x))

			const returnAsMap = returnedKvsParsed.reduce((acc, match) => {
				acc[match.matchedDog.matchId] = match;
				return acc;
			}, {} as Record<string, Match>);


			return { matches: returnAsMap }
		},
	}),
} 
