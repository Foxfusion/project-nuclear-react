import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export default function useIdleLogout({ idleMs = 15 * 60 * 1000 } = {}) {
    const navigate = useNavigate();

    useEffect(() => {
        let timer;

        const reset = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                logout();
                navigate("/login", { replace: true });
            }, idleMs);
        };

        const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
        events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
        reset();

        return () => {
            clearTimeout(timer);
            events.forEach((e) => window.removeEventListener(e, reset));
        };
    }, [idleMs, navigate]);
}
