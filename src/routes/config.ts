import { Router } from "@tanstack/react-router";
import { rootRoute } from "./root/Root.route";
import { homeRoute } from "./home/Home.route";
import { scoreRoute } from "./score/Score.route";
import { historyRoute } from "./history/History.route";
import { settingsRoute } from "./settings/Settings.route";
import { playersRoute } from "./players/Players.route";
import { setupRoute } from "./setup/Setup.route";

// Create the route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  scoreRoute,
  historyRoute,
  settingsRoute,
  playersRoute,
  setupRoute,
]);

// Create the router
export const router = new Router({ routeTree });

// Register the routes
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
