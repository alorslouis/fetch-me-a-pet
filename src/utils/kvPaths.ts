import { formatAuthLoginParser } from "@typedef/apiTypes"
import { z } from "zod"

const kvTypePrefix = z.enum(["fav", "viewed", "match"])

type KvTypePrefix = z.infer<typeof kvTypePrefix>

export const kvPathConstructor = (typePrefix: KvTypePrefix, user: AuthLogin, id?: string) => {

	const userPrefix = formatAuthLoginParser.parse(user)

	const pathPrefix = `${typePrefix}:${userPrefix}:`

	if (id) {
		return `${pathPrefix}${z.string().parse(id)}`
	}

	return `${pathPrefix}`
}
