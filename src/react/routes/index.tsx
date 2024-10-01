import FavoriteDisplay from "@components/react/favorites/FavoriteDisplay"
import MatchesDisplay from "@components/react/matches/MatchesDisplay"
import { DogTable } from "@components/react/table/DogTable.tsx"
import ViewedDisplay from "@components/react/viewed/ViewedDisplay"
import { createFileRoute } from "@tanstack/react-router"
import { actions } from "astro:actions"

export const Route = createFileRoute("/")({
  component: Index,
})


function Index() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 container mx-2 md:mx-auto gap-6"
    >
      <div className="flex flex-col gap-2">
        <FavoriteDisplay />
        <MatchesDisplay />
        <ViewedDisplay />
      </div>
      <div className="flex flex-col gap-2 lg:col-span-2">
        <DogTable />
      </div>
    </div>
  )
}
