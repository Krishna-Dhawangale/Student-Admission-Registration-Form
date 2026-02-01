import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection
const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Krishna@2006",
    database: "student_admission"
});

console.log("MySQL Connected Successfully");

// Create table if it doesn't exist
await db.execute(`
    CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(100),
        dob DATE,
        gender VARCHAR(10),
        email VARCHAR(100),
        mobile VARCHAR(15),
        address TEXT,
        city VARCHAR(50),
        state VARCHAR(50),
        pincode VARCHAR(10),
        father_name VARCHAR(100),
        mother_name VARCHAR(100),
        parent_mobile VARCHAR(15),
        occupation VARCHAR(50),
        school_10 VARCHAR(100),
        percent_10 DECIMAL(5,2),
        school_12 VARCHAR(100),
        percent_12 DECIMAL(5,2),
        cet_percentile DECIMAL(5,2),
        category VARCHAR(20),
        languages VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

console.log("Table created/verified successfully");

// Routes

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET - Fetch all students
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM students');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Fetch single student by ID
app.get('/api/students/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Add new student
app.post('/api/students', async (req, res) => {
    try {
        const {
            student_name, dob, gender, email, mobile, address, city, state, pincode,
            father_name, mother_name, parent_mobile, occupation, school_10, percent_10,
            school_12, percent_12, cet_percentile, category, languages
        } = req.body;

        const query = `
            INSERT INTO students (
                student_name, dob, gender, email, mobile, address, city, state, pincode,
                father_name, mother_name, parent_mobile, occupation, school_10, percent_10,
                school_12, percent_12, cet_percentile, category, languages
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            student_name, dob, gender, email, mobile, address, city, state, pincode,
            father_name, mother_name, parent_mobile, occupation, school_10, percent_10,
            school_12, percent_12, cet_percentile, category, languages
        ];

        const [result] = await db.execute(query, values);
        res.status(201).json({ 
            message: 'Student added successfully',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Update student
app.put('/api/students/:id', async (req, res) => {
    try {
        const {
            student_name, dob, gender, email, mobile, address, city, state, pincode,
            father_name, mother_name, parent_mobile, occupation, school_10, percent_10,
            school_12, percent_12, cet_percentile, category, languages
        } = req.body;

        const query = `
            UPDATE students SET
                student_name=?, dob=?, gender=?, email=?, mobile=?, address=?, city=?, state=?, pincode=?,
                father_name=?, mother_name=?, parent_mobile=?, occupation=?, school_10=?, percent_10=?,
                school_12=?, percent_12=?, cet_percentile=?, category=?, languages=?
            WHERE id=?
        `;

        const values = [
            student_name, dob, gender, email, mobile, address, city, state, pincode,
            father_name, mother_name, parent_mobile, occupation, school_10, percent_10,
            school_12, percent_12, cet_percentile, category, languages, req.params.id
        ];

        const [result] = await db.execute(query, values);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Delete student
app.delete('/api/students/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM students WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});