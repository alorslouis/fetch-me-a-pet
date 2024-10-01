import { authLoginParser, dogBreedsParser, dogParser, dogSearchFetchParser, dogSearchParams, parseViewedKvMetadata } from '@typedef/apiTypes';
import { kvPathConstructor } from '@utils/kvPaths';
import { ActionError, defineAction } from 'astro:actions';
import { z } from "astro:schema"
import { fetchFetch } from '@utils/fetchFetch';

export const getDogs = {
	getDogs: defineAction({
		input: z.object({
			dogId: z.string().array(),
		}),
		handler: async (input, ctx) => {

			const { dogId } = input

			const getDog = await fetchFetch(ctx, {
				path: "/dogs",
				method: "POST",
				data: dogId,
			});

			if (!getDog.ok) throw new Error(`failed fetching dogs`);

			const dogs = dogParser.array().parse(await getDog.json());

			return { dogs }
		},
	}),
	getDogsFromSearch: defineAction({
		input: z.object({
			searchParams: dogSearchParams,
		}),
		handler: async (input, ctx) => {


			const { searchParams } = input


			const user = authLoginParser.safeParse(ctx.locals.userObject)

			if (!user.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User must be logged in.",
				})
			}


			const fetchList = await fetchFetch(ctx, {
				path: "/dogs/search",
				method: "GET",
				data: {
					...searchParams
				}
			})

			if (!fetchList.ok) {
				throw new ActionError({
					code: "BAD_REQUEST",
					message: "User must be logged in.",
				})
			}

			const f = await fetchList.json()


			const getSearchResults = dogSearchFetchParser.parse(f);
			const dogIds = getSearchResults.resultIds;
			const { next, total } = getSearchResults;
			//

			const getDog = await fetchFetch(ctx, {
				path: "/dogs",
				method: "POST",
				data: dogIds,
			});

			if (!getDog.ok) throw new Error(`failed fetching dogs`);

			const dogs = dogParser.array().parse(await getDog.json());

			return { dogs, total }

		}
	}),
	listViewed: defineAction({
		handler: async (_, ctx) => {

			const user = authLoginParser.safeParse(ctx.locals.userObject)

			if (!user.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User must be logged in.",
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const ky = kvPathConstructor("viewed", user.data)

			const getKvs = await kvBinding.list({
				prefix: ky
			})

			const kvMetadata = getKvs.keys.map(x => parseViewedKvMetadata.parse(x.metadata))

			return { kvMetadata }

		}
	}),
	getBreeds: defineAction({
		handler: async (_, ctx) => {

			const user = authLoginParser.safeParse(ctx.locals.userObject)

			if (!user.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User must be logged in.",
				})
			}

			const getBreeds = await fetchFetch(ctx, {
				path: "/dogs/breeds",
				method: "GET"
			})

			const breeds = dogBreedsParser.parse(await getBreeds.json())

			//console.log({ breeds })

			return { breeds }

		}
	}),
} 
