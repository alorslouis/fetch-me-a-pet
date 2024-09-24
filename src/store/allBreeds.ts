import type { AuthLogin } from "@typedef/apiTypes";
import { atom, onMount } from "nanostores";
import { z } from "zod";

// 
export const breedsStore = atom<string[] | null>(null);

