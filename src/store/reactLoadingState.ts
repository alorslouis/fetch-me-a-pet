import { isServer } from "@utils/isServer";
import { atom } from "nanostores";
import { searchTermsStore } from "./search";
import { $fetchedDogs } from "./fetchedDogs";

export const tableLoadingState = atom<boolean>(false);

// INFO: look...
// it does the job!
//
if (!isServer) {
	searchTermsStore.listen(change => {

		tableLoadingState.set(true)

		$fetchedDogs.listen(cx => {

			tableLoadingState.set(false)
		})
	})
}
