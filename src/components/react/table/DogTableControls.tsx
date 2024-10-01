import { z } from "zod"
import { useStore } from "@nanostores/react"
import { breedsStore } from "@stores/allBreeds"
import { searchTermsStore } from "@stores/search"
import { sortableSearchKeys, sortDirection, sortSchema } from "@typedef/apiTypes"
import DogTablePagination from "./DogTablePaginationControls"
import { tableLoadingState } from "@stores/reactLoadingState"
import { geo } from "@stores/geoLocate"

interface DogTableControls {
	lockedBreeds?: string[]
}


export default function DogTableControls({ lockedBreeds }: DogTableControls) {
	const $breeds = useStore(breedsStore)

	//console.log({ $breeds })

	const $breedsNarrowed = lockedBreeds ? $breeds?.filter(x => lockedBreeds.includes(x)) : $breeds
	const $searchParams = useStore(searchTermsStore)
	const $loadingState = useStore(tableLoadingState)
	const userLocation = useStore(geo)


	const sortFieldOptions = sortableSearchKeys.options;
	const sortDirOptions = sortDirection.options;

	const numberParse = z.coerce.number()

	const zipArrayIncludesUserZip = $searchParams?.zipCodes && userLocation?.zip && $searchParams?.zipCodes?.includes(userLocation?.zip) ? true : false

	const [sortField, sortDir] = $searchParams.sort?.split(":");

	const pageSizeOptions = [10, 25, 50, 75, 100] as const;
	//console.log({ searchParams: $searchParams })
	return (
		<form
			className={["my-2 border border-white/50 rounded-lg grow divide-y divide-white/50", `${$loadingState ? "!border-green-500 animate-pulse" : null}`].join(" ")}
			id="dogTableForm"
		>
			<div className="flex flex-col md:flex-row">
				{
					$breedsNarrowed ? (
						<div className="flex flex-col text-center">
							<label
								htmlFor="breeds"
								className="pt-2 text-sm font-bold italic"
							>
								breeds
							</label>
							{userLocation ? <input hidden type="text" defaultValue={[userLocation.zip]} name="zipCodes" />
								: null}
							<select
								className="bg-transparent rounded-tl-lg border-0 flex flex-col grow"
								multiple
								defaultValue={lockedBreeds}
								name="breeds"
								onChange={(event) => {
									const selectedOptions = Array.from(event.target.selectedOptions);
									const breeds = selectedOptions.map(option => option.value);
									searchTermsStore.set({
										...$searchParams, breeds, from: 0
									})
								}}
							>
								{$breedsNarrowed.map(
									(breed) => (
										<option
											value={
												breed
											}
											key={breed}
										>
											{
												breed
											}
										</option>
									),
								)}
							</select>
						</div>
					) : null
				}

				<div
					className="flex flex-col lg:flex-row grow border-t md:border-t-0 md:border-l border-white/50"
				>
					<div
						className="flex flex-col h-full grow rounded-tr-lg opacity-50"
					>
						<div className="flex items-center">
							<button className={["ml-auto flex items-center gap-2 p-4 hover:!text-green-300 !opacity-100", `${zipArrayIncludesUserZip ? "text-blue-500 animate-pulse" : ""}`].join(" ")} onClick={(event) => {
								event.preventDefault()

								if (zipArrayIncludesUserZip) {
									const { zipCodes, ...restSP } = $searchParams

									searchTermsStore.set({
										...restSP
									})
								} else if ($searchParams.zipCodes && userLocation?.zip) {

									searchTermsStore.set({
										...$searchParams,
										zipCodes: [...$searchParams.zipCodes, userLocation?.zip]
									})
								} else if (!$searchParams.zipCodes && userLocation?.zip) {

									searchTermsStore.set({
										...$searchParams,
										zipCodes: [userLocation?.zip]
									})
								}

								userLocation?.zip
							}}>
								{zipArrayIncludesUserZip ? (
									<p className="text-xs">
										{userLocation?.zip} x
									</p>
								) : (
									<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.50207C0.877075 3.84319 3.84319 0.877075 7.50208 0.877075C11.1609 0.877075 14.1271 3.84319 14.1271 7.50207C14.1271 11.1609 11.1609 14.1271 7.50208 14.1271C3.84319 14.1271 0.877075 11.1609 0.877075 7.50207ZM1.84898 7.00003C2.0886 4.26639 4.26639 2.0886 7.00003 1.84898V4.50003C7.00003 4.77617 7.22388 5.00003 7.50003 5.00003C7.77617 5.00003 8.00003 4.77617 8.00003 4.50003V1.84862C10.7356 2.08643 12.9154 4.26502 13.1552 7.00003H10.5C10.2239 7.00003 10 7.22388 10 7.50003C10 7.77617 10.2239 8.00003 10.5 8.00003H13.1555C12.9176 10.7369 10.7369 12.9176 8.00003 13.1555V10.5C8.00003 10.2239 7.77617 10 7.50003 10C7.22388 10 7.00003 10.2239 7.00003 10.5V13.1552C4.26502 12.9154 2.08643 10.7356 1.84862 8.00003H4.50003C4.77617 8.00003 5.00003 7.77617 5.00003 7.50003C5.00003 7.22388 4.77617 7.00003 4.50003 7.00003H1.84898Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
								)}
							</button>
						</div>
						<div className="flex flex-col mt-auto border-t">
							<p
								className="text-center italic flex items-center justify-center h-full"
							>
								sort by
							</p>
							<div
								className="flex grow md:border-b lg:border-b-0"
							>
								<select
									className="bg-transparent border-0 flex grow"
									name="sortOption"
									disabled={$loadingState}
									defaultValue={sortField}
									onChange={(event) => {
										event.preventDefault()
										const existingDir = $searchParams.sort.split(":")[1]
										const sortOption = sortableSearchKeys.parse(event.target.value);
										const sortDir = sortDirection.parse(existingDir);
										const combinedSort = `${sortOption}:${sortDir}`;
										searchTermsStore.set({ ...$searchParams, sort: sortSchema.parse(combinedSort), from: 0 })
									}}
								>
									{
										sortFieldOptions.map(
											(
												sortOption,
											) => (
												<option
													value={
														sortOption
													}
													key={sortOption}
												>
													{
														sortOption
													}
												</option>
											),
										)
									}
								</select>
								<select
									className="bg-transparent flex grow border-0"
									name="sortDir"
									disabled={$loadingState}
									defaultValue={sortDir}
									onChange={(event) => {
										event.preventDefault()
										const existingSortOption = $searchParams.sort.split(":")[0]
										const sortOption = sortableSearchKeys.parse(existingSortOption);
										const sortDir = sortDirection.parse(event.target.value);
										const combinedSort = `${sortOption}:${sortDir}`;
										searchTermsStore.set({ ...$searchParams, sort: sortSchema.parse(combinedSort), from: 0 })
									}}
								>
									{
										sortDirOptions.map(
											(
												dir,
											) => (
												<option
													value={
														dir
													}
													key={dir}
												>
													{
														dir
													}
												</option>
											),
										)
									}
								</select>
							</div>
						</div>
					</div>
					<div
						className="flex flex-col gap-2 items-center justify-center py-2 border-white/50 border-t md:border-t-0 lg:border-l"
					>
						<select
							name="size"
							className="bg-transparent border-0 text-xs w-full"
							disabled={$loadingState}
							defaultValue={$searchParams.size}
							onChange={(event) => {
								event.preventDefault()
								const newSize = event.target.value
								searchTermsStore.set({ ...$searchParams, size: Number(newSize), from: 0 })

							}}
						>
							{
								pageSizeOptions.map(
									(option) => (
										<option
											value={
												option
											}
											key={option}
										>
											{
												option
											}

											/
											page
										</option>
									),
								)
							}</select
						>
						<input
							type="number"
							className="bg-transparent w-full border-0"
							placeholder="minimum age"
							name="ageMin"
							min="0"
							disabled={$loadingState}
							onChange={(event) => {
								event.preventDefault()
								const newAgeMin = numberParse.parse(event.target.value)
								searchTermsStore.set({ ...$searchParams, ageMin: Number(newAgeMin), from: 0 })
							}}
							value={$searchParams?.ageMin ??
								""}
						/>
						<input
							type="number"
							className="bg-transparent w-full border-0"
							placeholder="maximum age"
							name="ageMax"
							disabled={$loadingState}
							min="0"
							onChange={(event) => {
								event.preventDefault()
								const newAgeMax = numberParse.parse(event.target.value)
								searchTermsStore.set({ ...$searchParams, ageMax: Number(newAgeMax), from: 0 })
							}}
							value={$searchParams?.ageMax ??
								""}
						/>
					</div>
				</div>
			</div>
			<DogTablePagination />
		</form>
	)
}
