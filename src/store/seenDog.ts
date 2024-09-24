import { type Dog, type ViewedKvMetadata } from "@typedef/apiTypes";
import { map } from "nanostores";

export const $viewedDog = map<Record<string, ViewedKvMetadata | null>>({});

