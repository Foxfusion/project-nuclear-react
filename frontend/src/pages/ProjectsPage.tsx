/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: ProjectsPage.tsx
Files Required: None
Description: Pull projects from the backend API - MaraDB Database
API Calls:10.2.2.45:4000


 */

import { useEffect, useState } from "react";

const API_BASE = "http://10.2.2.45:4000";

function getToken() {
    return localStorage.getItem("token"); // <-- change if your key differs
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // create form
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");

    // edit state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState("active");

    async function safeJson(res) {
        // if backend ever returns non-JSON, avoid crashing the UI
        try {
            return await res.json();
        } catch {
            return { ok: false, message: `Non-JSON response (HTTP ${res.status})` };
        }
    }

    async function fetchProjects() {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE}/api/projects`, {
                headers: { ...authHeaders() },
            });

            if (res.status === 401 || res.status === 403) {
                const data = await safeJson(res);
                throw new Error(data.message || "Unauthorized: please log in again.");
            }

            const data = await safeJson(res);
            if (!data.ok) throw new Error(data.message || "Failed to load projects");

            setProjects(data.projects || []);
        } catch (e) {
            setError(e.message || "Error loading projects");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        try {
            setError(null);

            const res = await fetch(`${API_BASE}/api/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                },
                body: JSON.stringify({ name, description, status }),
            });

            if (res.status === 401 || res.status === 403) {
                const data = await safeJson(res);
                throw new Error(data.message || "Unauthorized: please log in again.");
            }

            const data = await safeJson(res);
            if (!data.ok) throw new Error(data.message || "Failed to create project");

            setName("");
            setDescription("");
            setStatus("active");
            await fetchProjects();
        } catch (e) {
            setError(e.message || "Error creating project");
        }
    }

    function startEdit(p) {
        setEditingId(p.id);
        setEditName(p.name || "");
        setEditDescription(p.description || "");
        setEditStatus(p.status || "active");
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName("");
        setEditDescription("");
        setEditStatus("active");
    }

    async function handleUpdate(id) {
        try {
            setError(null);

            const res = await fetch(`${API_BASE}/api/projects/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                },
                body: JSON.stringify({
                    name: editName,
                    description: editDescription,
                    status: editStatus,
                }),
            });

            if (res.status === 401 || res.status === 403) {
                const data = await safeJson(res);
                throw new Error(data.message || "Unauthorized: please log in again.");
            }

            const data = await safeJson(res);
            if (!data.ok) throw new Error(data.message || "Failed to update project");

            cancelEdit();
            await fetchProjects();
        } catch (e) {
            setError(e.message || "Error updating project");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this project?")) return;
        try {
            setError(null);

            const res = await fetch(`${API_BASE}/api/projects/${id}`, {
                method: "DELETE",
                headers: { ...authHeaders() },
            });

            if (res.status === 401 || res.status === 403) {
                const data = await safeJson(res);
                throw new Error(data.message || "Unauthorized: please log in again.");
            }

            const data = await safeJson(res);
            if (!data.ok) throw new Error(data.message || "Failed to delete project");

            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (e) {
            setError(e.message || "Error deleting project");
        }
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Projects</h1>
                <p className="text-sm text-slate-300">
                    Manage projects stored in the FoxBase_One backend (MySQL) via the REST API.
                </p>
            </div>

            {error && (
                <div className="rounded-md border border-red-500/40 bg-red-950/70 px-3 py-2 text-xs text-red-200">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleCreate}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3"
            >
                <h2 className="text-sm font-semibold text-slate-100">Create New Project</h2>

                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1 text-xs">
                        <label className="block text-slate-300">Name</label>
                        <input
                            className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none focus:border-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Project Nuclear Web UI"
                        />
                    </div>

                    <div className="space-y-1 text-xs">
                        <label className="block text-slate-300">Status</label>
                        <select
                            className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none focus:border-blue-500"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1 text-xs">
                    <label className="block text-slate-300">Description</label>
                    <textarea
                        className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none focus:border-blue-500"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short description of this project..."
                    />
                </div>

                <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500"
                >
                    Create Project
                </button>
            </form>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
                <table className="w-full text-xs">
                    <thead className="bg-slate-900/90 text-slate-300">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium">ID</th>
                        <th className="px-3 py-2 text-left font-medium">Name</th>
                        <th className="px-3 py-2 text-left font-medium">Description</th>
                        <th className="px-3 py-2 text-left font-medium">Status</th>
                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                                Loading projects…
                            </td>
                        </tr>
                    )}

                    {!loading && projects.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                                No projects yet. Create your first one above.
                            </td>
                        </tr>
                    )}

                    {projects.map((p) => (
                        <tr key={p.id} className="border-t border-slate-800">
                            <td className="px-3 py-2 text-slate-400">{p.id}</td>

                            <td className="px-3 py-2 align-top">
                                {editingId === p.id ? (
                                    <input
                                        className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none focus:border-blue-500"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                ) : (
                                    <span className="text-slate-100">{p.name}</span>
                                )}
                            </td>

                            <td className="px-3 py-2 align-top">
                                {editingId === p.id ? (
                                    <textarea
                                        className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none focus:border-blue-500"
                                        rows={2}
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                ) : (
                                    <span className="text-slate-300">
                      {p.description || <span className="text-slate-500">—</span>}
                    </span>
                                )}
                            </td>

                            <td className="px-3 py-2 align-top">
                                {editingId === p.id ? (
                                    <select
                                        className="rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none focus:border-blue-500"
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                ) : (
                                    <span className="inline-flex rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                      {p.status}
                    </span>
                                )}
                            </td>

                            <td className="px-3 py-2 align-top text-right space-x-2">
                                {editingId === p.id ? (
                                    <>
                                        <button
                                            type="button"
                                            className="rounded-md bg-green-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-green-500"
                                            onClick={() => handleUpdate(p.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-md bg-slate-700 px-2 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-600"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="rounded-md bg-blue-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-blue-500"
                                            onClick={() => startEdit(p)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-red-500"
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
