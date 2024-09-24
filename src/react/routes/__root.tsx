import * as React from "react"
import { Outlet, createRootRoute } from "@tanstack/react-router"
import Layout from "@layouts/Layout.astro"

export const Route = createRootRoute({
  component: () => (
    <>
      <div>
        test div
      </div>
      <Outlet />
    </>
  ),
})
