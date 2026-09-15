import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppDataProvider } from "./AppDataContext";
import { AppShell } from "./components/AppShell";
import { CaseDetailsPage } from "./pages/CaseDetailsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ExplorerPage } from "./pages/ExplorerPage";
import { HistoryPage } from "./pages/HistoryPage";
import { InboxPage } from "./pages/InboxPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter><AppDataProvider><Routes>
      <Route element={<AppShell />}><Route path="/" element={<DashboardPage />} /><Route path="/inbox" element={<InboxPage />} /><Route path="/explore" element={<ExplorerPage />} /><Route path="/analytics" element={<AnalyticsPage />} /><Route path="/history" element={<HistoryPage />} /><Route path="/settings" element={<SettingsPage />} /></Route>
      <Route path="/cases/:id" element={<CaseDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></AppDataProvider></BrowserRouter>
  );
}
