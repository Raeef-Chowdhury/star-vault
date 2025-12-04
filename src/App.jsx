import "./App.css";
import Header from "./components/header";
import Scence from "./components/Universe";

//TODO:Only Galaxies in Main Universe Scence
//TODO: Unique Galaxies UI (SPiral,GLow,Black Hole,Ring,etc..)
//TODO: ADD GAALXY/MEMORY UI form in header
//TODO: INDIVIDUAL STARS IN GALAXY
//TODO: REACT ROUTING EACH IDNIVIDUAL GALAXY
//TODO: UI TOP LEFT DISPLAYING WHAT SCENCE IT IS
//TODO: CONNECTION LINES INSIDE STARS
//TODO: START ONLY 5 STARS, NO MEMROIES, ADD REMIDNER TO AdD FIRST MEMROY, THEN DESCRIBE CURRENT GALAXIEs IN BOTTOM WITH COLOUR NOTATION & TEXT OF EACH GALAXY
function App() {
  return (
    <>
      <Header />
      <Scence />
    </>
  );
}

export default App;
