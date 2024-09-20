import type { AuthLogin } from "@typedef/apiTypes";
import { atom } from "nanostores";
import { z } from "zod";

export const userStore = atom<AuthLogin | null>(null);

