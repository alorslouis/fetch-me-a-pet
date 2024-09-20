import type { Dog } from "@typedef/apiTypes";
import { atom } from "nanostores";
import { z } from "zod";

export const dogFavorites = atom<Dog | null>(null);

