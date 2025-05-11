import { Route } from "@tanstack/react-router";
import { rootRoute } from "../root/Root.route";
import { HistoryComponent } from "./HistoryComponent";

export const historyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryComponent,
});
