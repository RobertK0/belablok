import { Route } from "@tanstack/react-router";
import { rootRoute } from "../root/Root.route";
import { ScoreTotalComponent } from "./ScoreTotalComponent";
import { ScoreRoundComponent } from "./ScoreRoundComponent";

// Parent route for all score-related routes
export const scoreRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/score",
});

// Main score page showing total score
export const scoreTotalRoute = new Route({
  getParentRoute: () => scoreRoute,
  path: "/",
  component: ScoreTotalComponent,
});

// Route for adding new round score
export const scoreRoundRoute = new Route({
  getParentRoute: () => scoreRoute,
  path: "/round",
  component: ScoreRoundComponent,
});
