export const favoriteIdConstructor = (id: string, location: "button" | "div") => location === "div" ? `favoriteId${id}` : `favButton-${id}`
