import { $dogFavorites } from "@stores/favorites";
import { $matches } from "@stores/matches";
import { useNavigate } from "@tanstack/react-router";
import type { DogWithFavorite } from "@typedef/apiTypes";
import { actions } from "astro:actions";
import { useState } from "react";

interface MatchGenProps {
	faveDogs: DogWithFavorite[]
	favesLength: number
}

export default function MatchGenerationButton({ favesLength, faveDogs }: MatchGenProps) {
	const navigate = useNavigate({ from: "/" });

	const [loadingMatch, setLoadingMatch] = useState(false)

	async function handleMatchGeneration() {
		const { data, error } = await actions.matches.generateMatch({ calledFromReact: true, optionalMatchObject: faveDogs });

		if (error) {
			console.error(error);
			return;
		}

		console.log({ data });
		const { matchObject } = data;

		const { matchInputs } = matchObject;

		const { matchId } = matchObject.matchedDog;
		matchInputs.forEach(faveDog => $dogFavorites.setKey(faveDog.id, null));

		$matches.setKey(matchId, matchObject);

		setLoadingMatch(false)
		console.log("navigating...");
		navigate({ to: "/matches/$matchId", params: { matchId } });
	}

	return (
		<button disabled={loadingMatch} onClick={async (event) => {
			event.preventDefault();
			setLoadingMatch(true)
			await handleMatchGeneration();
		}}
			className={["flex w-fit px-6 mx-auto text-center border rounded-lg justify-center py-4 transition-opacity opacity-30 ", `${favesLength > 0 ? "!opacity-100" : "pointer-events-none"}`, `${loadingMatch ? "animate-pulse pointer-events-none" : ""}`].join(" ")}
		>
			Generate Match
		</button>
	);
}
