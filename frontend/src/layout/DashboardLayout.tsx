/*
Date Created: 01/20/2026
Modified Date: 01/20/2026
Author: William Fox
Filename: DashboardLayout.tsx
Files Required: None
Description: Dashboard



 */



import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "../styles/layout/DashboardLayout.module.css";

const navItems = [
    { to: "/", label: "Main" },          // home screen
    { to: "/projects", label: "Projects" },
    { to: "/applications", label: "Applications" },
    { to: "/ai", label: "AI" },
    { to: "/knowledge", label: "Knowledge" },
    { to: "/scrape", label: "Scrape" },
];

export default function DashboardLayout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <div className={styles.shell}>
            {/* LEFT NAVBAR */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.project}>Project</div>
                    <div className={styles.name}>Project Nuclear</div>
                </div>

                <div className={styles.sectionTitle}>Navigation</div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.link} ${styles.active}`
                                    : styles.link
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <button className={styles.logout} onClick={logout}>
                    Logout
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className={styles.main}>
                <div className={styles.metal} />
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>

            {/* RIGHT PANEL (optional: FoxBot) */}
            <aside className={styles.right}>
                <div className={styles.rightHeader}>FoxBot</div>
                <div className={styles.rightBody}>Chat UI goes here…</div>
            </aside>
        </div>
    );
}
