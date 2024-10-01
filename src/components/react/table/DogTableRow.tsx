import type { Dog, DogColumns } from "@typedef/apiTypes"
import { Link } from '@tanstack/react-router'
import type { ReactNode } from "react";
import FavoriteButton from "../favorites/FavoriteButton";

interface DogTableRowProps {
	dog: Dog
}

const tdFormatter = (column: DogColumns) => {
	if (column === "breed") {
		return "italic text-sm";
	} else if (column === "name") {
		return "font-black ";
	} else if (column === "age") {
		return "after:content-['y.o.'] after:text-xs after:italic after:font-thin";
	}
};


interface LinkFormatterProps {
	column: DogColumns,
	children: ReactNode,
	dog: Dog
}

const LinkFormatter = ({ column, children, dog }: LinkFormatterProps) => {
	if (column === "breed") {
		return (
			<Link to="/dogs/breeds/$breed" params={{ breed: dog.breed }}>
				{children}
			</Link>
		)
	}
	return (
		<Link to="/dogs/$dogId" params={{ dogId: dog.id }}>
			{children}
		</Link>
	)
};

export default function DogTableRow({ dog }: DogTableRowProps) {
	const { img, id, ...dogObject } = dog;

	return (
		<>
			<tr
				key={id}
				className={[
					"py-2 group-hover:opacity-60 hover:!opacity-100 h-24 transition-opacity animate-fadeIn rounded-lg",
				].join(" ")}
			>
				<td className="m-4 size-12" key={`dogImage-${id}`}>
					<Link to="/dogs/$dogId" params={{ dogId: id }}>
						<img
							src={img}
							alt={`picture of ${dogObject.name}, a ${dogObject.breed}`}
							className="rounded-lg object-cover ml-auto size-24"
						/>
					</Link >
				</td>
				{
					Object.entries(dogObject).map(([key, dogObjectVal]) => (
						<td
							key={dogObjectVal}
							className={[
								"text-center break-words text-xs md:text-base",
								`${tdFormatter(key as DogColumns)}`,
							].join(" ")}
						>
							<LinkFormatter dog={dog} column={key as DogColumns}>
								{dogObjectVal}
							</LinkFormatter>
						</td>
					))
				}
				<td className="text-center">
					<FavoriteButton dog={dog} />
				</td>
			</tr >
		</>
	)
}
