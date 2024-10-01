import { Link } from "@tanstack/react-router";
import type { Dog, UspsZipLookupParser } from "@typedef/apiTypes";
import FavoriteButton from "./favorites/FavoriteButton";

interface GenericDogViewProps {
	dog: Dog
	canFavorite?: boolean
	dogZipUsps?: UspsZipLookupParser
}

export default function GenericDogView({ dog, canFavorite, dogZipUsps }: GenericDogViewProps) {

	return (
		<div className="flex flex-col mx-auto">
			<div className="relative">
				<img src={dog.img} className={["rounded-lg object-fill size-96", `${dogZipUsps ? "!rounded-b-none" : ""}`].join(" ")} />
				<div className="flex text-xl font-bold  absolute top-0 left-0 p-4 z-10  bg-black/30 backdrop-blur-xl rounded-tl-lg rounded-br-lg items-center">
					<h3 className="">
						{dog.name}
					</h3>
				</div>
				{canFavorite ? (
					<div className="ml-auto absolute top-0 right-0">
						<FavoriteButton dog={dog} />
					</div>
				) : null}
				<div className={["flex flex-col w-full absolute bottom-0  bg-white/20 backdrop-blur-xl p-4 rounded-b-lg", `${dogZipUsps ? "!rounded-none" : ""}`].join(" ")}>
					<div className="justify-evenly w-full flex">
						<Link to="/dogs/breeds/$breed" params={{ breed: dog.breed }} className="italic">
							{dog.breed}
						</Link>
						<p className="after:content-['y.o.'] after:italic after:text-sm after:px-2">
							{dog.age}
						</p>
						{dogZipUsps ? null : (
							<p>
								{dog.zip_code}
							</p>

						)}

					</div>
				</div>
			</div>
			{dogZipUsps ? (
				<div className="justify-center w-full flex gap-2 py-2 border border-white/50 rounded-b-lg border-t-0">
					<p className="capitalize after:content-[',']">
						{dogZipUsps.defaultCity}
					</p>
					<p>
						{dogZipUsps.defaultState}
					</p>
					<p>
						{dogZipUsps.zip5}
					</p>
				</div>

			) : null}
		</div>
	)
}
