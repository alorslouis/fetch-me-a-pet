import { useStore } from "@nanostores/react";
import { $viewedDog } from "@stores/seenDog";
import type { Dog } from "@typedef/apiTypes";
import { useEffect } from "react";

interface DogViewProps {
	dog: Dog
}


export default function DogView({ dog }: DogViewProps) {
	const $viewedDogs = useStore($viewedDog);

	useEffect(() => {
		const previouslyViewed = $viewedDogs[dog.id];

		if (!previouslyViewed) {
			console.log("!prevViewed");
			$viewedDog.setKey(dog.id, { ...dog, viewedAt: new Date(Date.now()) });
		}
	}, []);

	return (
		<div>
			{dog.name}
		</div>
	)
}
