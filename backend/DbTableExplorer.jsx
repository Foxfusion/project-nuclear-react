import React, { useEffect, useState } from "react";

const API_BASE = "http://10.2.2.45:4000";
// If React is running on Hawkgirl itself, you can use: "http://localhost:4000"

export default function DbTableExplorer() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Load table list on mount
    useEffect(() => {
        const loadTables = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/tables`);
                const data = await res.json();
                if (res.ok && data.ok) {
                    setTables(data.tables || []);
                    if (data.tables && data.tables.length > 0) {
                        setSelectedTable(data.tables[0]);
                    }
                } else {
                    setError(data.message || "Failed to load table list");
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        loadTables();
    }, []);

    // Load rows whenever table / offset / limit changes
    useEffect(() => {
        if (!selectedTable) return;

        const loadRows = async () => {
            setLoading(true);
            setError("");
            setStatus(`Loading ${selectedTable}...`);

            try {
                const params = new URLSearchParams({
                    limit: String(limit),
                    offset: String(offset),
                });

                const res = await fetch(
                    `${API_BASE}/api/table/${encodeURIComponent(selectedTable)}?${params.toString()}`
                );
                const data = await res.json();

                if (res.ok && data.ok) {
                    setRows(data.rows || []);
                    setTotal(data.total || 0);
                    setStatus(
                        `Loaded ${data.rowCount} row(s) from ${data.table} (showing ${offset + 1}–${offset + data.rowCount} of ${data.total})`
                    );

                    if (data.rows && data.rows.length > 0) {
                        setColumns(Object.keys(data.rows[0]));
                    } else {
                        setColumns([]);
                    }
                } else {
                    setRows([]);
                    setColumns([]);
                    setStatus("Error loading rows");
                    setError(data.message || "Unknown error");
                }
            } catch (err) {
                console.error(err);
                setRows([]);
                setColumns([]);
                setStatus("Network error");
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadRows();
    }, [selectedTable, limit, offset]);

    const canPrev = offset > 0;
    const canNext = offset + limit < total;

    const handlePrev = () => {
        if (!canPrev) return;
        setOffset(Math.max(offset - limit, 0));
    };

    const handleNext = () => {
        if (!canNext) return;
        setOffset(offset + limit);
    };

    const handleTableChange = (e) => {
        setSelectedTable(e.target.value);
        setOffset(0); // reset paging when switching tables
    };

    const handleLimitChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (Number.isNaN(value) || value <= 0) return;
        setLimit(value);
        setOffset(0);
    };

    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h2>Database Table Browser</h2>

            {/* Controls */}
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                }}
            >
                <label>
                    Table:&nbsp;
                    <select value={selectedTable} onChange={handleTableChange}>
                        {tables.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Page size:&nbsp;
                    <input
                        type="number"
                        value={limit}
                        onChange={handleLimitChange}
                        min={1}
                        max={200}
                        style={{ width: "4rem" }}
                    />
                </label>

                <button onClick={handlePrev} disabled={!canPrev || loading}>
                    ◀ Prev
                </button>
                <button onClick={handleNext} disabled={!canNext || loading}>
                    Next ▶
                </button>

                <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          Offset: {offset} | Total: {total}
        </span>
            </div>

            {/* Status */}
            <p>{loading ? "Loading..." : status}</p>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {/* Data table */}
            {rows.length === 0 ? (
                <p>No rows.</p>
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
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "4px 8px",
                                        textAlign: "left",
                                        background: "#eee",
                                        position: "sticky",
                                        top: 0,
                                    }}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                {columns.map((col) => (
                                    <td
                                        key={col}
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "4px 8px",
                                            verticalAlign: "top",
                                            maxWidth: "300px",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                        }}
                                        title={String(row[col] ?? "")}
                                    >
                                        {String(row[col] ?? "")}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
