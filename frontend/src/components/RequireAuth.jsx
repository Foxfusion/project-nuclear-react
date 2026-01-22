/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: RequireAuth.jsx
Files Required: None
Description:
API Calls:


 */



import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { fetchMe, clearAuth, getToken } from "../api/auth";
import useIdleLogout from "../hooks/userIdleLogout.jsx"; // <- matches your filename

export default function RequireAuth({ children }) {
    const location = useLocation();
    const [status, setStatus] = useState("checking"); // checking | authed | denied
    const [debug, setDebug] = useState("");

    // Idle timeout (set short to prove it works, then change back)
    useIdleLogout({ idleMs: 15 * 60 * 1000 });

    useEffect(() => {
        let cancelled = false;

        async function run() {
            try {
                const token = getToken();
                if (!token) throw new Error("No token in localStorage");

                await fetchMe(); // server validates token
                if (!cancelled) {
                    setStatus("authed");
                    setDebug("me ok");
                }
            } catch (err) {
                clearAuth();
                if (!cancelled) {
                    setStatus("denied");
                    setDebug(err?.message || "auth failed");
                }
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, []);

    if (status === "checking") {
        return (
            <div style={{ fontFamily: "Arial", padding: 20 }}>
                Checking session… <div style={{ opacity: 0.7 }}>{debug}</div>
            </div>
        );
    }

    if (status === "denied") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
