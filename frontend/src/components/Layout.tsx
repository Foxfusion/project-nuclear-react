import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

import {
    Home,
    FolderKanban,
    AppWindow,
    NotebookPen,
    Brain,
    Settings,
    Users,
    FileText,
} from "lucide-react";

const navGroups = [
    {
        title: "CORE",
        items: [
            { to: "/", label: "Home", icon: Home },
            { to: "/projects", label: "Projects", icon: FolderKanban },
            { to: "/applications", label: "Applications", icon: AppWindow },
            { to: "knowledge", label: "Knowledge", icon: Brain},
            { to: "/notebooks", label: "Notebooks", icon: NotebookPen }, // add route when ready
        ],
    },
    {
        title: "ADMIN",
        items: [
            { to: "/users", label: "Users", icon: Users }, // add route when ready
            { to: "/logs", label: "Logs", icon: FileText }, // add route when ready
            { to: "/settings", label: "Settings", icon: Settings }, // add route when ready
        ],
    },
];

export default function Layout() {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div style={styles.shell}>
            <aside style={styles.sidebar}>
                <div style={styles.brandRow}>
                    <div style={styles.brandDot} />
                    <div>
                        <div style={styles.brandTitle}>Project Nuclear</div>
                        <div style={styles.brandSub}>Secure Workspace</div>
                    </div>
                </div>

                <nav style={styles.nav}>
                    {navGroups.map((group) => (
                        <div key={group.title} style={styles.group}>
                            <div style={styles.groupTitle}>{group.title}</div>
                            <div style={styles.groupItems}>
                                {group.items.map((item) => (
                                    <NavItem key={item.to} {...item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div style={styles.footer}>
                    <div style={styles.userChip}>
                        <div style={styles.userDot} />
                        <div style={{ overflow: "hidden" }}>
                            <div style={styles.userName}>
                                {JSON.parse(localStorage.getItem("authUser") || "{}")?.username || "User"}
                            </div>
                            <div style={styles.userMeta}>Authenticated</div>
                        </div>
                    </div>

                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </aside>

            <main style={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}

function NavItem({ to, label, icon: Icon }) {
    return (
        <NavLink
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : null),
            })}
        >
            <span style={styles.branch} />
            <Icon size={18} style={styles.icon} />
            <span style={styles.label}>{label}</span>
        </NavLink>
    );
}

const styles = {
    shell: {
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f4f6f6",
    },
    sidebar: {
        width: 260,
        background: "#dee0e0",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 14,
    },
    brandRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 10,
        borderRadius: 14,
        background: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(0,0,0,0.06)",
    },
    brandDot: {
        width: 12,
        height: 12,
        borderRadius: 999,
        background: "#a0f23d",
        boxShadow: "0 0 16px rgba(160,242,61,0.75)",
        flex: "0 0 auto",
    },
    brandTitle: { fontWeight: 800, letterSpacing: 0.2, color: "#0f1a12" },
    brandSub: { fontSize: 12, opacity: 0.7, marginTop: 2, color: "#0f1a12" },

    nav: { display: "flex", flexDirection: "column", gap: 10, flex: 1 },
    group: { display: "flex", flexDirection: "column", gap: 8 },
    groupTitle: {
        fontSize: 11,
        letterSpacing: 1.2,
        fontWeight: 700,
        opacity: 0.6,
        padding: "0 10px",
        color: "#0f1a12",
    },
    groupItems: { display: "flex", flexDirection: "column", gap: 6 },

    navItem: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 14,
        textDecoration: "none",
        color: "#0f1a12",
        border: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.35)",
    },
    navItemActive: {
        background: "rgba(255,255,255,0.72)",
        boxShadow: "0 0 18px rgba(160,242,61,0.35)",
        border: "1px solid rgba(160,242,61,0.55)",
    },
    branch: {
        width: 10,
        height: 10,
        borderRadius: 999,
        background: "#a0f23d",
        boxShadow: "0 0 14px rgba(160,242,61,0.65)",
        flex: "0 0 auto",
    },
    icon: { opacity: 0.9 },
    label: { fontSize: 14, fontWeight: 700 },

    footer: { display: "flex", flexDirection: "column", gap: 10 },
    userChip: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderRadius: 14,
        background: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(0,0,0,0.06)",
    },
    userDot: {
        width: 10,
        height: 10,
        borderRadius: 999,
        background: "#a0f23d",
        boxShadow: "0 0 14px rgba(160,242,61,0.65)",
        flex: "0 0 auto",
    },
    userName: { fontSize: 13, fontWeight: 800, color: "#0f1a12", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    userMeta: { fontSize: 11, opacity: 0.65, color: "#0f1a12" },

    logoutBtn: {
        height: 42,
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#0f1a12",
        color: "white",
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 0 18px rgba(160,242,61,0.25)",
    },

    main: { flex: 1, padding: 16 },
};
