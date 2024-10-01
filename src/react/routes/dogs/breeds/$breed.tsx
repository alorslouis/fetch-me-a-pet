import { DogTable } from "@components/react/table/DogTable"
import { searchTermsStore } from "@stores/search"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dogs/breeds/$breed")({
  component: () => <Breed />,
  beforeLoad: ({ params }) => {
    searchTermsStore.set({
      ...searchTermsStore.get(), breeds: [params.breed]
    })

  },
  onLeave: () => {
    searchTermsStore.set({
      ...searchTermsStore.get(), breeds: undefined
    })
  }
})

function Breed() {
  const breed = Route.useParams()

  return (
    <DogTable lockedBreeds={[breed.breed]} />
  )
}
