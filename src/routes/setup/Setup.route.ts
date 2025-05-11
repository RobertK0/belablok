import { Route } from "@tanstack/react-router";
import { rootRoute } from "../root/Root.route";
import { SetupComponent } from "./SetupComponent";

export const setupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/setup",
  component: SetupComponent,
});
