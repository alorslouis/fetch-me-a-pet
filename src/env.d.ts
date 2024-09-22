/// <reference path="../.astro/types.d.ts" />
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
type AuthLogin = import("@typedef/apiTypes").AuthLogin

declare namespace App {
	interface Locals extends Runtime {
		loggedIn: boolean,
		userObject?: AuthLogin
	}
}
