import { Route } from "@tanstack/react-router";
import { rootRoute } from "../root/Root.route";
import { ScoreComponent } from "./ScoreComponent";

export const scoreRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/score",
  component: ScoreComponent,
});
