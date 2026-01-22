/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: DbTest.jsx
Files Required: None
Description:
API Calls: 10.2.2.45:3306


 */

import React, { useEffect, useState } from "react";

export default function DbTest() {
    const [status, setStatus] = useState("Checking...");
    const [details, setDetails] = useState(null);

    useEffect(() => {
        fetch("http://10.2.2.45:3306/api/db-test")
            .then(async (res) => {
                const data = await res.json();
                if (res.ok && data.ok) {
                    setStatus("✅ React can reach API, and API can reach MariaDB");
                } else {
                    setStatus("⚠️ React reached API, but DB test failed");
                }
                setDetails(data);
            })
            .catch((err) => {
                console.error(err);
                setStatus("❌ React could not reach the API server");
                setDetails({ error: err.message });
            });
    }, []);

 const [rows] = await pool.query(`SELECT * FROM \`${table}\` LIMIT 50`);
    res.json({
      ok: true,
      table,
      rowCount: rows.length,
      rows,
    });
  } catch (err) {
    console.error(`Error querying table ${table}:`, err);
    res.status(500).json({
      ok: false,
      message: `Failed to query table ${table}`,
      error: err.message,
    });
  }
});



   return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h2>DB Connection Test</h2>
            <p>{status}</p>
            <pre style={{ background: "#111", color: "#0f0", padding: "1rem" }}>
        {JSON.stringify(details, null, 2)}
      </pre>
        </div>
    );
}
