/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: App.jsx
Files Required: None
Description:
API Calls:


 */


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ApplicationsPage from "./pages/ApplicationsPage";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/applications" element={<ApplicationsPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
