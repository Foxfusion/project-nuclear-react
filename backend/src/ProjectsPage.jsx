/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: ProjectsPage.jsx
Files Required: None
Description:
API Calls: 10.2.2.45:4000


 */




import React, { useEffect, useState } from "react";

const API_BASE = "http://10.2.2.45:4000";
// or "http://localhost:4000" if React is running on Hawkgirl

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [projStatus, setProjStatus] = useState("active");

    const [limit] = useState(50);
    const [offset] = useState(0); // we can add paging later

    const loadProjects = async () => {
        setLoading(true);
        setError("");
        setStatus("Loading projects...");

        try {
            const res = await fetch(
                `${API_BASE}/api/projects?limit=${limit}&offset=${offset}`
            );
            const data = await res.json();

            if (res.ok && data.ok) {
                setProjects(data.projects || []);
                setStatus(`Loaded ${data.rowCount} project(s)`);
            } else {
                setProjects([]);
                setStatus("Failed to load projects");
                setError(data.message || "Unknown error");
            }
        } catch (err) {
            console.error(err);
            setProjects([]);
            setStatus("Network error");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setStatus("Creating project...");

        if (!name.trim()) {
            setError("Name is required");
            setStatus("Validation error");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description,
                    status: projStatus,
                }),
            });

            const data = await res.json();

            if (res.ok && data.ok) {
                setStatus("Project created");
                setName("");
                setDescription("");
                setProjStatus("active");
                await loadProjects(); // refresh list
            } else {
                setStatus("Failed to create project");
                setError(data.message || "Unknown error");
            }
        } catch (err) {
            console.error(err);
            setStatus("Network error");
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Delete project #${id}?`)) return;

        setStatus(`Deleting project #${id}...`);
        setError("");

        try {
            const res = await fetch(`${API_BASE}/api/projects/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok && data.ok) {
                setStatus("Project deleted");
                await loadProjects();
            } else {
                setStatus("Failed to delete project");
                setError(data.message || "Unknown error");
            }
        } catch (err) {
            console.error(err);
            setStatus("Network error");
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h1>Projects</h1>

            {/* Create form */}
            <section
                style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                }}
            >
                <h2>Create New Project</h2>
                <form onSubmit={handleCreate}>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <label>
                            Name:&nbsp;
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: "300px" }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: "0.5rem" }}>
                        <label>
                            Status:&nbsp;
                            <select
                                value={projStatus}
                                onChange={(e) => setProjStatus(e.target.value)}
                            >
                                <option value="active">active</option>
                                <option value="paused">paused</option>
                                <option value="archived">archived</option>
                            </select>
                        </label>
                    </div>

                    <div style={{ marginBottom: "0.5rem" }}>
                        <label>
                            Description:&nbsp;
                            <br />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                style={{ width: "100%", maxWidth: "500px" }}
                            />
                        </label>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Working..." : "Create Project"}
                    </button>
                </form>
            </section>

            {/* Status + errors */}
            <p>{status}</p>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {/* Projects table */}
            <section>
                <h2>Existing Projects</h2>
                {projects.length === 0 ? (
                    <p>No projects found.</p>
                ) : (
                    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                        <table
                            style={{
                                borderCollapse: "collapse",
                                minWidth: "800px",
                                fontSize: "0.9rem",
                            }}
                        >
                            <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Created</th>
                                <th style={thStyle}>Updated</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {projects.map((p) => (
                                <tr key={p.id}>
                                    <td style={tdStyle}>{p.id}</td>
                                    <td style={tdStyle}>{p.name}</td>
                                    <td style={tdStyle}>{p.status}</td>
                                    <td style={tdStyle}>
                                        {p.created_at ? String(p.created_at) : ""}
                                    </td>
                                    <td style={tdStyle}>
                                        {p.updated_at ? String(p.updated_at) : ""}
                                    </td>
                                    <td style={{ ...tdStyle, maxWidth: "300px" }}>
                                        {p.description}
                                    </td>
                                    <td style={tdStyle}>
                                        {/* Edit can be added later */}
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            style={{ color: "red" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

const thStyle = {
    border: "1px solid #ccc",
    padding: "4px 8px",
    textAlign: "left",
    background: "#eee",
};

const tdStyle = {
    border: "1px solid #ccc",
    padding: "4px 8px",
    verticalAlign: "top",
};
