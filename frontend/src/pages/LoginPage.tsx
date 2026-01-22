/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: LoginPage.tsx
Files Required: None
Description: Component for user login functionality, including form handling and API interaction.
API Calls: 10.2.2.45:4000


 */

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/LoginPage.module.css";

const API_BASE = "http://10.2.2.45:4000";

export default function LoginPage() {
    const navigate = useNavigate();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const body = new URLSearchParams();
            body.set("emailOrUsername", emailOrUsername);
            body.set("password", password);

            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body.toString(), // <-- safest for TS/fetch
            });

            const data = await res.json().catch(() => ({} as any));

            if (!res.ok || !data?.ok || !data?.token) {
                throw new Error(data?.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            navigate("/", { replace: true });
        } catch (err: any) {
            setError(err?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.dot} />
                    <div>
                        <div className={styles.title}>Project Nuclear</div>
                        <div className={styles.subtitle}>Sign in to continue</div>
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
                    <label className={styles.label}>Email or Username</label>
                    <input
                        className={styles.input}
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="project_nuclear or wgfox"
                        autoComplete="username"
                        required
                    />

                    <label className={styles.label}>Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? "Logging in…" : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
