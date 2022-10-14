import { Route, Routes } from "react-router-dom";

import MakesPage from "./pages/MakesPage";
import ModelsPage from "./pages/ModelsPage";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<MakesPage />} />
        <Route path="/models/:make" element={<ModelsPage />} />
      </Routes>
      <div className="center small">display:version</div>
    </main>
  );
}

export default App;
