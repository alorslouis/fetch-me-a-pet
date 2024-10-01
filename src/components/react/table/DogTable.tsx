import { useStore } from '@nanostores/react'
import { $fetchedDogs } from '@stores/fetchedDogs';
import { dogColumns, dogParser, type DogColumns } from '@typedef/apiTypes';
import DogTableRow from './DogTableRow';
import DogTableControls from './DogTableControls';
import DogTablePagination from './DogTablePaginationControls';

interface DogTableProps {
	lockedBreeds?: string[]
}

export function DogTable({ lockedBreeds }: DogTableProps) {

	const $showingDogs = useStore($fetchedDogs)

	const dogColumnValues: DogColumns[] = Object.values(dogColumns.Values);

	const formatColNames = (colKey: DogColumns) => {
		if (colKey === "img" || colKey === "isFavorite") {
			return "";
		} else if (colKey === "zip_code") {
			return colKey.split("_")[0];
		} else return colKey;
	};

	const headerVals = dogColumnValues.map((k) => formatColNames(k));

	return (
		<div>
			<DogTableControls lockedBreeds={lockedBreeds} />
			<div className="border rounded-lg rounded-b-none p-4 min-h-[50dvh]">
				<table className="table table-auto md:table-fixed container items-center mx-auto">
					<thead>
						<tr>
							{
								headerVals.map((hVal, index) => (
									<th className="text-center capitalize font-bold text-lg" key={`${hVal}-${index}`}>
										{hVal}
									</th>
								))
							}
						</tr>
					</thead>
					<tbody className="group">
						{Object.values($showingDogs)?.map(x => {
							const dog = dogParser.safeParse(x)

							if (!dog.success) {
								console.error(dog.error)
								return null
							} else {
								return <DogTableRow key={dog.data.id} dog={dog.data} />
							}

						})}
					</tbody>
				</table>
			</div>
			<div className="border rounded-b-lg border-t-0">
				<DogTablePagination />
			</div>
		</div>
	)
}
