/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: server.js
Files Required: None
Description:
API Calls:


 */




// ===============================
// Project_Nuclear Backend API
// ===============================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

// ===============================
// Middleware (ORDER MATTERS)
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- REQUIRED for form login

// ===============================
// MySQL Connection Pool
// ===============================
const db = mysql.createPool({
    host: "localhost",
    user: "project_nuclear",
    password: "B00l3an884488",
    database: "FoxBase_One",
    waitForConnections: true,
    connectionLimit: 10,
});

// ===============================
// Auth Middleware
// ===============================
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ ok: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ ok: false, message: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }
}

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
    res.send("Project_Nuclear API running");
});

app.get("/api/health/db", async (req, res) => {
    try {
        await db.query("SELECT 1");
        res.json({ ok: true, db: "connected" });
    } catch (err) {
        console.error("DB health error:", err);
        res.status(500).json({ ok: false, db: "disconnected" });
    }
});

// ===============================
// AUTH ROUTES
// ===============================
app.post("/api/auth/login", async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body || {};

        if (!emailOrUsername || !password) {
            return res.status(400).json({
                ok: false,
                message: "Missing email/username or password",
            });
        }

        const [rows] = await db.query(
            `SELECT id, username, email, password_hash
       FROM users
       WHERE username = ? OR email = ?
       LIMIT 1`,
            [emailOrUsername, emailOrUsername]
        );

        if (rows.length === 0) {
            return res.status(401).json({ ok: false, message: "Invalid credentials" });
        }

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.status(401).json({ ok: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({ ok: true, token });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            ok: false,
            message: "Login failed (server error)",
        });
    }
});

// ===============================
// PROJECT ROUTES (JWT PROTECTED)
// ===============================
app.get("/api/projects", requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, name, description, status FROM Projects ORDER BY id DESC"
        );
        res.json({ ok: true, projects: rows });
    } catch (err) {
        console.error("Error loading projects:", err);
        res.status(500).json({ ok: false, message: "Failed to load projects" });
    }
});

app.post("/api/projects", requireAuth, async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const [result] = await db.query(
            "INSERT INTO Projects (name, description, status) VALUES (?, ?, ?)",
            [name, description || "", status || "active"]
        );

        res.json({
            ok: true,
            id: result.insertId,
            message: "Project created",
        });
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ ok: false, message: "Failed to create project" });
    }
});

app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        const [result] = await db.query(
            "UPDATE Projects SET name = ?, description = ?, status = ? WHERE id = ?",
            [name, description || "", status || "active", id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Project not found" });
        }

        res.json({ ok: true, message: "Project updated" });
    } catch (err) {
        console.error("Error updating project:", err);
        res.status(500).json({ ok: false, message: "Failed to update project" });
    }
});

app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query("DELETE FROM Projects WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Project not found" });
        }

        res.json({ ok: true, message: "Project deleted" });
    } catch (err) {
        console.error("Error deleting project:", err);
        res.status(500).json({ ok: false, message: "Failed to delete project" });
    }
});

// ===============================
// Start Server (ONLY ONCE)
// ===============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Project_Nuclear API running on port ${PORT}`);
});
