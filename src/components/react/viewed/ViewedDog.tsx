import { Link } from "@tanstack/react-router";
import type { ViewedKvMetadata } from "@typedef/apiTypes";

interface ViewedDogProps {
	viewedDog: ViewedKvMetadata;
}
export default function ViewedDog({ viewedDog }: ViewedDogProps) {
	const { img, name, breed, age, zip_code, id } = viewedDog;


	return (
		<div
			className="flex justify-stretch rounded-lg bg-white/10 backdrop-blur-2xl w-full items-center h-24 animate-fadeIn hover:scale-[1.03] transition-all duration-150"
		>
			<Link
				to="/dogs/$dogId"
				params={{ dogId: id }}
				className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24">
				<img
					src={img}
					alt={`picture of ${name}, a ${breed}`}
					height={100}
					width={100}
					className="rounded-l-lg w-full h-full object-cover"
				/>
			</Link>
			<Link
				to="/dogs/$dogId"
				params={{ dogId: id }}
				className="grid grid-cols-2 gap-2 px-4 py-2 flex-grow items-center"
			>
				<p className="text-xl font-bold">
					{name}
				</p>
				<p className="font-semibold">
					{age}
					<span className="text-xs italic font-normal">y.o.</span>
				</p>
				<p className="italic text-sm">{breed}</p>
				<p className="text-sm">{zip_code}</p>
			</Link>
		</div>)
}
