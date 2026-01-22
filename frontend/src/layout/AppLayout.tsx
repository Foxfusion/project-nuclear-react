/*
Date Created: 01/20/2026
Modified Date: 01/20/2026
Author: William Fox
Filename:AppLayout.tsx
Files Required: None
Description: Application Layout



 */





import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "../styles/layout/AppLayout.module.css";

export default function AppLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className={styles.app}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.project}>Project</div>
                    <div className={styles.name}>Project Nuclear</div>
                </div>

                <nav className={styles.nav}>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.link} ${styles.active}`
                                : styles.link
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.link} ${styles.active}`
                                : styles.link
                        }
                    >
                        Projects
                    </NavLink>

                    <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.link} ${styles.active}`
                                : styles.link
                        }
                    >
                        Applications
                    </NavLink>

                    <NavLink
                        to="/knowledge"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.link} ${styles.active}`
                                : styles.link
                        }
                    >
                        Knowledge
                    </NavLink>
                </nav>

                <button className={styles.logout} onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            {/* Main content */}
            <main className={styles.main}>
                <div className={styles.metal} />
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
