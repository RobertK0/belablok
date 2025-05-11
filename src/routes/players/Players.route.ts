import { Route } from "@tanstack/react-router";
import { rootRoute } from "../root/Root.route";
import { PlayersComponent } from "./PlayersComponent";

export const playersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/players",
  component: PlayersComponent,
});
