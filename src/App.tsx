import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import { Suspense } from "react";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
