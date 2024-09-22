
import { authLoginParser, formatAuthLoginParser } from '@typedef/apiTypes';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';




const kvTypePrefix = z.enum(["fav", "viewed"])

type KvTypePrefix = z.infer<typeof kvTypePrefix>

const kvPathConstructor = (typePrefix: KvTypePrefix, user: AuthLogin, dogId?: string) => {


	const userPrefix = formatAuthLoginParser.parse(user)


	const pathPrefix = `${typePrefix}:${userPrefix}:`

	if (dogId) {
		return `${pathPrefix}${z.string().parse(dogId)}`
	}

	return `${pathPrefix}`
}

export const server = {
	favoriteKVs: defineAction({
		input: z.object({
			action: z.enum(["list", "delete", "get", "put"]),
			dogId: z.string()
		}),
		handler: async (input, ctx) => {
			const { action, dogId } = input


			const userParsed = authLoginParser.safeParse(ctx.locals.userObject)

			if (!userParsed.success) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "User must be logged in.",
				})
			}

			const kvBinding = ctx.locals.runtime.env.fetchpet_favorites

			const ky = kvPathConstructor("fav", userParsed.data, dogId)

			//if (action === "put") {
			//	await kvBinding.put(ky, action)
			//} else if (action === "delete") {
			//	await kvBinding.delete(ky)
			//}


			return { userParsed, dogId, ky }
		}
	}),
}
