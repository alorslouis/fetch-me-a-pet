import MatchView from "@components/react/matches/MatchView"
import { $matches } from "@stores/matches"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { actions } from "astro:actions"

export const Route = createFileRoute("/matches/$matchId")({
  loader: async ({ params }) => {
    const matches = $matches.get()[params.matchId]

    if (matches) {
      const { data, error } = await actions.geo.uspsZipLookup({ zip: matches.matchedDog.zip_code })

      if (error) {
        console.error(error)
      }

      return data

    }
  },
  component: () => {
    const zipInfo = Route.useLoaderData()
    const { matchId } = Route.useParams()

    return <MatchView matchId={matchId} dogZipUsps={zipInfo?.uspsJson} />
  },
})

