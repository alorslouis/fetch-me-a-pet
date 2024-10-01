import type { DogWithFavorite } from "@typedef/apiTypes"
import FavoriteButton from "./FavoriteButton"
import { Link } from "@tanstack/react-router"

interface FavoriteDogProps {
	favoriteDog: DogWithFavorite
}

export default function FavoriteDog({ favoriteDog }: FavoriteDogProps) {

	const { id, name, age, img, breed, zip_code } = favoriteDog

	return (
		<div
			className="flex justify-stretch rounded-lg bg-white/10 backdrop-blur-2xl w-full items-center h-24 animate-fadeIn hover:scale-[1.03] transition-all duration-150"
		>
			<Link to="/dogs/$dogId" params={{ dogId: id }} className="h-full">
				<div className="h-full w-24">
					<img
						src={img}
						alt={`picture of ${name}, a ${breed}`}
						height={100}
						width={100}
						className="rounded-l-lg w-full h-full object-cover"
					/>
				</div>
			</Link >
			<Link to="/dogs/$dogId" params={{ dogId: id }}

				className="grid grid-cols-2 gap-2 px-4 py-2 flex-grow items-center"
			>
				<p className="text-xl font-bold">
					{name}
				</p>
				<p
					className="text-xl font-bold after:content-['y.o.'] after:text-xs after:italic after:font-thin after:px-1"
				>
					{age}
				</p>
				<p className="italic text-sm">{breed}</p>
				<p className="text-sm">{zip_code}</p>
			</Link >
			<FavoriteButton dog={favoriteDog} />
		</div>
	)
}
