import { Route } from "@tanstack/react-router";
import { rootRoute } from "../root/Root.route";
import { HomeComponent } from "./HomeComponent";

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});
