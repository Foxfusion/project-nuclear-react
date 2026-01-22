/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: HomePage.tsx
Files Required: None
Description: Main Page
API Calls:


 */



import { useState } from "react";
import styles from "../styles/pages/HomePage.module.css";

export default function HomePage() {
    const [cells, setCells] = useState([
        "SELECT * FROM Projects LIMIT 20;",
        "# Spark\n# df = spark.read.table('Projects')\n# display(df)",
    ]);

    function updateCell(i: number, v: string) {
        setCells((prev) => prev.map((c, idx) => (idx === i ? v : c)));
    }

    function runCell(i: number) {
        // placeholder: later call backend to submit spark job
        console.log("Run cell", i + 1);
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <div className={styles.breadcrumb}>
                    Workspace / Notebooks / <span>Dashboard</span>
                </div>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}>New Cell</button>
                    <button className={styles.primaryBtn}>Run All</button>
                </div>
            </div>

            <div className={styles.notebook}>
                {cells.map((cell, i) => (
                    <div key={i} className={styles.cell}>
                        <div className={styles.cellHeader}>
                            <div className={styles.cellTitle}>Cell {i + 1}</div>
                            <button className={styles.runBtn} onClick={() => runCell(i)}>
                                Run
                            </button>
                        </div>

                        <textarea
                            className={styles.editor}
                            value={cell}
                            onChange={(e) => updateCell(i, e.target.value)}
                            spellCheck={false}
                        />

                        <div className={styles.cellFooter}>
                            Language: SQL / PySpark (placeholder)
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
