import { Route, Routes } from "react-router-dom";

import MakesPage from "./pages/MakesPage";
import ModelsPage from "./pages/ModelsPage";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<MakesPage />} />
        <Route path="/models/:id" element={<ModelsPage />} />
      </Routes>

      <div className="small center">(no changes are saved)</div>
    </main>
  );
}

export default App;
