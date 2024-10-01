import { authLoginParser, dogParser, dogWithFavorite, parseViewedKvMetadata, viewedKvMetadata, type ViewedKvMetadata } from '@typedef/apiTypes';
import { kvPathConstructor } from '@utils/kvPaths';
import { ActionError, defineAction } from 'astro:actions';
import { z } from "astro:schema"
import { $viewedDog } from "@stores/seenDog"

export const viewedDog = {
	putViewed: defineAction({
		input: z.object({
			dog: dogParser,
		}),
		handler: async (input, ctx) => {

			const { dog } = input

			const user = authLoginParser.safeParse(ctx.locals.userObject)

			if (!user.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User must be logged in.",
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const ky = kvPathConstructor("viewed", user.data, dog.id)

			// 7 days autoexpire (seconds from now)
			const expiresIn = 604_800

			const kvMetadata: ViewedKvMetadata = {
				...dog,
				viewedAt: new Date(Date.now())
			}

			await kvBinding.put(ky, JSON.stringify(dog), {
				metadata: kvMetadata,
				expirationTtl: expiresIn
			})

			const dateNow = new Date(Date.now())

			console.log({ dateNow })
			$viewedDog.setKey(dog.id, { ...dog, viewedAt: dateNow })
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
}
