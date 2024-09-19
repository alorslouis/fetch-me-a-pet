import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {

	if (context.url.pathname === "/login") {
		return next()
	}

	const fetchAccessToken = context.cookies?.get("fetch-access-token")
	//const AWSALB = context.cookies?.get("AWSALB")
	//const AWSALBCORS = context.cookies?.get("AWSALBCORS")

	//if (fetchAccessToken && AWSALB && AWSALBCORS) {
	if (fetchAccessToken) {
		context.locals.loggedIn = true
	} else {
		context.locals.loggedIn = false
		return context.redirect("/login")
	}

	return next();
})

