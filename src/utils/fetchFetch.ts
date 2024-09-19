import { dogSearch } from "@typedef/apiTypes"
import { z } from "zod"

const pathChoices = z.enum(["/dogs", "/dogs/match", "/dogs/breeds", "/dogs/search"])

type PathChoices = z.infer<typeof pathChoices>

const fetchProps = z.union([dogSearch, dogSearch])

type FetchProps = z.infer<typeof fetchProps>

export const fetchFetch = async (path: PathChoices, fetchProps: FetchProps) => {

}
