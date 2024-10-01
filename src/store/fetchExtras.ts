import type { SearchExtras } from "@typedef/apiTypes";
import { atom } from "nanostores";

export const searchExtras = atom<SearchExtras | null>(null);
