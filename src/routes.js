import express from 'express';
import { pool } from './db.js';

const feedbackRouter = express.Router();

// POST /feedback - fuegt neues Feedback hinzu
feedbackRouter.post('/feedback', async (req, res) => { 

    try {
        const { title, text } = req.body;

        if (!title || !text ) {
            return res.status(400).json({ message: "title und text sind im body erforderlich." })
        }
    
        const query = `INSERT INTO feedback (title, text) VALUES ($1, $2);`;
        await pool.query(query, [title, text]);
        res.status(201).json({ message: "Feedback erfolgreich gespeichert."});
    } catch (error) {
        console.error("Fehler beim Speichern des Feedbacks: " + error);
        res.status(500).json({ message: "Fehler beim Speichern des Feedbacks." });
    }

});

// GET /feedback - gibt alle Feedback Eintraege zurueck
feedbackRouter.get('/feedback', async (req, res) => {

    try {
        const query = `SELECT * FROM feedback;`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Fehler beim Abrufen des Feedbacks: " + error);
        res.status(500).json({ message: "Fehler beim Abrufen des Feedbacks." });
    }

});

// DELETE /feedback/title - Loescht Feedback mit dem gegebenen title
feedbackRouter.delete('/feedback/:title', async (req, res) => {

    try {
        const { title } = req.params;

        const query = `DELETE FROM feedback WHERE title = $1;`;
        const result = await pool.query(query, [title]);

        if ( result.rowCount === 0 ) {
            return res.status(404).json({ message: "Feedback nicht gefunden." });
        }

        res.status(200).json({ message: "Feedback erfolgreich geloescht." });

    } catch (error) {
        console.error("Fehler beim Loeschen des Feedbacks: " + error);
        res.status(500).json({ message: "Fehler beim Loeschen des Feedbacks." });
    }

});

export default feedbackRouter;

