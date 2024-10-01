import { type Match } from "@typedef/apiTypes";
import { isServer } from "@utils/isServer";
import { map, onMount, onSet, onStart } from "nanostores";
import { actions } from "astro:actions"

export const $matches = map<Record<string, Match | null>>({});

if (!isServer) {
	onMount($matches, () => {
		const fetchMatches = async () => {
			const { data, error } = await actions.matches.listMatches();
			if (data) {
				$matches.set(data.matches);
			}
		};

		fetchMatches();

		//return () => {
		//};
	});

	$matches.listen(async (newVal, oldVal, change) => {
		console.log("running change allX")
		console.log({ newVal, oldVal, change })

		const changedVal = newVal[change]

		if (!changedVal) return

		const { data, error } = await actions.matches.putMatch({
			match: changedVal
		});

		if (error) console.error(error)
	})
}
