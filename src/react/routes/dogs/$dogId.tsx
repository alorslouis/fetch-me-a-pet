import GenericDogView from "@components/react/GenericDogView"
import { DogTable } from "@components/react/table/DogTable"
import { searchTermsStore } from "@stores/search"
import { createFileRoute, Link } from "@tanstack/react-router"
import type { UspsZipLookupParser } from "@typedef/apiTypes"
import { actions } from "astro:actions"

export const Route = createFileRoute("/dogs/$dogId")({
  onLeave: async () => {
    searchTermsStore.set({
      ...searchTermsStore.get(),
      breeds: []
    })
  },
  loader: async ({ params }) => {
    const getDog = await actions.getDogs.getDogs({ dogId: [params.dogId] })
    let dogZipInfo: UspsZipLookupParser | undefined = undefined

    if (getDog.data?.dogs) {
      searchTermsStore.set({
        ...searchTermsStore.get(), breeds: [getDog.data?.dogs[0].breed]
      })

      const { data, error } = await actions.geo.uspsZipLookup({ zip: getDog.data.dogs[0].zip_code })

      if (error) {
        console.error(error)
      }

      if (data) {
        dogZipInfo = data.uspsJson
      }
    }

    return { getDog, dogZipInfo }
  },
  component: () => {

    const { getDog, dogZipInfo } = Route.useLoaderData()

    if (getDog?.data) {
      const gotDog = getDog?.data?.dogs[0]


      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 container mx-auto gap-4">
          <GenericDogView dog={gotDog} canFavorite={true} dogZipUsps={dogZipInfo} />
          <DogTable
            lockedBreeds={[gotDog.breed]}
          />
        </div>

      )
    } else {
      return (
        <div className="flex flex-col items-center justify-center grow">
          <Link to="/" >
            dog not found
          </Link>
        </div>
      )
    }
  },
})
