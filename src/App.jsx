import "./App.css";
import Header from "./components/header";
import Scence from "./components/Universe";
import { initGA } from "./utils/analytics";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    initGA();
  }, []);
  return (
    <>
      <Header />
      <Scence />
    </>
  );
}

export default App;
