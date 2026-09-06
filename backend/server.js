const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// FRONTEND
// ===============================

const frontendPath = path.join(__dirname, "..", "frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ===============================
// MYSQL DATABASE
// ===============================

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "vin",
    port: process.env.DB_PORT
        ? Number(process.env.DB_PORT)
        : 3306
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:");
        console.error(err.message);
        return;
    }

    console.log("Connected to MySQL database!");
});

// ===============================
// GET ALL STUDENTS
// ===============================

app.get("/api/students", (req, res) => {

    const sql = `
        SELECT *
        FROM students
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to get students"
            });
        }

        res.json(results);
    });
});

// ===============================
// GET ONE STUDENT
// ===============================

app.get("/api/students/:id", (req, res) => {

    const sql = `
        SELECT *
        FROM students
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to get student"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(results[0]);
    });
});

// ===============================
// REGISTER STUDENT
// ===============================

app.post("/api/students", (req, res) => {

    const {
        regNo,
        name,
        className,
        gender,
        age,
        dob,
        address,
        phone,
        guardian,
        guardianPhone,
        combination,
        admissionDate,
        notes
    } = req.body;

    if (
        !regNo ||
        !name ||
        !className ||
        !gender ||
        !age ||
        !address ||
        !guardian ||
        !guardianPhone
    ) {
        return res.status(400).json({
            error: "Please fill in all required fields."
        });
    }

    const sql = `
        INSERT INTO students
        (
            regNo,
            name,
            className,
            gender,
            age,
            dob,
            address,
            phone,
            guardian,
            guardianPhone,
            combination,
            admissionDate,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        regNo,
        name,
        className,
        gender,
        age,
        dob || null,
        address,
        phone || null,
        guardian,
        guardianPhone,
        combination || null,
        admissionDate || null,
        notes || null
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    error: "Registration number already exists."
                });
            }

            return res.status(500).json({
                error: "Failed to register student."
            });
        }

        res.status(201).json({
            message: "Student registered successfully.",
            id: result.insertId
        });
    });
});

// ===============================
// UPDATE STUDENT
// ===============================

app.put("/api/students/:id", (req, res) => {

    const {
        regNo,
        name,
        className,
        gender,
        age,
        dob,
        address,
        phone,
        guardian,
        guardianPhone,
        combination,
        admissionDate,
        notes
    } = req.body;

    const sql = `
        UPDATE students
        SET
            regNo = ?,
            name = ?,
            className = ?,
            gender = ?,
            age = ?,
            dob = ?,
            address = ?,
            phone = ?,
            guardian = ?,
            guardianPhone = ?,
            combination = ?,
            admissionDate = ?,
            notes = ?
        WHERE id = ?
    `;

    const values = [
        regNo,
        name,
        className,
        gender,
        age,
        dob || null,
        address,
        phone || null,
        guardian,
        guardianPhone,
        combination || null,
        admissionDate || null,
        notes || null,
        req.params.id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    error: "Registration number already exists."
                });
            }

            return res.status(500).json({
                error: "Failed to update student."
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.json({
            message: "Student updated successfully."
        });
    });
});

// ===============================
// DELETE STUDENT
// ===============================

app.delete("/api/students/:id", (req, res) => {

    const sql = `
        DELETE FROM students
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to delete student."
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.json({
            message: "Student deleted successfully."
        });
    });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
