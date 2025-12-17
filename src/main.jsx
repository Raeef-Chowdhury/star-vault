import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EmotionPlanets from "./components/EmotionPlanets.jsx";
import TravelPlanets from "./components/TravelPlanets.jsx";
import { StarVaultProvider } from "./components/header"; // ← Add this import

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Emotion",
    element: <EmotionPlanets />,
  },
  {
    path: "/Travel",
    element: <TravelPlanets />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StarVaultProvider>
      <RouterProvider router={router} />
    </StarVaultProvider>{" "}
  </StrictMode>
);
