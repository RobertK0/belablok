import { Route } from "@tanstack/react-router";
import { rootRoute } from "../root/Root.route";
import { SettingsComponent } from "./SettingsComponent";

export const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsComponent,
});
