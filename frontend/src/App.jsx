import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Causes from "./pages/Causes";
import CauseDetails from "./pages/CauseDetails";
import NGOs from "./pages/NGOs";
import Impact from "./pages/Impact";
import Transparency from "./pages/Transparency";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="causes" element={<Causes />} />
          <Route path="cause/:id" element={<CauseDetails />} />
          <Route path="ngos" element={<NGOs />} />
          <Route path="impact" element={<Impact />} />
          <Route path="transparency" element={<Transparency />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

