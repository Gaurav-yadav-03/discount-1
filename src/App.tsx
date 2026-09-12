import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CaseDetailsPage } from "./pages/CaseDetailsPage";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/cases/:id" element={<CaseDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
