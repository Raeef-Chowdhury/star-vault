import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EmotionPlanets from "./components/EmotionPlanets.jsx";
import TravelPlanets from "./components/TravelPlanets.jsx";
import { StarVaultProvider } from "./components/header";
import CareerPlanets from "./components/CareerPlanets.jsx";
import PersonalPlanets from "./components/PersonalPlanets.jsx";
import MileStonePlanets from "./components/MileStonePlanets.jsx";
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
  {
    path: "/Career",
    element: <CareerPlanets />,
  },
  {
    path: "/Personal",
    element: <PersonalPlanets />,
  },
  {
    path: "/Milestone",
    element: <MileStonePlanets />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StarVaultProvider>
      <RouterProvider router={router} />
    </StarVaultProvider>{" "}
  </StrictMode>
);
