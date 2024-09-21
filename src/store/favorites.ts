import type { Dog } from "@typedef/apiTypes";
import { atom, map } from "nanostores";
import { z } from "zod";

export const $dogFavorites = map<Record<string, Dog | null>>({});

$dogFavorites.subscribe(x => console.log({ x }))
