import { authLoginParser, dogWithFavorite } from '@typedef/apiTypes';
import { kvPathConstructor } from '@utils/kvPaths';
import { ActionError, defineAction } from 'astro:actions';

export const listKvs = {
	list: defineAction({
		handler: async (_, ctx) => {

			const user = authLoginParser.safeParse(ctx.locals.userObject)

			if (!user.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User must be logged in.",
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const ky = kvPathConstructor("fav", user.data)

			const getKvs = await kvBinding.list({
				prefix: ky
			})

			const kvMetadata = getKvs.keys.map(x => dogWithFavorite.parse(x.metadata))

			return { kvMetadata }

		}
	}),
}
