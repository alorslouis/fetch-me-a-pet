import { authLoginParser, dogWithFavorite, matchParser } from '@typedef/apiTypes';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { kvPathConstructor } from '@utils/kvPaths';
import { listKvs } from './listFavoriteKVs';
import { nanoid } from 'nanoid';
import { $dogFavorites } from '@stores/favorites';
import { viewedDog } from './viewedDog';
import { $matches } from '@stores/matches';
import { getDogs } from './getDogs';
import { matches } from './matches';
import { geo } from './geoLocate';

export const server = {
	listKvs,
	viewedDog,
	getDogs,
	matches,
	geo,
	putFavoriteKVs: defineAction({
		input: z.object({
			dog: dogWithFavorite
		}),
		handler: async (input, ctx) => {
			const { dog } = input


			const { userObject } = ctx.locals


			const userParsed = await authLoginParser.spa(userObject)

			if (!userParsed.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: `User must be logged in. error: ${JSON.stringify(userParsed)}`,
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const ky = kvPathConstructor("fav", userParsed.data, dog.id)

			await kvBinding.put(ky, JSON.stringify(dog), {
				metadata: dog
			})


			return { userParsed, dog, ky }
		}
	}),
	deleteKV: defineAction({
		input: z.object({
			dogId: z.string()
		}),
		handler: async (input, ctx) => {
			const { dogId } = input


			const { userObject } = ctx.locals

			const userParsed = await authLoginParser.spa(userObject)

			if (!userParsed.success) {

				console.log(JSON.stringify({ userParsed }))
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: `User must be logged in. error: ${JSON.stringify(userParsed)}`,
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const ky = kvPathConstructor("fav", userParsed.data, dogId)

			await kvBinding.delete(ky)

			//return { userParsed, dog, ky }
		}
	}),
	putMatch: defineAction({
		input: z.object({
			matchInfo: matchParser
		}),
		handler: async (input, ctx) => {
			const { matchInfo } = input
			const { matchedDog, matchInputs } = matchInfo

			const { matchId } = matchedDog

			const { userObject } = ctx.locals

			const userParsed = await authLoginParser.spa(userObject)

			if (!userParsed.success) {

				console.log(JSON.stringify({ userParsed }))
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: `User must be logged in. error: ${JSON.stringify(userParsed)}`,
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites


			const ky = kvPathConstructor("match", userParsed.data, matchId)

			const prevKvsToDelete = matchInputs.map(x => {
				const kvPath = kvPathConstructor("fav", userParsed.data, x.id)
				return kvBinding.delete(kvPath)

			})


			// 1. stash the match info
			// 2. rm the previous favorites (they're now stored on the match KV)
			try {
				await Promise.all([kvBinding.put(ky, JSON.stringify(matchInfo), {
					metadata: matchedDog
				}),
				...prevKvsToDelete
				])
				$matches.setKey(matchId, matchInfo)

			} catch (error) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: `kv put/delete error: ${error}`,
				})

			}

			return { userParsed, matchId: matchedDog.matchId, ky }
		}
	}),
	listMatches: defineAction({
		handler: async (_, ctx) => {


			const { userObject } = ctx.locals

			const userParsed = await authLoginParser.spa(userObject)

			if (!userParsed.success) {

				console.log(JSON.stringify({ userParsed }))
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: `User must be logged in. error: ${JSON.stringify(userParsed)}`,
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const ky = kvPathConstructor("match", userParsed.data)

			const kvList = await kvBinding.list({
				prefix: ky
			})

			// TODO: parse this using the dogParser (!isFavorite needed)
			const kvMetadataParased = kvList.keys.map(kv => {

			})



			return { userParsed, kvMetadataParased, ky }
		}
	}),
}
