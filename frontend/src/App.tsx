/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: App.tsx
Files Required: None
Description:
API Calls:


 */



import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ApplicationsPage from "./pages/ApplicationsPage";

import DashboardLayout from "./layout/DashboardLayout";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Dashboard */}
                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/applications" element={<ApplicationsPage />} />
                    <Route path="/ai" element={<div>AI Page</div>} />
                    <Route path="/knowledge" element={<div>Knowledge Page</div>} />
                    <Route path="/scrape" element={<div>Scrape Page</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
